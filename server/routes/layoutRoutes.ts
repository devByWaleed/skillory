import express, { Router } from "express";
// Keep the .js extension for compatibility with your "type": "module" setup
import { authorizeRole, userAuth } from "../middleware/userAuth.js";
import { createLayout, editLayout, getLayoutByType } from "../controllers/layoutController.js";
import { updateAccessToken } from "../controllers/userController.js";

// Annotate the router as an Express Router type
const layoutRouter: Router = express.Router();

// Public routes
layoutRouter.post('/create-layout', updateAccessToken, userAuth, authorizeRole("admin"), createLayout);
layoutRouter.put('/edit-layout', updateAccessToken, userAuth, authorizeRole("admin"), editLayout);
layoutRouter.get('/get-layout-by-type', getLayoutByType);


export default layoutRouter;