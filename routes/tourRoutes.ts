import express from "express";
import { 
    getAllTours, 
    createTour, 
    getOneTour, 
    updateTour, 
    deleteTour } from "../controllers/tourController";

const router = express.Router()

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