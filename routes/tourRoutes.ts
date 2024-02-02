import express from "express";
import { protect, restrictTo } from "../controllers/authController";
import { 
    aliasTopTours,
    getAllTours, 
    createTour, 
    getOneTour, 
    updateTour, 
    deleteTour,
    getTourStats,
    getMonthlyPlan
 } from "../controllers/tourController";
 import reviewRouter from "./reviewRoutes";

const router = express.Router()

// Nested routes
router.use('/:tourId/reviews', reviewRouter)

router.route('/top-5-cheap').get(aliasTopTours, getAllTours)

router.route('/tour-stats').get(getTourStats)

router.route('/monthly-plan/:year').get(getMonthlyPlan)

router
    .route('/')
    .get(protect, getAllTours)
    .post(createTour)

router
    .route('/:id')
    .get(getOneTour)
    .patch(updateTour)
    .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour)

// router
//     .route('/:tourId/reviews')
//     .post(protect, restrictTo('user'), createReview)    

export default router