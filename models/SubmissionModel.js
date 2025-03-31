import mongoose from 'mongoose';
const { Schema } = mongoose;

const resultSchema = new mongoose.Schema({
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    actualOutput: { type: String, required: true },
    isCorrect: { type: Boolean, required: true }
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
        enum: ['c++', 'java', 'c'],
        default: 'c'
    },
    executionStatus: {
        type: String,
        enum: ['executed', 'pending'],
        default: 'pending'
    },
    results: [resultSchema],
},
    {
        timestamps: true,
    }
);

const Submission = mongoose.model("submissions", submission);
export { Submission };





