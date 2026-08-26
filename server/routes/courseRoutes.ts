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
import { authorizeRole, userAuth } from "../middleware/userAuth.js";
import { updateAccessToken } from "../controllers/userController.js";

// Annotate the router as an Express Router type
const courseRouter: Router = express.Router();

// Public routes
courseRouter.post('/create-course', updateAccessToken, userAuth, authorizeRole("admin"), uploadCourse);
courseRouter.put('/update-course/:id', userAuth, authorizeRole("admin"), editCourse);
courseRouter.get('/get-course/:id', getSingleCourse);
courseRouter.get('/get-all-courses', getAllCourses);
courseRouter.get('/get-course-content/:id', userAuth, getCourseByUser);
courseRouter.post('/add-question', userAuth, addQuestion);
courseRouter.post('/add-answer', userAuth, addAnswer);
courseRouter.post('/add-review/:id', userAuth, addReview);
courseRouter.post('/add-reply', userAuth, authorizeRole("admin"), addReplyToReview);
courseRouter.get('/get-courses', userAuth, authorizeRole("admin"), getAllCoursesAdmin);
courseRouter.delete('/delete-course/:id', userAuth, authorizeRole("admin"), deleteCourse);
courseRouter.post('/getVdoCipherOTP', generateVideoURL);

export default courseRouter;