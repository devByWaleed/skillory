import type { NextFunction, Response } from "express";
import CatchAsyncError from "../middleware/catchAsyncErrors.js";
import OrderModel from "../models/Orders.js";


// Create New Order
export const newOrder = CatchAsyncError(async (data: any, res: Response, next: NextFunction) => {
    const order = await OrderModel.create(data);

    res.status(200).json({
        success: true,
        order
    });
});


// Get All Users
export const getAllOrdersService = async (res: Response) => {
    const allOrders = await OrderModel.find()
        .populate("userID", "name email")
        .populate("courseID", "name price title")
        .sort({ createdAt: -1 });

    res.status(201).json({
        success: true,
        allOrders,
    });
};

// export const getAllOrdersService = async (res: Response) => {
//     const allOrders = await OrderModel.find().sort({ createdAt: -1 });
//     res.status(201).json({
//         success: true,
//         allOrders,
//     });
// }