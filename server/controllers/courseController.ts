import { type NextFunction, type Request, type Response } from "express";
import ErrorHandler from "../config/ErrorHandler.js";
import CatchAsyncError from "../middleware/catchAsyncErrors.js";
import cloudinary from "cloudinary";
import { createCourse, getAllCoursesService } from "../services/courseService.js";
import CourseModel from "../models/Courses.js";
import redis from "../config/redis.js";
import mongoose from "mongoose";
import path from "path";
import ejs from 'ejs';
import { fileURLToPath } from 'url';
import sendMail from "../config/nodeMailer.js";
import NotificationModel from "../models/Notifications.js";
import axios from "axios";

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


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
            // const refreshTokenExpireDays = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "3", 10);
            // const redisTtlInSeconds = refreshTokenExpireDays * 24 * 60 * 60;

            await redis.set(userIdStr, JSON.stringify(course), "EX", 604800); // 7 days
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
        const allCourses = await CourseModel.find().select("-courseData.videoURL -courseData.suggestion -courseData.questions -courseData.links");

        res.status(200).json({
            success: true,
            allCourses
        });

    } catch (error: any) {
        // return next(error);
        return next(new ErrorHandler(error.message, 400));
    }
});


// // Get Course Content
// export const getCourseByUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const userCourseList = req.user?.courses;
//         const courseID = req.params.id;

//         const isCourseExists = userCourseList?.some((course: any) => {
//             if (!course) return false;

//             // Extracts ID safely across all possible schema formats
//             const targetCourseId =
//                 course.courseId?._id?.toString() ||
//                 course.courseId?.toString() ||
//                 course._id?.toString() ||
//                 (typeof course === 'string' ? course : null);

//             return targetCourseId === courseID;
//         });

//         if (!isCourseExists) {
//             return next(new ErrorHandler("You have no access for this course!", 404));
//         }

//         const course = await CourseModel.findById(courseID);
//         if (!course) {
//             return next(new ErrorHandler("Course not found", 404));
//         }

//         const content = course.courseData;

//         res.status(200).json({
//             success: true,
//             message: "Course Content",
//             content
//         });
//     } catch (error: any) {
//         return next(new ErrorHandler(error.message, 400));
//     }
// });

// Get Course Content
export const getCourseByUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userCourseList = req.user?.courses;
        const courseID = req.params.id;
        const isAdmin = req.user?.role === "admin";

        const isCourseExists = userCourseList?.some((course: any) => {
            if (!course) return false;

            // Extracts ID safely across all possible schema formats
            const targetCourseId =
                course.courseId?._id?.toString() ||
                course.courseId?.toString() ||
                course._id?.toString() ||
                (typeof course === 'string' ? course : null);

            return targetCourseId === courseID;
        });

        // Allow access if the course is purchased OR if the user is an admin
        if (!isCourseExists && !isAdmin) {
            return next(new ErrorHandler("You have no access for this course!", 404));
        }

        const course = await CourseModel.findById(courseID);
        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        }

        const content = course.courseData;

        res.status(200).json({
            success: true,
            message: "Course Content",
            content
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});



// Add Question in course
interface IAddQuestion {
    question: string;
    courseID: string;
    contentID: string;
};

export const addQuestion = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { question, courseID, contentID }: IAddQuestion = req.body;

        const course = await CourseModel.findById(courseID);

        if (!mongoose.Types.ObjectId.isValid(contentID)) {
            return next(new ErrorHandler("Invalid content ID", 400));
        }

        const courseContent = course?.courseData?.find((item: any) => item._id.equals(contentID));

        if (!courseContent) {
            return next(new ErrorHandler("Invalid content ID", 400));
        }

        // Create a new question object
        const newQuestion: any = {
            user: req.user,
            question,
            questionReplies: []
        }

        // Add this question to our course content
        courseContent.questions.push(newQuestion);

        // Create new notification
        await NotificationModel.create({
            userID: String(req?.user._id),
            title: "New Question Received",
            message: `You have a new question in course: ${courseContent.title}`,
        });

        // Save the updated course
        await course?.save();

        res.status(200).json({
            success: true,
            course
        });
    } catch (error: any) {
        // return next(error);
        return next(new ErrorHandler(error.message, 400));
    }
});



