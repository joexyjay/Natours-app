import express from "express"
import { createReview, getAllReviews, getReview } from "../controllers/reviewController";
import { protect, restrictTo } from "../controllers/authController";

const router = express.Router({mergeParams: true})

// Nested routes
// POST /tour/234fad4/reviews
// GET /tour/234fad4/reviews
// GET /tour/234fad4/reviews/2342df

router
    .route('/')
    .get(getAllReviews)
    .post(protect, restrictTo('user'), createReview)

router.route('/:id').get(getReview)    
export default router