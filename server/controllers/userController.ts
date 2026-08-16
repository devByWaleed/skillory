import { type NextFunction, type Request, type Response } from "express";
import UserModel, { type IUser } from "../models/Users.js";
import CatchAsyncError from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../config/ErrorHandler.js";
import jwt, { type Secret, type JwtPayload } from "jsonwebtoken";
// Dotenv configuration
import "dotenv/config"
import sendMail from "../config/nodeMailer.js";
import { getCookieOptions, sendToken } from "../config/jwt.js";
import path from 'path';
import ejs from 'ejs';
import { fileURLToPath } from 'url';
import redis from "../config/redis.js";
import { getAllUsersService, getUserByID, updateUserRoleService } from "../services/userServices.js";
import cloudinary from "cloudinary";

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Interface
interface IActivationToken {
    token: string;
    activationCode: string;
};

export const createActivationToken = (user: any): IActivationToken => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const token = jwt.sign({
        user, activationCode,
    }, process.env.ACTIVATION_SECRET as Secret, {
        expiresIn: "10m",
    });

    return { token, activationCode };
};


interface IRegistration {
    name: string;
    email: string;
    password: string;
    avatar?: string;
};

export const registerUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return next(new ErrorHandler("Email Already Exists!", 400));
        }

        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return next(new ErrorHandler("User already existed", 400));
        }

        const user: IRegistration = {
            name, email, password
        };

        const activationToken = createActivationToken(user)

        const activationCode = activationToken.activationCode;

        const data = {
            user: { name: user.name }, activationCode
        };
        const html = await ejs.renderFile(path.join(__dirname, "../mails/activation-mail.ejs"), data);

        try {
            await sendMail({
                email: user.email,
                subject: "Activate your account",
                template: "activation-mail.ejs",
                data
            });

            res.status(200).json({
                success: true,
                message: `Please check your email: ${user.email} to activate your account`,
                activationToken: activationToken.token
            });

        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }
    }
    catch (error: any) {
        // return next(error);
        return next(new ErrorHandler(error.message, 400));
    }
});


// Activate User Account
interface IActivationRequest {
    activation_token: string;
    activation_code: string;
};

export const activateAccount = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { activation_token, activation_code } = req.body as IActivationRequest;

        const newUser: { user: IUser; activationCode: string } = jwt.verify(
            activation_token,
            process.env.ACTIVATION_SECRET as string
        ) as { user: IUser; activationCode: string };

        if (newUser.activationCode !== activation_code) {
            return next(new ErrorHandler("Invalid activation code", 400));
        }

        const { name, email, password } = newUser.user;

        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return next(new ErrorHandler("Email already exists", 400));
        }

        const user = await UserModel.create({
            name, email, password
        });

        res.status(200).json({
            success: true,
        });
    } catch (error: any) {
        // return next(error);
        return next(new ErrorHandler(error.message, 400));
    }
});




interface ILoginRequest {
    email: string;
    password: string;
};

export const loginUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body as ILoginRequest;

        if (!email || !password) {
            return next(new ErrorHandler("Please Enter Email and Password", 400));
        }

        const user = await UserModel.findOne({ email }).select("+password");

        if (!user) {
            return next(new ErrorHandler("Invalid Email or Password!", 400));
        }


        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return next(new ErrorHandler("Invalid Password!", 400));
        }

        sendToken(user, 200, res);

    } catch (error: any) {
        // return next(error);
        return next(new ErrorHandler(error.message, 400));

    }
});


export const logoutUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cookieOptions = {
            httpOnly: true,
            sameSite: "lax" as const,
            path: "/",
            secure: process.env.NODE_ENV === "production",
        };

        // Express idiomatic cookie clearing
        res.clearCookie("access_token", cookieOptions);
        res.clearCookie("refresh_token", cookieOptions);
        // res.cookie("access_token", "", {maxAge: 1});
        // res.cookie("refresh_token", "", {maxAge: 1});

        // Delete session from Redis
        const userId = req.user?._id;
        if (userId) {
            await redis.del(userId.toString());
        }

        res.status(200).json({
            success: true,
            message: "User logged out successfully.",
        });
    } catch (error: any) {
        // return next(error);
        return next(new ErrorHandler(error.message, 400));

    }
});


export const updateAccessToken = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refresh_token = req.cookies.refresh_token as string;

        if (!refresh_token) {
            return next(new ErrorHandler("Please login to access this resource", 400));
        }

        const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN as string) as JwtPayload;

        if (!decoded || !decoded.id) {
            return next(new ErrorHandler("Could not refresh token!", 400));
        }

        // Fetch session from Redis
        const session = await redis.get(decoded.id);
        if (!session) {
            return next(new ErrorHandler("Session expired. Please login again!", 400));
        }

        const user = JSON.parse(session);

        // Generate new tokens
        const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN as string, {
            expiresIn: "5m",
        });

        const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN as string, {
            expiresIn: "3d",
        });

        req.user = user;

        const { accessTokenOptions, refreshTokenOptions } = getCookieOptions();

        res.cookie("access_token", accessToken, accessTokenOptions);
        res.cookie("refresh_token", refreshToken, refreshTokenOptions);

        // Reset Redis session TTL in seconds
        // const refreshTokenExpireDays = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "3", 10);
        // const redisTtlInSeconds = refreshTokenExpireDays * 24 * 60 * 60;
        // await redis.set(user._id.toString(), JSON.stringify(user), "EX", redisTtlInSeconds);
        await redis.set(user._id.toString(), JSON.stringify(user), "EX", 604800);  // 7 Days

        res.status(200).json({
            success: true,
            accessToken,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});


