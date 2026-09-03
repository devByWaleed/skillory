import express, { Router } from "express";
// Keep the .js extension for compatibility with your "type": "module" setup
import {
    addAnswer,
    addQuestion,
    addReplyToReview,
    addReview,
    deleteCourse,
    editCourse,
    generateVideoURL,
    getAllCourses,
    getAllCoursesAdmin,
    getCourseByUser,
    getSingleCourse,
    uploadCourse

} from "../controllers/courseController.js";
import { authorizeRole, isAuthenticated } from "../middleware/isAuthenticated.js";
import { updateAccessToken } from "../controllers/userController.js";

// Annotate the router as an Express Router type
const courseRouter: Router = express.Router();

// Public routes
courseRouter.post('/create-course', updateAccessToken, isAuthenticated, authorizeRole("admin"), uploadCourse);
courseRouter.put('/update-course/:id', updateAccessToken, isAuthenticated, authorizeRole("admin"), editCourse);
courseRouter.get('/get-course/:id', getSingleCourse);
courseRouter.get('/get-all-courses', getAllCourses);
courseRouter.get('/get-course-content/:id', isAuthenticated, getCourseByUser);
courseRouter.post('/add-question', isAuthenticated, addQuestion);
courseRouter.post('/add-answer', isAuthenticated, addAnswer);
courseRouter.post('/add-review/:id', isAuthenticated, addReview);
courseRouter.post('/add-reply', isAuthenticated, authorizeRole("admin"), addReplyToReview);
courseRouter.get('/get-admin-courses', isAuthenticated, authorizeRole("admin"), getAllCoursesAdmin);
courseRouter.delete('/delete-course/:id', isAuthenticated, authorizeRole("admin"), deleteCourse);
courseRouter.post('/getVdoCipherOTP', generateVideoURL);

export default courseRouter;