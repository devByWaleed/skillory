import { type NextFunction, type Request, type Response } from "express";

import ErrorHandler from "../config/ErrorHandler.js";

export const ErrorMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // If headers are already sent, delegate to default Express error handler
    if (res.headersSent) {
        return next(err);
    }

    // Wrong mongodb ID error
    if (err.name === "CastError") {
        const message = `Request not found. Invalid ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    // Duplicate key error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message, 400);
    }

    // Wrong JWT error
    if (err.name === "JsonWebTokenError") {
        err = new ErrorHandler("Access token is invalid, please login again", 401);
    }

    // JWT expired error
    if (err.name === "TokenExpiredError") {
        err = new ErrorHandler("Access token expired, please login again", 401);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    });
}