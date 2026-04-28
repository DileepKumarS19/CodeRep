import dns from 'node:dns/promises';
dns.setServers(['1.1.1.1', '8.8.8.8']);

import { Worker } from "bullmq";
import Redis from "ioredis";
import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";
import mongoose from "mongoose";
import { ProblemModel } from "./db/schema/problemSchema.js";
import { SubmissionModel } from "./db/schema/submissionSchema.js";



async function connectToDb() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Worker is connected to MongoDB");
    } catch (err) {
        console.log(err);
    }
}
connectToDb();

const redisOptions = { maxRetriesPerRequest: null, family: 4 };
const connection = process.env.REDIS_URL
    ? new Redis(process.env.REDIS_URL, redisOptions)
    : new Redis(redisOptions);

console.log("Worker is running and waiting for jobs...");
const worker = new Worker("code-execution-queue", async (job) => {
    const { slug, code, action } = job.data;
    const runId = job.id;
    const tempDir = path.resolve(`./temp/${runId}`).replace(/\\/g, '/');

    try {
        // Fetch test cases from MongoDB
        const problem = await ProblemModel.findOne({ slug });
        if (!problem) throw new Error("Problem not found");

        const testCode = action === "run" ? problem.testSuite.java.run : problem.testSuite.java.submit;

        const classNameMatch = code.match(/class\s+([A-Za-z0-9_]+)\s*\{/);
        if (!classNameMatch) {
            return { success: false, status: "Compile Error", rawOutput: "Could not find a valid Java class name." };
        }

        const className = classNameMatch[1];
        const testClassName = `${className}Test`;

        await fs.mkdir(tempDir, { recursive: true });
        await fs.writeFile(path.join(tempDir, `${className}.java`), code);
        await fs.writeFile(path.join(tempDir, `${testClassName}.java`), testCode);

        // Your exact working Docker command
        const dockerCmd = `docker run --rm --network none --memory 512m --cpus 0.5 -v "${tempDir}":/app coderep-java sh -c "javac -cp /opt/junit.jar:/opt/assertj.jar *.java && java -cp /opt/junit.jar:/opt/assertj.jar:. org.junit.platform.console.ConsoleLauncher execute --disable-banner --disable-ansi-colors --select-class ${testClassName}"`
        // Wrap the old callback exec() in a Promise so BullMQ can await it
        return await new Promise((resolve, reject) => {
            exec(dockerCmd, { timeout: 20000 }, async (error, stdout, stderr) => {
                await fs.rm(tempDir, { recursive: true, force: true }).catch(() => { });

                let status, isSuccess, results;

                // 1. Handle Compile Errors
                if (error && !stdout.includes("tests found")) {
                    console.log(`[WORKER] Job #${job.id} Failed to compile.`);
                    status = "Compile Error";
                    isSuccess = false;
                    results = { total: 0, passed: 0, failed: 0 };
                } else {
                    // 2. Handle Test Results
                    const total = parseInt(stdout.match(/\[\s+(\d+)\s+tests found\s+\]/)?.[1] || "0");
                    const passed = parseInt(stdout.match(/\[\s+(\d+)\s+tests successful\s+\]/)?.[1] || "0");
                    const failed = parseInt(stdout.match(/\[\s+(\d+)\s+tests failed\s+\]/)?.[1] || "0");

                    isSuccess = failed === 0 && total > 0;
                    status = isSuccess ? "Accepted" : "Failed";
                    results = { total, passed, failed };
                    console.log(`[WORKER] Job #${job.id} Finished! Result: ${status}`);
                }

                // --- NEW DB LOGIC ---
                // Only save to DB if the user clicked "Submit" (not just "Run")
                // Only save to DB if the user clicked "Submit"
                if (job.data.action === "submit" && job.data.userId) {
                    try {
                        await SubmissionModel.create({
                            userId: job.data.userId,
                            problemSlug: job.data.slug,
                            language: "java",
                            code: job.data.code,
                            status: status,
                            results: results,      // ← add this line
                            action: job.data.action // ← add this line
                        })


                        // --- NEW: CACHE INVALIDATION ---
                        // If they passed, delete their old solved cache so the dashboard updates!
                        if (status === "Accepted") {
                            await connection.del(`cache:solved:${job.data.userId}`);
                        }
                        // -------------------------------

                    } catch (dbErr) {
                        console.error("Failed to save submission to DB:", dbErr);
                    }
                }
                // --------------------

                // Return the result back to Redis & WebSockets
                resolve({
                    success: isSuccess,
                    status: status,
                    results: results,
                    rawOutput: stdout,
                    errorOutput: stderr,
                    userId: job.data.userId
                });
            });
        });

    } catch (err) {
        await fs.rm(tempDir, { recursive: true, force: true }).catch(() => { });
        throw err; // Tells BullMQ the job completely crashed
    }

    // execute code
}, {
    connection,
    concurrency: 2
});