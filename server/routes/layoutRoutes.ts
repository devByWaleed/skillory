import express, { Router } from "express";
// Keep the .js extension for compatibility with your "type": "module" setup
import { authorizeRole, isAuthenticated } from "../middleware/isAuthenticated.js";
import { createLayout, editLayout, getLayoutByType } from "../controllers/layoutController.js";
import { updateAccessToken } from "../controllers/userController.js";

// Annotate the router as an Express Router type
const layoutRouter: Router = express.Router();

// Public routes
layoutRouter.post('/create-layout', updateAccessToken, isAuthenticated, authorizeRole("admin"), createLayout);
layoutRouter.put('/edit-layout', updateAccessToken, isAuthenticated, authorizeRole("admin"), editLayout);
layoutRouter.get('/get-layout-by-type/:type', getLayoutByType);


export default layoutRouter;