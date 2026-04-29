import dns from 'node:dns/promises';

// Forces Node to use public DNS servers that support SRV records
dns.setServers(['1.1.1.1', '8.8.8.8']);
import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import { SigninSchema, SignupSchema } from './db/zod/zodValidation';
import bcrypt from "bcrypt";
import { UserModel } from "./db/schema/userSchema.js";
import jwt from 'jsonwebtoken';
import { ProblemModel } from './db/schema/problemSchema.js';
import { SubmissionModel } from './db/schema/submissionSchema.js';
import { createServer } from 'node:http';
import { Queue, QueueEvents } from "bullmq"
import IORedis from "ioredis"
import rateLimit from "express-rate-limit";

// Connect to Redis and define the Queue
const redisOptions = { maxRetriesPerRequest: null, family: 4 };
const connection = process.env.REDIS_URL 
    ? new IORedis(process.env.REDIS_URL, redisOptions) 
    : new IORedis(redisOptions);
const executionQueue = new Queue("code-execution-queue", { connection });

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173"
}))
app.use(express.json());


const httpServer = createServer(app);


const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

const queueEvents = new QueueEvents("code-execution-queue", { connection });

// put this ONCE at top level after io is created
io.on("connection", (socket) => {
    socket.on("join", (userId) => {
        socket.join(userId)
        console.log(`User ${userId} joined their socket room`)
    })
})

// completed — emit only to the specific user
queueEvents.on("completed", ({ jobId, returnvalue }) => {
    console.log(`Broadcasting Job #${jobId} to frontend!`);
    let parsed = returnvalue;
    if (typeof returnvalue === 'string') {
        try {
            parsed = JSON.parse(returnvalue);
        } catch (e) {
            console.error("Failed to parse returnvalue", e);
        }
    }
    
    if (parsed?.userId) {
        console.log(`Sending to specific user: ${parsed.userId}`);
        io.to(parsed.userId).emit(`jobResult-${jobId}`, parsed);
    } else {
        console.log(`Sending to all users (fallback)`);
        io.emit(`jobResult-${jobId}`, parsed); // fallback
    }
})

// failed — fetch job to get userId
queueEvents.on("failed", async ({ jobId, failedReason }) => {
    console.log(`Broadcasting Job #${jobId} FAILURE to frontend!`)
    try {
        const job = await executionQueue.getJob(jobId)
        const userId = job?.data?.userId
        const payload = { success: false, status: "Server Error", rawOutput: failedReason }
        if (userId) {
            io.to(userId).emit(`jobResult-${jobId}`, payload)
        } else {
            io.emit(`jobResult-${jobId}`, payload)
        }
    } catch {
        io.emit(`jobResult-${jobId}`, { success: false, status: "Server Error" })
    }
})



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


const executeLimit = rateLimit({
    windowMs: 60 * 1000,  // 1 minute
    max: 10,              // 10 submissions per minute per IP
    message: { error: "Too many submissions. Slow down." }
})

async function startServer() {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            serverSelectionTimeoutMS: 60000,
            socketTimeoutMS: 45000,
        });
        console.log("MongoDB connected");
        const PORT = process.env.PORT || 3000;

        httpServer.listen(PORT, () => {
            console.log(`Server & WebSockets are running on port ${PORT}`);
        });
    } catch (err) {
        console.log("STARTUP ERROR:", err); // Added better error logging
    }
}
startServer();

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/api/signup", async (req, res) => {
    const { success, data } = SignupSchema.safeParse(req.body);

    if (!success) {
        return res.status(403).json({ message: "invalid username or password" });
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
        // 1. Check Redis FIRST 
        const cachedProblems = await connection.get("cache:all_problems");

        if (cachedProblems) {
            console.log(" Cache HIT for problems list!");
            // Redis stores everything as strings, so we parse it back to JSON
            return res.status(200).json({ data: JSON.parse(cachedProblems) });
        }

        console.log("Cache MISS for problems list. Hitting MongoDB...");

        // 2. If not in Redis, do the expensive MongoDB query
        const problems = await ProblemModel.find();
        const problemData = problems.map((p) => ({
            title: p.title,
            slug: p.slug,
            difficulty: p.difficulty,
        }));

        // 3. Save the result into Redis so the next user gets the fast version!
        // .setex means "Set with Expiration". We cache it for 3600 seconds (1 hour).
        await connection.setex("cache:all_problems", 3600, JSON.stringify(problemData));

        res.status(200).json({ data: problemData });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Error" });
    }
});

app.get("/api/submissions/solved", authenticateToken, async (req, res) => {
    try {
        // 1. Create a unique cache key for THIS specific user
        const cacheKey = `cache:solved:${req.user.id}`;

        // 2. Check Redis
        const cachedSolved = await connection.get(cacheKey);

        if (cachedSolved) {
            console.log(`Cache HIT for user ${req.user.id}'s solved list!`);
            return res.json({ data: JSON.parse(cachedSolved) });
        }

        console.log(`Cache MISS for user ${req.user.id}'s solved list. Hitting MongoDB...`);

        // 3. Do the expensive DB Query
        const submissions = await SubmissionModel.find({
            userId: req.user.id,
            status: "Accepted"
        }).select('problemSlug -_id');

        const solvedSlugs = [...new Set(submissions.map(s => s.problemSlug))];

        // 4. Save to Redis (Cache it for 24 hours - 86400 seconds)
        await connection.setex(cacheKey, 86400, JSON.stringify(solvedSlugs));

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

// 1. Add authenticateToken middleware here!
app.post("/api/execute", executeLimit, authenticateToken, async (req, res) => {
    const { slug, code, action } = req.body;
    const userId = req.user.id; // 2. Extract the user ID from the JWT

    try {
        // 3. Tape the userId to the job data!
        const job = await executionQueue.add("execute-job", { slug, code, action, userId });

        return res.status(202).json({
            success: true,
            status: "Queued",
            jobId: job.id,
            message: "Your code is waiting in line to be executed."
        });

    } catch (error) {
        console.error("Queue Error:", error);
        return res.status(500).json({ error: "Failed to queue job" });
    }
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: "Internal server error" })
})