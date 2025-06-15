import mongoose from 'mongoose';
const { Schema } = mongoose;

const parameterSchema = new mongoose.Schema({
    key: { type: String, required: true },
    value: { type: String, required: true }, // Store as string regardless of type
    type: { type: String, required: true, enum: ['array', 'string', 'number'] }
});

const resultSchema = new mongoose.Schema({
    parameters: [parameterSchema],
    expectedOutput: { type: String, required: true },
    actualOutput: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
    status: { type: String, required: true, enum: ['passed', 'failed'] },
    compileErrorMessage: { type: String } // Optional, for compilation errors
});

const submission = new Schema({
    userId: {
        type: Schema.ObjectId,
        required: [true, 'Please provide userId (submitter)!']
    },
    questionId: {
        type: Schema.ObjectId,
        required: [true, 'Please provide question ID!']
    },
    jobId: {
        type: String,
        required: [true, 'Please provide jobID!']
    },
    code: {
        type: String,
        required: [true, 'Cannot make submission without code!']
    },
    language: {
        type: String,
        enum: ['cpp', 'java', 'c'],
        default: 'c'
    },
    executionStatus: {
        type: String,
        enum: ['executed', 'pending'],
        default: 'pending'
    },
    results: [resultSchema],
    verdict: {
        type: String,
        enum: ['AC', 'WA', 'compilation-error', 'runtime-error', 'TLE'],
    },
},
    {
        timestamps: true,
    }
);

submission.index({ jobId: 1 });

const Submission = mongoose.model("submissions", submission);
export { Submission };

