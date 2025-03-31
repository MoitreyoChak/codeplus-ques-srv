import express from 'express';
import 'dotenv/config'
import globalErrorHandler from './utils/globalErrorHandler.js';
import questionRoutes from './routes/questionRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';


const app = express();

app.use(express.json());

app.use("/code/question", questionRoutes);
app.use("/code/submission", submissionRoutes);


app.use("*", (req, res) => {
    res.send('route not found')
})

app.use(globalErrorHandler)
export default app;