// Add question in course content
interface IAddAnswerData {
    answer: string;
    courseID: string;
    contentID: string;
    questionID: string;
};

// export const addAnswer = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { answer, courseID, contentID, questionID }: IAddAnswerData = req.body;

//         const course = await CourseModel.findById(courseID);

//         if (!mongoose.Types.ObjectId.isValid(contentID)) {
//             return next(new ErrorHandler("Invalid content ID", 400));
//         }

//         const courseContent = course?.courseData?.find((item: any) => item._id.equals(contentID));

//         if (!courseContent) {
//             return next(new ErrorHandler("Invalid content ID", 400));
//         }

//         const question = courseContent?.questions?.find((item: any) => item._id.equals(questionID));

//         if (!question) {
//             return next(new ErrorHandler("Invalid content ID", 400));
//         }

//         // Create a new answer
//         const newAnswer: any = {
//             user: req.user,
//             answer
//         }

//         // Add this answer to course content
//         question?.questionReplies.push(newAnswer);

//         await course?.save();

//         if (req.user?._id === question._id) {
//             // Create a notification
//             // Create new notification
//             await NotificationModel.create({
//                 userID: String(req.user._id),
//                 title: "New Question Reply Received",
//                 message: `You have a new question in course: ${courseContent.title}`,
//             });
//         } else {
//             const data = {
//                 name: question.user.name,
//                 title: courseContent.title
//             }

//             const html = await ejs.renderFile(path.join(__dirname, "../mails/question-reply.ejs"), data);

//             try {
//                 await sendMail({
//                     email: question.user.email,
//                     subject: "Question Reply",
//                     template: "question-reply.ejs",
//                     data
//                 });
//             } catch (error: any) {
//                 return next(new ErrorHandler(error.message, 400));
//             }
//         }


//         res.status(200).json({
//             success: true,
//             message: "Answer added successfully!",
//             course
//         });
//     } catch (error: any) {
//         // return next(error);
//         return next(new ErrorHandler(error.message, 400));
//     }
// });


// Add question in course content

export const addAnswer = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { answer, courseID, contentID, questionID }: IAddAnswerData = req.body;

        // Validate all ObjectIds before querying
        if (!mongoose.Types.ObjectId.isValid(courseID)) {
            return next(new ErrorHandler("Invalid course ID", 400));
        }
        if (!mongoose.Types.ObjectId.isValid(contentID)) {
            return next(new ErrorHandler("Invalid content ID", 400));
        }
        if (!mongoose.Types.ObjectId.isValid(questionID)) {
            return next(new ErrorHandler("Invalid question ID", 400));
        }

        const course = await CourseModel.findById(courseID);
        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        }

        const courseContent = course?.courseData?.find((item: any) => item._id.equals(contentID));
        if (!courseContent) {
            return next(new ErrorHandler("Course content not found", 404));
        }

        const question = courseContent?.questions?.find((item: any) => item._id.equals(questionID));
        if (!question) {
            return next(new ErrorHandler("Question not found", 404));
        }

        const newAnswer: any = {
            user: req.user,
            answer,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        question?.questionReplies.push(newAnswer);
        await course.save();

        // Notification logic
        if (req.user?._id?.toString() === question.user._id?.toString()) {
            await NotificationModel.create({
                userID: String(req.user._id),
                title: "New Question Reply Received",
                message: `You have a new question reply in course: ${courseContent.title}`,
            });
        } else {
            const data = {
                name: question.user.name,
                title: courseContent.title
            };

            try {
                await sendMail({
                    email: question.user.email,
                    subject: "Question Reply",
                    template: "question-reply.ejs",
                    data
                });
            } catch (error: any) {
                return next(new ErrorHandler(error.message, 400));
            }
        }

        res.status(200).json({
            success: true,
            message: "Answer added successfully!",
            course
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});


interface IAddReviewData {
    review: string;
    courseID: string;
    rating: number;
    userID: string;
};

export const addReview = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userCorseList = req?.user?.courses;
        const courseID = req.params.id;

        // Check if courseID already exists
        // const courseExists = userCorseList?.some((course: any) => course._id.toString() === courseID?.toString());
        const courseExists = userCorseList?.some(
            (course: any) => (course.courseId || course._id)?.toString() === courseID?.toString()
        );


        if (!courseExists) {
            return next(new ErrorHandler("You are not eligible for this course!!", 400));
        }

        const course = await CourseModel.findById(courseID);

        const { review, rating } = req.body as IAddReviewData;

        const reviewData: any = {
            user: req.user,
            comment: review,
            rating
        };

        course?.reviews.push(reviewData);

        // Review calculation
        if (!course) {
            return next(new ErrorHandler("Course not found!", 404));
        }

        // Review calculation
        let totalRating = 0;
        course.reviews.forEach((rev: any) => {
            totalRating += rev.rating;
        });

        course.ratings = course.reviews.length > 0 ? totalRating / course.reviews.length : 0;

        await course?.save();
        // in addReview, right after await course?.save();
        await redis.set(courseID, JSON.stringify(course), "EX", 604800); // refresh 7-day cache with updated reviews

        // Create new notification
        await NotificationModel.create({
            userID: String(req?.user._id),
            title: "New review received",
            message: `${req.user?.name} has given a review on your course ${course?.name}`,
        });

        res.status(200).json({
            success: true,
            course
        });
    } catch (error: any) {
        // return next(error);
        return next(new ErrorHandler(error.message, 400));
    }
});


