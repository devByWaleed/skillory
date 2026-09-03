import { type Response } from "express";
import "dotenv/config";
import { type IUser } from "../models/Users.js";
import { redis } from "../config/redis.js";

interface ITokenOptions {
    expires: Date;
    maxAge: number;
    httpOnly: boolean;
    sameSite: "lax" | "strict" | "none" | undefined;
    secure?: boolean;
    path: string;
}

// Parse env variables (assume ACCESS_TOKEN_EXPIRE in minutes, REFRESH_TOKEN_EXPIRE in days)
const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "5", 10); // e.g., 5 minutes
const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "3", 10); // e.g., 3 days

// Generate cookie options dynamically per-request
export const getCookieOptions = () => {
    const accessTokenMaxAge = accessTokenExpire * 60 * 1000; // ms
    const refreshTokenMaxAge = refreshTokenExpire * 24 * 60 * 60 * 1000; // ms

    const accessTokenOptions: ITokenOptions = {
        expires: new Date(Date.now() + accessTokenMaxAge),
        maxAge: accessTokenMaxAge,
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
    };

    const refreshTokenOptions: ITokenOptions = {
        expires: new Date(Date.now() + refreshTokenMaxAge),
        maxAge: refreshTokenMaxAge,
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
    };

    return { accessTokenOptions, refreshTokenOptions };
};

export const sendToken = async (
    user: IUser,
    statusCode: number,
    res: Response
) => {
    const accessToken = user.SignAccessToken();
    const refreshToken = user.SignRefreshToken();

    await redis.set(
        String(user._id),
        JSON.stringify(user),
        "EX",
        3 * 24 * 60 * 60
    );

    const {
        accessTokenOptions,
        refreshTokenOptions,
    } = getCookieOptions();

    res.cookie(
        "access_token",
        accessToken,
        accessTokenOptions
    );

    res.cookie(
        "refresh_token",
        refreshToken,
        refreshTokenOptions
    );

    res.status(statusCode).json({
        success: true,
        user,
        accessToken,
    });
};














// import { type NextFunction, type Request, type Response } from "express";
// // Dotenv configuration
// import "dotenv/config"
// import { type IUser } from "../models/Users.js";
// import { redis } from "./redis.js";


// interface ITokenOptions {
//     expires: Date;
//     maxAge: number;
//     httpOnly: boolean;
//     sameSite: "lax" | "strict" | "none" | undefined
//     secure?: boolean;
//     path: string;
// };


// // Parse env variables
// const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "300", 10);
// const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "1200", 10);

// // Options for cookies
// export const accessTokenOptions: ITokenOptions = {
//     expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000),
//     maxAge: accessTokenExpire * 60 * 60 * 1000,
//     httpOnly: true,
//     sameSite: "lax",
//     path: "/", // Explicit path matching
// }

// export const refreshTokenOptions: ITokenOptions = {
//     expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
//     maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
//     httpOnly: true,
//     sameSite: "lax",
//     path: "/", // Explicit path matching
// }


// export const sendToken = async (user: IUser, statusCode: number, res: Response) => {
//     const accessToken = user.SignAccessToken();
//     const refreshToken = user.SignRefreshToken();


//     // redis.set(user._id, JSON.stringify(user) as any);
//     // Upload session to redis
//     const userIdStr = (user._id as string).toString();
//     await redis.set(userIdStr, JSON.stringify(user), "EX", refreshTokenExpire);

//     // Only set secure to true in production
//     // if (process.env.NODE_ENV === "production") {
//     //     accessTokenOptions.secure = true;
//     // }

//     res.cookie("access_token", accessToken, accessTokenOptions);
//     res.cookie("refresh_token", refreshToken, refreshTokenOptions);

//     // res.cookie("access_token", accessTokenOptions);
//     // res.cookie("refresh_token", refreshTokenOptions);

//     res.status(statusCode).json({
//         success: true,
//         user,
//         accessToken
//     });
// };