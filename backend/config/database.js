import mongoose from 'mongoose';
import dotenv from "dotenv"
dotenv.config()

export default async function connectDB() {
    try {
        await mongoose.connect(process.env.URL);
        console.log("Database connected!");
    } catch (err) {
        console.log(err.message);
    }
}