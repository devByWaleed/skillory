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


// Get All Users
export const getAllUsersService = async (res: Response) => {
    const allUsers = await UserModel.find().sort({ createdAt: -1 });
    res.status(201).json({
        success: true,
        allUsers,
    });
}


// Update User Role
export const updateUserRoleService = async (res: Response, email: string, role: string) => {
    const user = await UserModel.findOneAndUpdate({ email }, { role }, { new: true });
    const refreshTokenExpireDays = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "3", 10);
    const redisTtlInSeconds = refreshTokenExpireDays * 24 * 60 * 60;

    await redis.set(String(user?._id), JSON.stringify(user), "EX", redisTtlInSeconds);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "No user found with that email",
        });
    }

    res.status(201).json({
        success: true,
        user,
    });
}