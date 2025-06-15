import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { connectRabbitMQ } from "../rabbitmq.js";
import { Submission } from "../models/SubmissionModel.js";
import catchAsync from "../utils/catchAsync.js";

const channel = await connectRabbitMQ();

let resObj = {
    status: 'success'
}
let statusCode = 200;

const getSubmission = catchAsync(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.subid)) {
        resObj = { status: 'error', message: 'Invalid question ID format. Please provide a valid MongoDB ObjectId.' }
        statusCode = 400;
    } else {
        const sub = await Submission.findById(req.params.subid).select("-_id -__v -createdAt -updatedAt").lean();
        if (!sub) {
            resObj = { status: 'error', message: 'Submission not found!' }
            statusCode = 404;
        }
        else {
            resObj = { status: 'success', data: sub }
            statusCode = 200;
        }
    }
    res.status(statusCode).json(resObj);
})
const getAllSubmissionsByUser = catchAsync(async (req, res) => { })

const postSubmission = catchAsync(async (req, res) => {
    const { language, sourceCode, testcases, questionTitle, problemSetterName } = req.body;
    const { id, qid } = req.params;
    console.log(`Received submission from user ${id} for question ${qid} with language ${language}`);
    console.log("req.body", req.body);

    console.log("testCases testing 1: ", testcases);

    const jobId = uuidv4(); // Generate a unique job ID
    let result;

    try {
        result = await Submission.create({
            userId: id,
            questionId: qid,
            questionTitle,
            jobId,
            code: sourceCode,
            submissionResult: "",
            language,
            executionStatus: "pending"
        });
    } catch (error) {
        console.log(`Error creating submission: ${error}`);
    }
    // console.log(`Created submission: ${result}`);

    const msg = JSON.stringify({ id, qid, jobId, sourceCode, testcases, submissionId: result._id.toString(), questionTitle, problemSetterName })
    // Push the job to RabbitMQ
    channel.sendToQueue(`${language}-code-queue`, Buffer.from(msg), { persistent: true });

    resObj = { status: 'success', jobId, submissionId: result._id.toString() } // Return jobId to the frontend
    statusCode = 200;
    res.status(statusCode).json(resObj);
})


const updateSubmissionStatus = catchAsync(async (req, res) => {
    const sub = await Submission.findById(req.params.subid);

    const updateObj = { executionStatus: req.body.status };
    const updatedSub = await Submission.findByIdAndUpdate(
        req.params.subid,
        updateObj,
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(200).json({
        status: "success",
    });
})

export {
    getSubmission, getAllSubmissionsByUser,
    postSubmission, updateSubmissionStatus
}