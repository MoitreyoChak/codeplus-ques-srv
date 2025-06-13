import express from 'express';
import 'dotenv/config'
import cors from 'cors';
import globalErrorHandler from './utils/globalErrorHandler.js';
import questionRoutes from './routes/questionRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';
import { longPoll } from './controllers/long-polling.js';


const app = express();

app.use(express.json());

app.use(cors({
    origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

app.use("/code/question", questionRoutes);
app.use("/code/submission", submissionRoutes);
app.get("/code/fetchResults/:jobId", longPoll);


app.use("*", (req, res) => {
    res.send('route not found')
})

app.use(globalErrorHandler)
export default app;