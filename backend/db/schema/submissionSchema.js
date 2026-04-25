import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    problemSlug: { type: String, required: true },
    language: { type: String, required: true },
    code: { type: String, required: true },
    status: { type: String, required: true },
}, { timestamps: true });

export const SubmissionModel = mongoose.model("Submission", submissionSchema);
