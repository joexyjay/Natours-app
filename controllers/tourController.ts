import { Request, Response } from "express";
import Tour from '../models/tourModel';

// const tours = JSON
// .parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// .toString())

export const getAllTours = async (req:Request, res:Response) => {
    try {
        const allTours = await Tour.find()
        res.status(200).json({
            status: "success",
            data: {
                allTours
            }
        })
    } catch (error) {
        res.status(400).json({
            status: "fail",
            msg: error
        }) 
    }
}

export const getOneTour = async (req:Request, res:Response) => {
    try {
        const tour = await Tour.findById(req.params.id)
        res.status(200).json({
            status: "success",
            data: {
                tour
            }
        })
    } catch (error) {
        res.status(400).json({
            status: "fail",
            msg: error
        }) 
    }
}

export const createTour = async (req:Request, res:Response) => {
   try {
    const newTour = await Tour.create(req.body)
    res.status(201).json({
        status: "success",
        data: {
            tour: newTour
        }
    })
   } catch (error) {
    res.status(400).json({
        status: "fail",
        msg: "Tour creation failed"
    }) 
   }
}

export const updateTour = (req:Request, res:Response) => {
    res.status(200).json({
        status: "success",
        data: {
            tours: "updated tour successfully"
        }
    })
}

export const deleteTour = (req:Request, res:Response) => {
    res.status(204).json({
        data: null
    })
}