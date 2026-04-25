// backend/db/schema/problemSchema.js
import mongoose from "mongoose"

const testSuiteLanguageSchema = new mongoose.Schema({
  run: String,      // first 2 tests only
  submit: String    // all tests
}, { _id: false })

const problemSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    default: "Medium"
  },
  topics: [String],
  description: String,
  examples: [{
    input: String,
    output: String,
    explanation: String,
    _id: false
  }],
  supportedLanguages: [String],
  starterCode: {
    java: String,
    python: String,
    javascript: String,
    cpp: String
  },
  testSuite: {
    java: testSuiteLanguageSchema,
    python: testSuiteLanguageSchema,
    javascript: testSuiteLanguageSchema,
    cpp: testSuiteLanguageSchema
  },
  executionLimits: {
    timeLimit: { type: Number, default: 2000 },
    memoryLimit: { type: Number, default: 256 }
  }
}, { timestamps: true })

export const ProblemModel = mongoose.model("Problem", problemSchema);