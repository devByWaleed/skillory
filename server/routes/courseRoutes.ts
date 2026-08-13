import express, { Router } from "express";
// Keep the .js extension for compatibility with your "type": "module" setup
import {
    editCourse,
    getAllCourses,
    getSingleCourse,
    uploadCourse

} from "../controllers/courseController.js";
import { authorizeRole, userAuth } from "../middleware/userAuth.js";

// Annotate the router as an Express Router type
const courseRouter: Router = express.Router();

// Public routes
courseRouter.post('/create-course', userAuth, authorizeRole("admin"), uploadCourse);
courseRouter.put('/update-course/:id', userAuth, authorizeRole("admin"), editCourse);
courseRouter.get('/get-course/:id', getSingleCourse);
courseRouter.get('/get-all-courses/', getAllCourses);


export default courseRouter;