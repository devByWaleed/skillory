import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// Dotenv configuration
import "dotenv/config"
import { ErrorMiddleware } from "./middleware/error.js"
import userRouter from "./routes/userRoutes.js";
import { connectCloudinary } from "./config/cloudinary.js";
import courseRouter from "./routes/courseRoutes.js";
import orderRouter from "./routes/orderRoutes.js";

export const app = express();

// Body parser
app.use(express.json({ limit: "50mb" }));

// Cookie parser
app.use(cookieParser());

// CORS configuration
const allowedOrigin = process.env.ORIGIN;
app.use(cors({
    origin: allowedOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

await connectCloudinary();

// API Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/order", orderRouter);

// Testing API
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API Is Working!"
    });
});

// Unknown routes
/*
app.all("(.*)", (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.statusCode = 404;
    next(err);
});
*/


// Using Error Middleware
app.use(ErrorMiddleware);