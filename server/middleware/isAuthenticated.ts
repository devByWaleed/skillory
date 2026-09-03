import { type NextFunction, type Request, type Response } from "express";
import CatchAsyncError from "./catchAsyncErrors.js";
import ErrorHandler from "../config/ErrorHandler.js";
import jwt, { type JwtPayload } from "jsonwebtoken";
// Dotenv configuration
import "dotenv/config"
import redis from "../config/redis.js";


// Authenticated User
export const isAuthenticated = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    // If updateAccessToken already authenticated this request (token was refreshed), trust it
    if (req.user) {
        return next();
    }

    const access_token = req.cookies.access_token;

    if (!access_token) {
        return next(new ErrorHandler("Please login to access resource", 400));
    } else {
        const tokenDecode = jwt.verify(access_token, process.env.ACCESS_TOKEN as string) as JwtPayload;

        if (!tokenDecode) {
            return next(new ErrorHandler("Access token is not valid", 400));
        }

        const user = await redis.get(tokenDecode.id);

        if (!user) {
            return next(new ErrorHandler("Please login to access resources", 400));
        }

        req.user = JSON.parse(user);

        next();
    }
});


// Validate user role
export const authorizeRole = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user?.role || "")) {
            return next(new ErrorHandler(`Role ${req.user?.role} is not allowed to access this resource`, 400));
        }
        next();
    }
};