import express, { Router } from "express";
// Keep the .js extension for compatibility with your "type": "module" setup
import { authorizeRole, userAuth } from "../middleware/userAuth.js";
import { createOrder, createPaymentIntent, getAllOrders, sendStripePublishableKey, stripeWebhookController } from "../controllers/orderController.js";
import { updateAccessToken } from "../controllers/userController.js";

// Annotate the router as an Express Router type
const orderRouter: Router = express.Router();

// Public routes
orderRouter.post('/create-order', updateAccessToken, userAuth, createOrder);
orderRouter.get('/get-orders', updateAccessToken, userAuth, authorizeRole("admin"), getAllOrders);
orderRouter.get('/payment/stripe-publishable-key', sendStripePublishableKey);
orderRouter.post("/payment/create-intent", updateAccessToken, userAuth, createPaymentIntent);
orderRouter.post("/webhook", express.raw({ type: 'application/json' }), stripeWebhookController);


export default orderRouter;