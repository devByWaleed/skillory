import { app } from "./app.js";
// Dotenv configuration
import "dotenv/config"
import connectDB from "./config/mongodb.js";
// import { config } from "dotenv";
// config();

const PORT = process.env.PORT;

// Creating server
app.listen(PORT, () => {
    console.log(`Server is connected on Port ${PORT}`);
    connectDB();
});