// Add reply to review
interface IAddReviewData {
    comment: string;
    courseID: string;
    reviewID: string;
};

export const addReplyToReview = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            comment,
            courseID,
            reviewID,
        } = req.body as IAddReviewData;

        const course = await CourseModel.findById(courseID);

        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        }

        const review = course?.reviews?.find((rev: any) => rev._id.toString() === reviewID);

        if (!review) {
            return next(new ErrorHandler("Review not found", 404));
        }

        const replyData: any = {
            user: req.user,
            comment,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        if (!review.commentReplies) {
            review.commentReplies = [];
        }

        review.commentReplies?.push(replyData);

        await course?.save()

        // in addReview, right after await course?.save();
        await redis.set(courseID, JSON.stringify(course), "EX", 604800); // refresh 7-day cache with updated reviews

        res.status(200).json({
            success: true,
            course
        });

    } catch (error: any) {
        // return next(error);
        return next(new ErrorHandler(error.message, 400));
    }
});


// Get all courses -- only for admin
export const getAllCoursesAdmin = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        getAllCoursesService(res);
    } catch (error: any) {
        // return next(error);
        return next(new ErrorHandler(error.message, 400));
    }
});


// Delete user -- only for admin
export const deleteCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const course = await CourseModel.findById(id);
        if (!course) {
            return next(new ErrorHandler("User Not Found", 400));
        }

        const thumbnail = course.thumbnail;

        // Delete the OLD image from Cloudinary (using what's already saved in DB, not client input)
        if (thumbnail && (thumbnail as any).public_id) {
            await cloudinary.v2.uploader.destroy((thumbnail as any).public_id);
        }

        await course.deleteOne({ id });

        // await redis.del(id);
        // Delete session in Redis with TTL in seconds
        const userIdStr = String(course?._id);
        const refreshTokenExpireDays = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "3", 10);
        const redisTtlInSeconds = refreshTokenExpireDays * 24 * 60 * 60;

        await redis.del(userIdStr, id, "EX", redisTtlInSeconds);

        res.status(200).json({
            success: true,
            message: "Course Deleted successfully!",
        });
    } catch (error: any) {
        // return next(error);
        return next(new ErrorHandler(error.message, 400));
    }
});


// Generate Video URL
export const generateVideoURL = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { videoID } = req.body;

        const response = await axios.post(
            `https://dev.vdocipher.com/api/videos/${videoID}/otp`,
            { ttl: 300 },
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`

                }
            }
        );

        res.json(response.data);
    } catch (error: any) {
        // return next(error);
        return next(new ErrorHandler(error.message, 400));
    }
});