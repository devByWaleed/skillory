import express, { Router } from "express";
// Keep the .js extension for compatibility with your "type": "module" setup

import { authorizeRole, isAuthenticated } from "../middleware/isAuthenticated.js";
import { getCourseAnalytics, getOrderAnalytics, getUserAnalytics } from "../controllers/analyticsController.js";
import { updateAccessToken } from "../controllers/userController.js";

// Annotate the router as an Express Router type
const analyticsRouter: Router = express.Router();

// Public routes
analyticsRouter.get('/get-users-analytics', updateAccessToken, isAuthenticated, authorizeRole("admin"), getUserAnalytics);
analyticsRouter.get('/get-courses-analytics', updateAccessToken, isAuthenticated, authorizeRole("admin"), getCourseAnalytics);
analyticsRouter.get('/get-orders-analytics', updateAccessToken, isAuthenticated, authorizeRole("admin"), getOrderAnalytics);


export default analyticsRouter;