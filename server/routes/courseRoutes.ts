import express, { Router } from "express";
// Keep the .js extension for compatibility with your "type": "module" setup
import {
    addAnswer,
    addQuestion,
    addReplyToReview,
    addReview,
    editCourse,
    getAllCourses,
    getCourseByUser,
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
courseRouter.get('/get-all-courses', getAllCourses);
courseRouter.get('/get-course-content/:id', userAuth, getCourseByUser);
courseRouter.post('/add-question', userAuth, addQuestion);
courseRouter.post('/add-answer', userAuth, addAnswer);
courseRouter.post('/add-review/:id', userAuth, addReview);
courseRouter.post('/add-reply', userAuth, authorizeRole("admin"), addReplyToReview);


export default courseRouter;