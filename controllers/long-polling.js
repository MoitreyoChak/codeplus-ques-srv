import { Submission } from "../models/SubmissionModel.js";
import catchAsync from "../utils/catchAsync.js";

const longPoll = catchAsync(async (req, res) => {
    const { jobId } = req.params;
    let result;
    let resObj = {};
    let statusCode = 200;

    // Function to wait for the result
    const waitForResult = async () => {
        let i = 0;
        while (i < 20) { //wait for 20sec
            result = await Submission.findOne({ jobId });

            if (result?.executionStatus === "executed") {
                resObj.status = result.executionStatus;
                resObj.results = result.results;
                resObj.verdict = result.verdict;
                return true;
            }

            await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 sec and check again
            i++;
        }
    };

    const isExecuted = await waitForResult();
    if (!result) {
        statusCode = 404;
        resObj.message = `No submission for jobId ${jobId}`;
    }
    else if (!isExecuted) {
        resObj.status = result?.executionStatus;
    }

    return res.status(statusCode).json(resObj);
})

export { longPoll };