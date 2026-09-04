import http from "http";
import { app } from "./app.js";
import "dotenv/config"
import connectDB from "./config/mongodb.js";
import { initSocketServer } from "./socketServer.js";

const server = http.createServer(app);
initSocketServer(server);

const PORT = process.env.PORT || 4000;

connectDB();

server.listen(PORT, () => {
    console.log(`Server is connected on Port ${PORT}`);
});