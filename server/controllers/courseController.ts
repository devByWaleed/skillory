import { type NextFunction, type Request, type Response } from "express";
import ErrorHandler from "../config/ErrorHandler.js";
import CatchAsyncError from "../middleware/catchAsyncErrors.js";
import cloudinary from "cloudinary";
import { createCourse } from "../services/courseService.js";
import CourseModel from "../models/Courses.js";
import redis from "../config/redis.js";


// Upload Course
export const uploadCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;

        if (thumbnail) {
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                folder: "LMS/courses"
            });

            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            };
        }

        await createCourse(data, res, next);

        res.status(200).json({
            success: true,
            message: "Course created successfully!",
        });
    } catch (error: any) {
        // return next(error);
        return next(new ErrorHandler(error.message, 500));
    }
});


// Editing Course
export const editCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;
        const courseID = req.params.id;

        // Only re-upload if thumbnail is a NEW image (string), not the existing {public_id, url} object
        if (thumbnail && typeof thumbnail === "string") {
            const existingCourse = await CourseModel.findById(courseID);

            // Delete the OLD image from Cloudinary (using what's already saved in DB, not client input)
            if (existingCourse?.thumbnail && (existingCourse.thumbnail as any).public_id) {
                await cloudinary.v2.uploader.destroy((existingCourse.thumbnail as any).public_id);
            }

            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                folder: "LMS/courses"
            });

            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            };
        }
        // else: thumbnail is either unchanged (already {public_id, url}) or omitted — do nothing, let $set keep it

        const course = await CourseModel.findByIdAndUpdate(courseID, {
            $set: data,
        }, { new: true });

        res.status(200).json({
            success: true,
            message: "Course updated successfully!",
            course
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Get single course --- without purchasing
export const getSingleCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const courseID = req.params.id;
        // const isCacheExist = await redis.get(courseID);
        // Argument of type 'string | string[] | undefined' is not assignable to parameter of type 'RedisKey'. Type 'undefined' is not assignable to type 'RedisKey'.
        const isCacheExist = await redis.get(String(courseID));

        if (isCacheExist) {
            const course = JSON.parse(isCacheExist);
            console.log("Hitting Redis");
            res.status(200).json({
                success: true,
                course
            });
        }
        else {
            const course = await CourseModel.findById(req.params.id).select("-courseData.videoURL -courseData.suggestion -courseData.questions -courseData.links");

            // Update session in Redis with TTL in seconds
            const userIdStr = String(courseID);
            const refreshTokenExpireDays = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "3", 10);
            const redisTtlInSeconds = refreshTokenExpireDays * 24 * 60 * 60;

            await redis.set(userIdStr, JSON.stringify(course), "EX", redisTtlInSeconds);
            console.log("Hitting MongoDB");

            res.status(200).json({
                success: true,
                course
            });
        }
    } catch (error: any) {
        // return next(error);
        return next(new ErrorHandler(error.message, 400));
    }
});


// Get single course --- without purchasing
export const getAllCourses = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const isCacheExist = await redis.get("allCourses");

        if (isCacheExist) {
            const allCourses = JSON.parse(isCacheExist);
            console.log("Hitting Redis");

            res.status(200).json({
                success: true,
                allCourses
            });
        } else {

            const allCourses = await CourseModel.find().select("-courseData.videoURL -courseData.suggestion -courseData.questions -courseData.links");

            // Update session in Redis with TTL in seconds

            const refreshTokenExpireDays = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "3", 10);
            const redisTtlInSeconds = refreshTokenExpireDays * 24 * 60 * 60;

            await redis.set("allCourses", JSON.stringify(allCourses), "EX", redisTtlInSeconds);
            console.log("Hitting MongoDB");


            res.status(200).json({
                success: true,
                allCourses
            });
        }
    } catch (error: any) {
        // return next(error);
        return next(new ErrorHandler(error.message, 400));
    }
});







// Upload / Create Course
// export const PPP = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     try {

//         res.status(200).json({
//             success: true,
//             message: "Avatar updated successfully!",
//         });
//     } catch (error: any) {
//         // return next(error);
//         return next(new ErrorHandler(error.message, 400));
//     }
// });