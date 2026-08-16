import express, { Router } from "express";
// Keep the .js extension for compatibility with your "type": "module" setup
import { authorizeRole, userAuth } from "../middleware/userAuth.js";
import { getAllNotifications, updateNotification } from "../controllers/notificationController.js";

// Annotate the router as an Express Router type
const notificationRouter: Router = express.Router();

// Public routes
notificationRouter.get('/get-all-notifications', userAuth, authorizeRole("admin"), getAllNotifications);
notificationRouter.put('/update-notification/:id', userAuth, authorizeRole("admin"), updateNotification);


export default notificationRouter;