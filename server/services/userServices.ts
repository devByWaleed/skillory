import { type Response, type NextFunction } from "express";
import UserModel from "../models/Users.js";
import ErrorHandler from "../config/ErrorHandler.js";
import redis from "../config/redis.js";

// Get user by ID
export const getUserByID = async (id: string, res: Response, next: NextFunction) => {
    let user;
    const userJson = await redis.get(id);
    if (userJson) {
        user = JSON.parse(userJson);
    }
    // else {
    //     // Fallback to database if missing in Redis
    //     user = await UserModel.findById(id);
    // }

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({
        success: true,
        user,
    });
};