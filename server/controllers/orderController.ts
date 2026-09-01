
import type { NextFunction, Request, Response } from "express";
import ErrorHandler from "../config/ErrorHandler.js";
import CatchAsyncError from "../middleware/catchAsyncErrors.js";
import OrderModel, { type IOrder } from "../models/Orders.js";
import path from "path";
import ejs from 'ejs';
import { fileURLToPath } from 'url';
import sendMail from "../config/nodeMailer.js";
import CourseModel from "../models/Courses.js";
import { getAllOrdersService, newOrder } from "../services/orderService.js";
import NotificationModel from "../models/Notifications.js";
import UserModel from "../models/Users.js";
import { getAllCoursesService } from "../services/courseService.js";
import { redis } from "../config/redis.js";
import Stripe from "stripe";


// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);


// Create Order
export const createOrder = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseID, payment_info } = req.body as IOrder;

        if (payment_info) {
            if ("id" in payment_info) {
                const paymentIntentId: any = payment_info.id;
                const paymentIntent = await stripe.paymentIntents.retrieve(
                    paymentIntentId
                );

                if (paymentIntent.status !== "succeeded") {
                    return next(new ErrorHandler("Payment not authorized!", 400));
                }
            }
        }

        // 1. Fetch user from UserModel (NOT OrderModel)
        const userId = req.user?._id;
        const user = await UserModel.findById(userId);

        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        // 2. Check if user already purchased the course
        const courseExistsInUser = user.courses.some(
            (item: any) => (item.courseId ? item.courseId.toString() : item._id?.toString()) === courseID
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

        const userIdStr = String(user._id);
        const refreshTokenExpireDays = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "3", 10);
        const redisTtlInSeconds = refreshTokenExpireDays * 24 * 60 * 60;

        await redis.set(userIdStr, JSON.stringify(user), "EX", redisTtlInSeconds);

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




// Get all users -- only for admin
export const getAllOrders = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        getAllOrdersService(res);
    } catch (error: any) {
        // return next(error);
        return next(new ErrorHandler(error.message, 400));
    }
});


export const sendStripePublishableKey = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
});

export const createPaymentIntent = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId } = req.body;
        const userId = req.user?._id;

        const user = await UserModel.findById(userId);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        const isAlreadyEnrolled = user.courses.some(
            (c: any) => (c.courseId ? c.courseId.toString() : c.toString()) === courseId
        );
        if (isAlreadyEnrolled) {
            return next(new ErrorHandler("You have already purchased this course", 400));
        }

        const course = await CourseModel.findById(courseId);
        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(course.price * 100),
            currency: "usd",
            metadata: {
                courseId: String(course._id),
                userId: String(user._id),
            },
            automatic_payment_methods: { enabled: true },
        });

        res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret, // fixed casing to match frontend
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});



export const stripeWebhookController = async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !webhookSecret) {
        console.error('Missing stripe-signature header or STRIPE_WEBHOOK_SECRET');
        return res.status(400).send('Webhook Secret or Signature missing');
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
        console.error(`Webhook Signature Verification Failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        try {
            const courseId = session.metadata?.courseId;
            const userId = session.metadata?.userId;

            if (courseId && userId) {
                const user = await UserModel.findById(userId);
                const course = await CourseModel.findById(courseId);

                if (user && course) {
                    const isAlreadyEnrolled = user.courses.some(
                        (c: any) => (c.courseId ? c.courseId.toString() : c.toString()) === courseId
                    );

                    if (!isAlreadyEnrolled) {
                        user.courses.push({ courseId: course._id } as any);
                        await user.save();
                    }

                    // Refresh Redis Session Cache
                    await redis.set(userId, JSON.stringify(user));

                    course.purchased = (course.purchased || 0) + 1;
                    await course.save();

                    await OrderModel.create({
                        courseID: course._id,
                        userID: user._id,
                        payment_info: {
                            id: session.payment_intent as string,
                            status: session.payment_status,
                            method: 'stripe',
                        },
                    });

                    await NotificationModel.create({
                        userID: String(user._id),
                        title: "New Order",
                        message: `You have a new order for course: ${course.name}`,
                    });
                }
            }
        } catch (error: any) {
            console.error('Error fulfilling checkout session:', error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    res.status(200).json({ received: true });
};