import {Request, Response} from 'express'
import Review from "../models/reviewModel";

export const createReview = async (req:Request, res:Response) => {
    try {
        // Allow nested routes
        if (!req.body.tour) req.body.tour = req.params.tourId
        if (!req.body.user) req.body.user = (req as any).user.id
        const newReview = await Review.create(req.body)
        res.status(201).json({
            status: "success",
            msg: "Review created successfully",
            data: {
                review: newReview
            }
        })
    } catch (error: any) {
        res.status(400).json({
            status: "fail",
            msg: error.message
        })
    }
}

export const getAllReviews = async (req:Request, res:Response) => {
    try {
        let filter:any = {}
        if (req.params.tourId) filter = {tour: req.params.tourId}

        const allReviews = await Review.find(filter)
        
        res.status(200).json({
            status: "success",
            result: allReviews.length,
            data: {
                allReviews
            }
        })
        
    } catch (error:any) {
        res.status(400).json({
            status: "fail",
            msg: error.message
        })
    }
}

export const getReview = async (req:Request, res:Response) => {
    try {
        const review = await Review.findById(req.params.id)
        
        res.status(200).json({
            status: "success",
            data: {
                review
            }
        })
        
    } catch (error:any) {
        res.status(400).json({
            status: "fail",
            msg: error.message
        })
    }
}