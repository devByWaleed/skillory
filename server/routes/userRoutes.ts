import express, { Router } from "express";
// Keep the .js extension for compatibility with your "type": "module" setup
import {
    activateAccount,
    getAllUsers,
    getUserInfo,
    loginUser,
    logoutUser,
    registerUser,
    socialAuth,
    updateAccessToken,
    updatePassword,
    updateUserRole,
    updateUserAvatar,
    updateUserInfo,
    deleteUser
} from "../controllers/userController.js";
import { authorizeRole, isAuthenticated } from "../middleware/isAuthenticated.js";

// Annotate the router as an Express Router type
const userRouter: Router = express.Router();

// Public routes
userRouter.post('/registration', registerUser);
userRouter.post('/activate-user', activateAccount);
userRouter.post('/login-user', loginUser);
userRouter.post('/logout-user', isAuthenticated, logoutUser);
userRouter.get('/refresh', updateAccessToken);
/*
Cause 400 Bad Request Issue. Profile fetches after 2/3 page refreshes
// userRouter.get('/profile', updateAccessToken, isAuthenticated, getUserInfo);
*/
// Use a guest-safe profile route:
userRouter.get('/profile', updateAccessToken, getUserInfo);
userRouter.post('/social-auth', socialAuth);
userRouter.put('/update-user-info', updateAccessToken, isAuthenticated, updateUserInfo);
userRouter.put('/update-user-password', updateAccessToken, isAuthenticated, updatePassword);
userRouter.put('/update-user-avatar', updateAccessToken, isAuthenticated, updateUserAvatar);
userRouter.get('/get-users', updateAccessToken, isAuthenticated, authorizeRole("admin"), getAllUsers);
userRouter.put('/update-user-role', updateAccessToken, isAuthenticated, authorizeRole("admin"), updateUserRole);
userRouter.delete('/delete-user/:id', updateAccessToken, isAuthenticated, authorizeRole("admin"), deleteUser);

export default userRouter;