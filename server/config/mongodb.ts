import mongoose from "mongoose";
// Dotenv configuration
import "dotenv/config"


const URI = process.env.MONGODB_URI

const connectDB = async () => {
    try {
        // Set up event listeners BEFORE connecting
        mongoose.connection.once('connected', () => {
            console.log("✅ Database Connected Successfully");
        });

        mongoose.connection.on('error', (err) => {
            console.error("❌ MongoDB Connection Error:", err.message);
        });

        // Connect to MongoDB
        await mongoose.connect(`${URI}/LMS`, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s
            socketTimeoutMS: 45000,
        });

        console.log("✅ MongoDB connection established");

    } catch (error: any) {
        console.error("❌ Failed to connect to MongoDB:", error.message);
        // Re-throw the error so the caller knows it failed
        throw error;
    }
};

export default connectDB;