import { Request, Response } from "express";
import Tour from '../models/tourModel';

// const tours = JSON
// .parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// .toString())

export const getAllTours = async (req:Request, res:Response) => {
    try {
        //BUILD QUERY
        const queryObj = {...req.query}
        const excludedFields = ['page', 'sort', 'limit', 'fields']
        excludedFields.forEach(el => delete queryObj[el])

        const query = Tour.find(queryObj)

        //EXECUTE QUERY
        const allTours = await query

        //SEND RESPONSE
        res.status(200).json({
            status: "success",
            data: {
                results: allTours.length,
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

export const updateTour = async (req:Request, res:Response) => {
    try {
        const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body,
            {
                new: true,
                runValidators: true
            }
        )
        res.status(201).json({
            status: "success",
            data: {
                tour: updatedTour
            }
        })
        
    } catch (error) {
        res.status(400).json({
            status: "fail",
            msg: error
        }) 
    }
}

export const deleteTour = async (req:Request, res:Response) => {
    try {
        await Tour.findByIdAndDelete(req.params.id)
        res.status(204).json({
            data: null
        })
    } catch (error) {
        res.status(400).json({
            status: "fail",
            msg: error
        }) 
    } 
   
}