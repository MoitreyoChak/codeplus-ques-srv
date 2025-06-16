import express from 'express';
const router = express.Router();
import {
    getQuestion, getAllQuestions, getQuestionsByTag,
    getQuestionsByDifficulty, getFilteredQuestions, setQuestion
} from '../controllers/questionController.js';

router.route("/").get((req, res) => {
    res.send('Hello World Question from port 5001!')
}).post(setQuestion);

router.route("/get/:id").get(getQuestion);
router.route("/all").get(getAllQuestions);
router.route("/tags").get(getQuestionsByTag);
//use req.body to send tags
router.route("/difficulty").get(getQuestionsByDifficulty);
router.route("/filter").post(getFilteredQuestions);



export default router;