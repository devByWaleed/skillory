import express, { Router } from "express";
// Keep the .js extension for compatibility with your "type": "module" setup

import { authorizeRole, userAuth } from "../middleware/userAuth.js";
import { getCourseAnalytics, getOrderAnalytics, getUserAnalytics } from "../controllers/analyticsController.js";

// Annotate the router as an Express Router type
const analyticsRouter: Router = express.Router();

// Public routes
analyticsRouter.get('/get-users-analytics', userAuth, authorizeRole("admin"), getUserAnalytics);
analyticsRouter.get('/get-courses-analytics', userAuth, authorizeRole("admin"), getCourseAnalytics);
analyticsRouter.get('/get-orders-analytics', userAuth, authorizeRole("admin"), getOrderAnalytics);


export default analyticsRouter;