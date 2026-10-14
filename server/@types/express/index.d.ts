import type { IUser } from "../../models/Users.js";

declare global {
    namespace Express {
        interface Request {
            user?: IUser; // or whatever type your user object is
        }
    }
}