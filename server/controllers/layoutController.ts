import type { NextFunction, Request, Response } from "express";
import CatchAsyncError from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../config/ErrorHandler.js";
import LayoutModel from "../models/Layouts.js";
import cloudinary from "cloudinary";


// Create Layout
export const createLayout = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type } = req.body;

        const isTypeExist = await LayoutModel.findOne({ type });

        if (isTypeExist) {
            return next(new ErrorHandler(`${type} already exist`, 400));
        }

        if (type === "Banner") {
            const { image, title, subTitle } = req.body;

            const myCloud = await cloudinary.v2.uploader.upload(image, {
                folder: "LMS/layout"
            });

            const banner = {
                image: {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url
                },
                title,
                subTitle
            };
            await LayoutModel.create({ type: "Banner", banner });
        }


        if (type === "FAQ") {
            const { faq } = req.body;
            const faqItems = await Promise.all(
                faq.map(async (item: any) => {
                    return {
                        question: item.question,
                        answer: item.answer
                    };
                })
            )
            await LayoutModel.create({ type: "FAQ", faq: faqItems });
        }

        if (type === "Categories") {
            const { categories } = req.body;

            const categoriesItems = await Promise.all(
                categories.map(async (item: any) => {
                    return {
                        title: item.title
                    };
                })
            )

            await LayoutModel.create({ type: "Categories", categories: categoriesItems });
        }

        res.status(200).json({
            success: true,
            message: "Layout created successfully",
        });
    } catch (error: any) {
        // return next(error);
        return next(new ErrorHandler(error.message, 400));
    }
});


// Edit Layout
export const editLayout = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type } = req.body;

        if (type === "Banner") {
            const bannerData: any = await LayoutModel.findOne({ type: "Banner" }); // fixed: added await
            const { image, title, subTitle } = req.body;

            let bannerImage = bannerData?.banner?.image;

            // Only touch Cloudinary if the image actually changed (new base64 upload, not the existing URL)
            if (image && !image.startsWith("https")) {
                if (bannerData?.banner?.image?.public_id) {
                    await cloudinary.v2.uploader.destroy(bannerData.banner.image.public_id);
                }
                const myCloud = await cloudinary.v2.uploader.upload(image, {
                    folder: "LMS/layout"
                });
                bannerImage = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url
                };
            }

            const banner = {
                image: bannerImage,
                title,
                subTitle
            };

            if (bannerData) {
                await LayoutModel.findByIdAndUpdate(bannerData._id, { banner });
            } else {
                await LayoutModel.create({ type: "Banner", banner });
            }
        }

        if (type === "FAQ") {
            const { faq } = req.body;
            const faqItem = await LayoutModel.findOne({ type: "FAQ" });
            const faqItems = await Promise.all(
                faq.map(async (item: any) => {
                    return {
                        question: item.question,
                        answer: item.answer
                    };
                })
            )
            await LayoutModel.findByIdAndUpdate(faqItem?.id, { type: "FAQ", faq: faqItems });
        }

        if (type === "Categories") {
            const { categories } = req.body;
            const categoryiesData = await LayoutModel.findOne({ type: "Categories" });
            const categoriesItems = await Promise.all(
                categories.map(async (item: any) => {
                    return {
                        title: item.title
                    };
                })
            )

            await LayoutModel.findByIdAndUpdate(categoryiesData?.id, { type: "Categories", categories: categoriesItems });
        }

        res.status(200).json({
            success: true,
            message: "Layout updated successfully",
        });
    } catch (error: any) {
        // return next(error);
        return next(new ErrorHandler(error.message, 400));
    }
});

// Get Layout By Type
export const getLayoutByType = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type } = req.params;

        // Validate that type exists and is a string
        if (!type || typeof type !== "string") {
            return next(new ErrorHandler("Layout type parameter is required", 400));
        }

        const layout = await LayoutModel.findOne({ type });

        res.status(200).json({
            success: true,
            layout
        });
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
//             message: "",
//         });
//     } catch (error: any) {
//         // return next(error);
//         return next(new ErrorHandler(error.message, 400));
//     }
// });