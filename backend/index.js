import dns from 'node:dns/promises';

// Forces Node to use public DNS servers that support SRV records
dns.setServers(['1.1.1.1', '8.8.8.8']);
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { SigninSchema, SignupSchema } from './db/zod/zodValidation';
import bcrypt from "bcrypt";
import { UserModel } from "./db/schema/userSchema.js";
import jwt from 'jsonwebtoken';
import { ProblemModel } from './db/schema/problemSchema.js';
import { SubmissionModel } from './db/schema/submissionSchema.js';
import { v4 as uuidv4 } from 'uuid';
import fs from "fs/promises";
import { exec } from "child_process";
import path from "path"; 

const app = express();

app.use(cors());
app.use(express.json());

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token || token === "null" || token === "undefined") return res.status(401).json({ error: "Access denied. Please sign in." });
    
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid or expired token." });
        req.user = user;
        next();
    });
}

async function startServer() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB connected");

        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        })
    } catch (err) {
        console.log(err);
    }
}
startServer();

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/api/signup", async (req, res) => {
    const { success, data } = SignupSchema.safeParse(req.body);

    if (!success) {
        res.status(403).json({ message: "invalid username or password" });
    }
    try {
        const hashedPassword = await bcrypt.hash(data.password, parseInt(process.env.SALT_ROUNDS));
        const user = await UserModel.create({
            username: data.username,
            email: data.email,
            password: hashedPassword
        });
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "24h" }
        );
        res.status(200).json({ id: user._id, token: token })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Internal Error"
        })
    }
});

app.post("/api/signin", async (req, res) => {

    const result = SigninSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(403).json({
            message: "Invalid Info",
        })
    }

    const data = result.data;

    try {
        const user = await UserModel.findOne({
            email: data.email,
        });


        if (!user) {
            return res.status(401).json({
                message: "user not found",
            })
        }

        const isMatch = await bcrypt.compare(data.password, user.password);

        if (!isMatch) {
            res.status(401).json({
                message: "incorrect username or password"
            })
            return;
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "24h" }


        )

        res.status(200).json({
            id: user._id,
            token: token,
        })


    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "internal server error",
        })
    }

});

app.get("/api/problems", async (req, res) => {
    try {
        const problems = await ProblemModel.find();
        // console.log(problems);
        const problem = problems.map((p) => {
            return {
                title: p.title,
                slug: p.slug,
                difficulty: p.difficulty,
            }

        })
        res.status(200).json({ data: problem });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Internal Error"
        })
    }
})

app.get("/api/submissions/solved", authenticateToken, async (req, res) => {
    try {
        const submissions = await SubmissionModel.find({ 
            userId: req.user.id, 
            status: "Accepted" 
        }).select('problemSlug -_id');
        const solvedSlugs = [...new Set(submissions.map(s => s.problemSlug))];
        res.json({ data: solvedSlugs });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Error" });
    }
});


app.get("/api/problem/:name", async (req, res) => {
    try {
        const slug = req.params.name;
        const problem = await ProblemModel.findOne({ slug: slug });
        if (!problem) {
            res.status(404).json({
                message: "Problem not found",
            })
            return;
        }
        const data =
        {
            title: problem.title,
            difficulty: problem.difficulty,
            description: problem.description,
            starterCode: problem.starterCode,
            supportedLanguages: problem.supportedLanguages,
            topics: problem.topics,
        }
        res.status(200).json({ data: data });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Internal Error"
        })
    }
})

app.post("/api/execute", authenticateToken, async (req, res) => {
    const { slug, code, action } = req.body;

    // 1. Generate unique folder for this run
    const runId = uuidv4();
    // The .replace(/\\/g, '/') converts all Windows backslashes into forward slashes!
    const tempDir = path.resolve(`./temp/${runId}`);
    try {
        const problem = await ProblemModel.findOne({ slug });
        if (!problem) return res.status(404).json({ error: "Problem not found" });

        const testCode = action === "run" ? problem.testSuite.java.run : problem.testSuite.java.submit;

        const classNameMatch = code.match(/class\s+([A-Za-z0-9_]+)\s*\{/);
        if (!classNameMatch) {
            return res.status(400).json({ error: "Could not find a valid Java class name." });
        }

        const className = classNameMatch[1];
        const testClassName = `${className}Test`;

        await fs.mkdir(tempDir, { recursive: true });
        await fs.writeFile(path.join(tempDir, `${className}.java`), code);
        await fs.writeFile(path.join(tempDir, `${testClassName}.java`), testCode);

        // Make sure the classpath (-cp) includes BOTH .jar files!
        // Notice we replaced "java -jar /opt/junit.jar" with "java -cp /opt/junit.jar:/opt/assertj.jar:. org.junit.platform.console.ConsoleLauncher"
        const dockerCmd = `docker run --rm --network none --memory 512m --cpus 0.5 -v "${tempDir}":/app coderep-java sh -c "javac -cp /opt/junit.jar:/opt/assertj.jar *.java && java -cp /opt/junit.jar:/opt/assertj.jar:. org.junit.platform.console.ConsoleLauncher --disable-banner --disable-ansi-colors --select-class ${testClassName}"`;
        exec(dockerCmd, { timeout: 20000 }, async (error, stdout, stderr) => {

            await fs.rm(tempDir, { recursive: true, force: true }).catch(() => { });

            // UPDATED ERROR HANDLER: Spit out EVERYTHING so we can debug easily!
            if (error && !stdout.includes("tests found")) {
                if (action === "submit") {
                    await SubmissionModel.create({
                        userId: req.user.id,
                        problemSlug: slug,
                        language: "java",
                        code: code,
                        status: "Compile/Docker Error"
                    });
                }
                return res.json({
                    success: false,
                    status: "Compile/Docker Error",
                    details: {
                        nodeError: error.message,
                        javaStdErr: stderr,
                        javaStdOut: stdout
                    }
                });
            }

            // The Parser
            const total = parseInt(stdout.match(/\[\s+(\d+)\s+tests found\s+\]/)?.[1] || "0");
            const passed = parseInt(stdout.match(/\[\s+(\d+)\s+tests successful\s+\]/)?.[1] || "0");
            const failed = parseInt(stdout.match(/\[\s+(\d+)\s+tests failed\s+\]/)?.[1] || "0");

            const isAccepted = failed === 0 && total > 0;
            const status = isAccepted ? "Accepted" : "Failed";

            if (action === "submit") {
                await SubmissionModel.create({
                    userId: req.user.id,
                    problemSlug: slug,
                    language: "java",
                    code: code,
                    status: status
                });
            }

            res.json({
                success: isAccepted,
                status: status,
                results: { total, passed, failed },
                rawOutput: stdout
            });
        });

    } catch (err) {
        await fs.rm(tempDir, { recursive: true, force: true }).catch(() => { });
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});