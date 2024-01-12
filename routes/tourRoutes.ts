import express from "express";
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

const router = express.Router()

router.route('/top-5-cheap').get(aliasTopTours, getAllTours)

router.route('/tour-stats').get(getTourStats)

router.route('/monthly-plan/:year').get(getMonthlyPlan)

router
    .route('/')
    .get(getAllTours)
    .post(createTour)

router
    .route('/:id')
    .get(getOneTour)
    .patch(updateTour)
    .delete(deleteTour)

export default router