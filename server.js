import mongoose from "mongoose";
import app from "./app.js";
import { initJetStream } from './jetStreamSetup.js';

const PORT = 5001;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/userdb";
// const MONGODB_URI = "mongodb://localhost:27017/userdb";

let isConnected = false;

const connectDB = async () => {
    // if (isConnected) {
    //     console.log("Using existing MongoDB connection");
    //     return;
    // }
    try {
        const { connection } = await mongoose.connect(MONGODB_URI);
        isConnected = connection.readyState === 1;

        console.log(`Connected to MongoDB at: ${connection.host}:${connection.port}`);
        console.log(`Database name: ${connection.name}`);

        if (isConnected) {
            console.log("✅ Successfully connected to MongoDB");
            return Promise.resolve(true);
        }
    } catch (error) {
        console.error(error);
        return Promise.reject(error);
    }
};

await connectDB();
await initJetStream();

app.listen(PORT, () => {
    console.log(`✅ listening on port ${PORT}`);
});