// Get user info
export const getUserInfo = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userID = req.user?._id;
        if (!userID) {
            return next(new ErrorHandler("User not authenticated", 400));
        }

        await getUserByID(userID.toString(), res, next);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});


interface ISocialAuthBody {
    name: string;
    email: string;
    avatar?: string;
};

// Social Authentication
export const socialAuth = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, name, avatar } = req.body as ISocialAuthBody;
        const user = await UserModel.findOne({ email });

        if (!user) {
            const newUser = await UserModel.create({
                email,
                name,
                avatar: {
                    public_id: "",
                    url: avatar || "",
                },
            });
            sendToken(newUser, 200, res);
        }
        else {
            sendToken(user, 200, res);
        }

        // res.status(200).json({
        //     success: true,
        //     message: "",
        // });
    } catch (error: any) {
        // return next(error);
        return next(new ErrorHandler(error.message, 400));

    }
});


// Update user info
interface IUpdateUserInfo {
    name?: string;
    email?: string;
    avatar?: string;
};

export const updateUserInfo = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, name, avatar } = req.body as IUpdateUserInfo;
        const userID = req.user?._id;
        const user = await UserModel.findById(userID);

        if (email && user) {
            const isEmailExist = await UserModel.findOne({ email });
            if (isEmailExist) {
                return next(new ErrorHandler("Email already exists", 400));
            }
            user.email = email;
        }

        if (name && user) {
            user.name = name;

        }
        await user?.save();

        // Update session in Redis with TTL in seconds
        const userIdStr = String(user?._id);
        const refreshTokenExpireDays = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "3", 10);
        const redisTtlInSeconds = refreshTokenExpireDays * 24 * 60 * 60;

        await redis.set(userIdStr, JSON.stringify(user), "EX", redisTtlInSeconds);
        // await redis.set(userID?.toString(), JSON.stringify(user));

        res.status(201).json({
            success: true,
            message: "User info updated successfully",
            user
        });
    } catch (error: any) {
        // return next(error);
        return next(new ErrorHandler(error.message, 400));

    }
});



// Update user password
interface IUpdatePassword {
    oldPassword: string;
    newPassword: string;
};

export const updatePassword = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { oldPassword, newPassword } = req.body as IUpdatePassword;

        if (!oldPassword || !newPassword) {
            return next(new ErrorHandler("Please enter old and new password", 400));

        }

        const user = await UserModel.findById(req.user?._id).select("+password");

        if (user?.password === undefined) {
            return next(new ErrorHandler("Invalid User", 400));

        }

        const isPasswordMatch = await user?.comparePassword(oldPassword);

        if (!isPasswordMatch) {
            return next(new ErrorHandler("Invalid Old Password", 400));
        }

        user.password = newPassword;

        await user.save();

        // Update session in Redis with TTL in seconds
        const userIdStr = String(user._id);
        const refreshTokenExpireDays = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "3", 10);
        const redisTtlInSeconds = refreshTokenExpireDays * 24 * 60 * 60;

        await redis.set(userIdStr, JSON.stringify(user), "EX", redisTtlInSeconds);

        res.status(200).json({
            success: true,
            message: "Password updated successfully!",
        });
    } catch (error: any) {
        // return next(error);
        return next(new ErrorHandler(error.message, 400));

    }
});


// Update user password
interface IUpdateAvatar {
    avatar: string
    // avatar: {
    //     public_id: String,
    //     url: String,
    // };
};

export const updateUserAvatar = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { avatar } = req.body as IUpdateAvatar;


        const userID = req.user?._id;

        const user = await UserModel.findById(userID);

        if (avatar && user) {
            if (user?.avatar?.public_id) {
                // Firstly delete old avatar
                await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);

                // Update
                const myCloud = await cloudinary.v2.uploader.upload(avatar, {
                    folder: "LMS"
                });
                user.avatar = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url
                };
            } else {
                // Upload new avatar
                const myCloud = await cloudinary.v2.uploader.upload(avatar, {
                    folder: "LMS"
                });
                user.avatar = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url
                };
            }
        }

        await user?.save();

        // Update session in Redis with TTL in seconds
        const userIdStr = String(user?._id);
        const refreshTokenExpireDays = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "3", 10);
        const redisTtlInSeconds = refreshTokenExpireDays * 24 * 60 * 60;

        await redis.set(userIdStr, JSON.stringify(user), "EX", redisTtlInSeconds);

        res.status(200).json({
            success: true,
            message: "Avatar updated successfully!",
        });
    } catch (error: any) {
        // return next(error);
        return next(new ErrorHandler(error.message, 400));
    }
});


// Get all users -- only for admin
export const getAllUsers = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        getAllUsersService(res);
    } catch (error: any) {
        // return next(error);
        return next(new ErrorHandler(error.message, 400));
    }
});


// Update user role -- only for admin
export const updateUserRole = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, role } = req.body;
        updateUserRoleService(res, id, role)
    } catch (error: any) {
        // return next(error);
        return next(new ErrorHandler(error.message, 400));
    }
});


// Delete user -- only for admin
export const deleteUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const user = await UserModel.findById(id);

        if (!user) {
            return next(new ErrorHandler("User Not Found", 400));
        }

        await user.deleteOne({ id });

        // await redis.del(id);
        // Delete session in Redis with TTL in seconds
        const userIdStr = String(user?._id);
        const refreshTokenExpireDays = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "3", 10);
        const redisTtlInSeconds = refreshTokenExpireDays * 24 * 60 * 60;

        await redis.del(userIdStr, id, "EX", redisTtlInSeconds);

        res.status(200).json({
            success: true,
            message: "User Deleted successfully!",
        });
    } catch (error: any) {
        // return next(error);
        return next(new ErrorHandler(error.message, 400));
    }
});