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