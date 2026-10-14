import { v2 as cloudinary } from "cloudinary";

export const connectCloudinary = async () => {
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME as string,
        api_key: process.env.CLOUD_API_KEY as string,
        api_secret: process.env.CLOUD_SECRET_KEY as string,
    });
}