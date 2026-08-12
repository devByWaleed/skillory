import { type Request } from "express";
import { IUser } from "../models/Users.ts";


declare global {
    namespace Express {
        interface Request {
            user?: IUser
        }
    }
}