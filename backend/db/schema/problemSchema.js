import mongoose from "mongoose";

const problemSchema = new mongoose.Schema({
    slug: { type: String, unique: true, required: true },
    title: { type: String, required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    description: { type: String, required: true },
    topics: { type: [String], default: [] },
    
    // UI: The examples shown in the problem description
    examples: [{
        input: String,
        output: String,
        explanation: String,
    }],

    // UI: What languages can the user select for this specific problem?
    // e.g., ["java", "python", "javascript"]
    supportedLanguages: { type: [String], required: true },

    // The code that shows up in the editor when a user selects a language
    starterCode: {
        java: String,
        python: String,
        javascript: String
    },

    // Execution Engine: The actual test files
    testSuite: {
        java: String,
        python: String,
        javascript: String
    },

    // Execution Engine: Limits to prevent server crashing or infinite loops
    executionLimits: {
        timeLimit: { type: Number, default: 2000 },   // in milliseconds (e.g., 2 seconds)
        memoryLimit: { type: Number, default: 256 }   // in megabytes (e.g., 256 MB)
    }
}, { timestamps: true }); // Adds createdAt and updatedAt automatically

export const ProblemModel = mongoose.model("Problem", problemSchema);
