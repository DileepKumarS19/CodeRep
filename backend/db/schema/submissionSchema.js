import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    problemSlug: {
        type: String,
        required: true,
        trim: true
    },
    language: {
        type: String,
        required: true,
        enum: ["java", "python", "javascript", "cpp"],
        default: "java"
    },
    code: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: [
            "Accepted",
            "Failed",
            "Compile Error",
            "Compile/Docker Error",
            "Server Error",
            "Time Limit Exceeded",
            "Runtime Error"
        ]
    },
    // store test results for displaying history later
    results: {
        total:  { type: Number, default: 0 },
        passed: { type: Number, default: 0 },
        failed: { type: Number, default: 0 },
    },
    // action that triggered this — only submit creates a record, but useful to track
    action: {
        type: String,
        enum: ["run", "submit"],
        default: "submit"
    }
}, { timestamps: true }); // createdAt and updatedAt automatically

// ── Indexes ──────────────────────────────────────────────────────────────────

// used by GET /api/submissions/solved
// "find all Accepted submissions for this user"
submissionSchema.index({ userId: 1, status: 1 });

// used for checking if user has submitted a specific problem before
// "find all submissions by this user for this problem"
submissionSchema.index({ userId: 1, problemSlug: 1 });

// used for leaderboard or admin queries — sort by newest submission
submissionSchema.index({ createdAt: -1 });

// ─────────────────────────────────────────────────────────────────────────────

export const SubmissionModel = mongoose.model("Submission", submissionSchema);