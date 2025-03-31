import express from 'express';
const router = express.Router();
import {
    getSubmission, getAllSubmissionsByUser, postSubmission, updateSubmissionStatus
} from '../controllers/submissionController.js';

router.route("/").get((req, res) => {
    res.send('Hello World! from port 5001!')
});

router.route("/:subid").get(getSubmission);
router.route("/:id/:qid").post(postSubmission);
router.route("/:subid").patch(updateSubmissionStatus);

export default router;