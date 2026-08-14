import express, { Router } from "express";
// Keep the .js extension for compatibility with your "type": "module" setup
import { userAuth } from "../middleware/userAuth.js";
import { createOrder } from "../controllers/orderController.js";

// Annotate the router as an Express Router type
const orderRouter: Router = express.Router();

// Public routes
orderRouter.post('/create-order', userAuth, createOrder);


export default orderRouter;