import http from "http";
import { app } from "./app.js";
// Dotenv configuration
import "dotenv/config"
import connectDB from "./config/mongodb.js";
// import { config } from "dotenv";
// config();
import { initSocketServer } from "./socketServer.js";


const server = http.createServer(app);
initSocketServer(server);

const PORT = process.env.PORT;

// Creating server
server.listen(PORT, () => {
    console.log(`Server is connected on Port ${PORT}`);
    connectDB();
});