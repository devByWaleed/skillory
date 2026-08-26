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
import { authorizeRole, userAuth } from "../middleware/userAuth.js";

// Annotate the router as an Express Router type
const userRouter: Router = express.Router();

// Public routes
userRouter.post('/registration', registerUser);
userRouter.post('/activate-user', activateAccount);
userRouter.post('/login-user', loginUser);
userRouter.post('/logout-user', userAuth, logoutUser);
userRouter.get('/refresh', updateAccessToken);
userRouter.get('/profile', updateAccessToken, userAuth, getUserInfo);
userRouter.post('/social-auth', socialAuth);
userRouter.put('/update-user-info', updateAccessToken, userAuth, updateUserInfo);
userRouter.put('/update-user-password', updateAccessToken, userAuth, updatePassword);
userRouter.put('/update-user-avatar', updateAccessToken, userAuth, updateUserAvatar);
userRouter.get('/get-users', updateAccessToken, userAuth, authorizeRole("admin"), getAllUsers);
userRouter.put('/update-user-role', updateAccessToken, userAuth, authorizeRole("admin"), updateUserRole);
userRouter.delete('/delete-user/:id', updateAccessToken, userAuth, authorizeRole("admin"), deleteUser);

export default userRouter;