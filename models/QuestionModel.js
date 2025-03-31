import mongoose from "mongoose";
const { Schema } = mongoose;

const testCaseSchema = new mongoose.Schema({
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true }
});

const question = new Schema(
    {
        userId: Schema.ObjectId,
        title: {
            type: String,
            required: [true, "Title required"],
        },
        tags: {
            type: [String],
            required: [true, "Atleast 1 tag is required"],
        },
        difficulty: {
            type: String,
            enum: ['Easy', 'Medium', 'Hard'],
            default: 'Medium'
        },
        description: {
            type: String,
            required: [true, "Please provide a description for the question"],
        },
        note: {
            type: String,
            default: ''
        },
        examples: [
            { input: String, output: String, explanation: String }
        ],
        constraints: {
            type: [String],
            required: [true, " please provide Constraints for the question"],
        },
        testcases: [testCaseSchema]
    },
    {
        timestamps: true,
    }
);

const Question = mongoose.model("Questions", question);
export { Question };