
import type { NextFunction, Request, Response } from "express";
import ErrorHandler from "../config/ErrorHandler.js";
import CatchAsyncError from "../middleware/catchAsyncErrors.js";
import OrderModel, { type IOrder } from "../models/Orders.js";
import path from "path";
import ejs from 'ejs';
import { fileURLToPath } from 'url';
import sendMail from "../config/nodeMailer.js";
import CourseModel from "../models/Courses.js";
import { newOrder } from "../services/orderService.js";
import NotificationModel from "../models/Notifications.js";
import UserModel from "../models/Users.js";

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Create Order
export const createOrder = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseID, payment_info } = req.body as IOrder;

        // 1. Fetch user from UserModel (NOT OrderModel)
        const userId = req.user?._id;
        const user = await UserModel.findById(userId);

        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        // 2. Check if user already purchased the course
        const courseExistsInUser = user.courses.some(
            (item: any) => (item._id ? item._id.toString() : item.toString()) === courseID
        );

        if (courseExistsInUser) {
            return next(new ErrorHandler("You have already purchased this course", 400));
        }

        // 3. Fetch course
        const course = await CourseModel.findById(courseID);
        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        }

        const data: any = {
            courseID: course._id,
            userID: user._id,
            payment_info,
        };

        // 4. Send Confirmation Email
        const mailData = {
            order: {
                _id: String(course._id).slice(0, 6),
                name: course.name,
                price: course.price,
                date: new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }),
            },
        };

        try {
            await sendMail({
                email: user.email,
                subject: "Order Confirmation",
                template: "order-confirmation.ejs",
                data: mailData,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }

        // 5. Add course to user and update Redis session cache
        user.courses.push({ courseId: course._id } as any);
        await user.save();

        // 6. Create admin notification
        await NotificationModel.create({
            userID: String(user._id),
            title: "New Order",
            message: `You have a new order for course: ${course.name}`,
        });

        // 7. Increment purchased count on course
        course.purchased = (course.purchased || 0) + 1;
        await course.save();

        // 8. Create Order Document
        await newOrder(data, res, next);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});







// Upload / Create Course
// export const PPP = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     try {

//         res.status(200).json({
//             success: true,
//             message: "",
//         });
//     } catch (error: any) {
//         // return next(error);
//         return next(new ErrorHandler(error.message, 400));
//     }
// });