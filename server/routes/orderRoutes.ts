import express, { Router } from "express";
// Keep the .js extension for compatibility with your "type": "module" setup
import { authorizeRole, userAuth } from "../middleware/userAuth.js";
import { createOrder, getAllOrders } from "../controllers/orderController.js";

// Annotate the router as an Express Router type
const orderRouter: Router = express.Router();

// Public routes
orderRouter.post('/create-order', userAuth, createOrder);
orderRouter.get('/get-orders', userAuth, authorizeRole("admin"), getAllOrders);


export default orderRouter;