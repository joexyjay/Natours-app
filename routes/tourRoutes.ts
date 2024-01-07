import express, { Request, Response, NextFunction } from "express";
import { 
    checkID,
    getAllTours, 
    createTour, 
    getOneTour, 
    updateTour, 
    deleteTour } from "../controllers/tourController";

const router = express.Router()

router.param('id', checkID)

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