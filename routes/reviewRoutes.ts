import express from "express"
import { createReview, getAllReviews, getReview } from "../controllers/reviewController";
import { protect, restrictTo } from "../controllers/authController";

const router = express.Router()

router
    .route('/')
    .get(getAllReviews)
    .post(protect, restrictTo('user'), createReview)

router.route('/:id').get(getReview)    
export default router