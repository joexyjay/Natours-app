import { Request, Response } from "express";
import Tour from '../models/tourModel';

// const tours = JSON
// .parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// .toString())

export const getAllTours = (req:Request, res:Response) => {
    res.status(200).json({
        status: "success",
       
    })
}

export const getOneTour = (req:Request, res:Response) => {
    
    res.status(200).json({
        status:"success",
       
    })
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