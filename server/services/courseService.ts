import type { Response } from "express";
import ErrorHandler from "../config/ErrorHandler.js";
import CatchAsyncError from "../middleware/catchAsyncErrors.js";
import CourseModel from "../models/Courses.js";


// Create course
export const createCourse = CatchAsyncError(async (data: any, res: Response) => {

    const course = await CourseModel.create(data);

    res.status(201).json({
        success: true,
        course
    });
});