import mongoose from 'mongoose';

process.loadEnvFile();

export default async function connectDB() {
    try {
        await mongoose.connect(process.env.URL);
        console.log("Database connected!");
    } catch (err) {
        console.log(err.message);
    }
}