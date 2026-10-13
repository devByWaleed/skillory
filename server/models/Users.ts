import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
// Dotenv configuration
import "dotenv/config"
import jwt from "jsonwebtoken";
import { accessTokenExpire, refreshTokenExpire } from "../config/tokenConfig.js";

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    avatar: {
        public_id: string;
        url: string;
    }
    role: string;
    isVerified: boolean;
    courses: Array<{ courseId: string }>;
    comparePassword: (password: string) => Promise<boolean>;
    SignAccessToken: () => string;
    SignRefreshToken: () => string;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"]
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        validate: {
            validator: function (value: string) {
                return emailRegexPattern.test(value);
            },
            message: "Please Enter A Valid Email!"
        },
        unique: true
    },
    password: {
        type: String,
        minLength: [8, "Password Must Be At Least 8 Charachters"],
        select: false
    },
    avatar: {
        public_id: String,
        url: String,
    },
    role: {
        type: String,
        default: "user"
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    courses: [
        {
            courseId: {
                type: String,
                required: true,
            }
        }
    ],
}, {
    timestamps: true,
    toJSON: {
        // Never leak the password hash, even if a query used .select("+password").
        // Applies to res.json(user) and JSON.stringify(user) (used for the Redis session).
        transform(_doc, ret: any) {
            delete ret.password;
            return ret;
        }
    }
});

// Hash Password
UserSchema.pre("save", async function (this: IUser) {
    if (!this.isModified("password")) {
        return;
    }
    this.password = await bcrypt.hash(this.password, 10);
});

// Sign Access Token: Login (lifetime comes from ACCESS_TOKEN_EXPIRE, in minutes)
UserSchema.methods.SignAccessToken = function () {
    return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || "", {
        expiresIn: accessTokenExpire * 60              // seconds
    })
}

// Sign Refresh Token: Login (lifetime comes from REFRESH_TOKEN_EXPIRE, in days)
UserSchema.methods.SignRefreshToken = function () {
    return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || "", {
        expiresIn: refreshTokenExpire * 24 * 60 * 60   // seconds
    })
}

// Compare Password
UserSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
}

const UserModel: Model<IUser> = mongoose.models.user || mongoose.model("user", UserSchema);

export default UserModel;