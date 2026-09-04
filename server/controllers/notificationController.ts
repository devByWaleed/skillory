import type { NextFunction, Request, Response } from "express";
import ErrorHandler from "../config/ErrorHandler.js";
import CatchAsyncError from "../middleware/catchAsyncErrors.js";
import NotificationModel from "../models/Notifications.js";
import cron from "node-cron"


// Get All Notifications -- Only Admin
export const getAllNotifications = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notifications = await NotificationModel.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            notifications
        });
    } catch (error: any) {
        // return next(error);
        return next(new ErrorHandler(error.message, 400));
    }
});


// Update Notification Status -- Only Admin
export const updateNotification = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notification = await NotificationModel.findById(req.params.id);

        if (!notification) {
            return next(new ErrorHandler("Notification Not Found!", 400));
        }

        notification.status = "read";
        await notification.save();

        const allNotifications = await NotificationModel.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            allNotifications
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});


// Delete Notifications -- Only Admin
cron.schedule("0 0 0 * * *", async () => {
    const thirtyDaysAgo = new Date(Date.now() - (30 * 24 * 60 * 60 * 1000));
    await NotificationModel.deleteMany({ status: "read", createdAt: { $lt: thirtyDaysAgo } });
    console.log("Deleted read notifications");
});