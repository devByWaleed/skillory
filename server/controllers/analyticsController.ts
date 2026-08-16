import type { NextFunction, Request, Response } from "express";
import CatchAsyncError from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../config/ErrorHandler.js";
import { generateLast12MonthsData } from "../config/analyticsGenerator.js";
import UserModel from "../models/Users.js";
import CourseModel from "../models/Courses.js";
import OrderModel from "../models/Orders.js";


// Get user analytics -- only admin
export const getUserAnalytics = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await generateLast12MonthsData(UserModel);

        res.status(200).json({
            success: true,
            users
        });
    } catch (error: any) {
        // return next(error);
        return next(new ErrorHandler(error.message, 400));
    }
});


// Get course analytics -- only admin
export const getCourseAnalytics = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courses = await generateLast12MonthsData(CourseModel);

        res.status(200).json({
            success: true,
            courses
        });
    } catch (error: any) {
        // return next(error);
        return next(new ErrorHandler(error.message, 400));
    }
});


// Get order analytics -- only admin
export const getOrderAnalytics = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await generateLast12MonthsData(OrderModel);

        res.status(200).json({
            success: true,
            orders
        });
    } catch (error: any) {
        // return next(error);
        return next(new ErrorHandler(error.message, 400));
    }
});