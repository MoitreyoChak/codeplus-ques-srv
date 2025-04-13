import { Question } from "../models/QuestionModel.js";
import catchAsync from "../utils/catchAsync.js";
import mongoose from "mongoose";
import { getJetStreamClients } from '../jetStreamSetup.js';


let resObj = {
    status: 'success'
}
let statusCode = 200;

const getQuestion = catchAsync(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        resObj = { status: 'error', message: 'Invalid question ID format. Please provide a valid MongoDB ObjectId.' }
        statusCode = 400;
    } else {
        const question = await Question.findById(req.params.id).select("-_id -__v -createdAt -updatedAt").lean();
        if (!question) {
            resObj = { status: 'error', message: 'Question not found!' }
            statusCode = 404;
        }
        else {
            resObj = { status: 'success', data: question }
            statusCode = 200;
        }
    }
    res.status(statusCode).json(resObj);
})
const getAllQuestions = catchAsync(async (req, res) => {
    let { page, limit } = req.query;

    page = parseInt(page) || 1;  // Default to page 1 if not provided
    limit = parseInt(limit) || 10;  // Default to 10 questions per page

    const skip = (page - 1) * limit;

    const questions = await Question.find()
        .sort({ createdAt: -1 })  // Sort by latest questions first
        .skip(skip)
        .limit(limit)
        .select("_id title tags difficulty")  // Exclude the __v field
        .lean();

    const totalQuestions = await Question.countDocuments();

    res.status(200).json({
        status: "success",
        page,
        limit,
        totalPages: Math.ceil(totalQuestions / limit),
        totalQuestions,
        data: questions,
    });
});

const getQuestionsByTag = catchAsync(async (req, res) => {
    let { tags } = req.body;
    let { page, limit } = req.query;

    if (!Array.isArray(tags) || tags.length === 0) {
        return res.status(400).json({ status: "error", message: "Please provide at least one tag." });
    }

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const skip = (page - 1) * limit;

    const questions = await Question.find({ tags: { $in: tags } })
        .sort({ createdAt: -1 })  // Latest first
        .skip(skip)
        .limit(limit)
        .select("_id title tags difficulty")
        .lean();

    const totalQuestions = await Question.countDocuments({ tags: { $in: tags } });

    res.status(200).json({
        status: "success",
        page,
        limit,
        totalPages: Math.ceil(totalQuestions / limit),
        totalQuestions,
        data: questions,
    });
});


const getQuestionsByDifficulty = catchAsync(async (req, res) => {
    let { difficulty } = req.body;
    let { page, limit } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const skip = (page - 1) * limit;

    // Ensure difficulty is valid
    if (!["Easy", "Medium", "Hard"].includes(difficulty)) {
        return res.status(400).json({ status: "error", message: "Invalid difficulty level!" });
    }

    const questions = await Question.find({ difficulty })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("_id title tags difficulty")
        .lean();

    const totalQuestions = await Question.countDocuments({ difficulty });

    res.status(200).json({
        status: "success",
        page,
        limit,
        totalPages: Math.ceil(totalQuestions / limit),
        totalQuestions,
        data: questions,
    });
});

const setQuestion = catchAsync(async (req, res) => {
    const question = {
        userId: req.body.problemSetterId,
        title: req.body.title,
        tags: req.body.tags,
        difficulty: req.body.difficulty,
        description: req.body.description,
        examples: req.body.examples,
        constraints: req.body.constraints,
        note: req.body.note ? req.body.note : "",
        testcases: req.body.testcases
    }
    const result = await Question.create(question);

    const { js, sc } = getJetStreamClients();

    try {
        await js.publish("question.created", sc.encode(JSON.stringify({
            id: req.body.problemSetterId,
            questionId: result._id.toString(),
            questionTitle: req.body.title
        })));
        console.log("✅ question published successfully!")
    } catch (error) {
        console.log("❌ Failed to publish question to JetStream:", error)
    }

    resObj = { status: 'success' }
    statusCode = 200;
    res.status(statusCode).json(resObj);
})

export {
    getQuestion, getAllQuestions,
    getQuestionsByTag, getQuestionsByDifficulty, setQuestion
}