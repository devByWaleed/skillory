import type { Response } from "express";
import ErrorHandler from "../config/ErrorHandler.js";
import CatchAsyncError from "../middleware/catchAsyncErrors.js";
import CourseModel from "../models/Courses.js";


// Create course
export const createCourse = CatchAsyncError(async (data: any, res: Response) => {
    const course = await CourseModel.create(data);
    return course;
});


// Get All Courses
export const getAllCoursesService = async (res: Response) => {
    const allCourses = await CourseModel.find().sort({ createdAt: -1 });
    res.status(201).json({
        success: true,
        allCourses,
    });
}