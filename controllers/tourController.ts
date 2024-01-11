import { Request, Response } from "express";
import Tour from '../models/tourModel';
import { SortOrder } from 'mongoose';

// const tours = JSON
// .parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// .toString())

export const aliasTopTours = (req:Request, res:Response, next:Function) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next()
}

export const getAllTours = async (req:Request, res:Response) => {
    try {
        //BUILD QUERY
        //1) Filtering
        const queryObj = {...req.query}
        const excludedFields = ['page', 'sort', 'limit', 'fields']
        excludedFields.forEach(el => delete queryObj[el])

        //1B) Advanced filtering
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`) 
        console.log(JSON.parse(queryStr))
        
        let query = Tour.find(JSON.parse(queryStr));

        //2) SORTING
        if (typeof req.query.sort === 'string') {
            query = query.sort(req.query.sort);
        } else if (typeof req.query.sort === 'object') {
            query = query.sort(req.query.sort as { [key: string]: SortOrder | { $meta: any } });
        } else {
            query = query.sort('-createdAt');
        }

        //3) FIELD LIMITING
        if (req.query.fields) {
            const fields = (req.query.fields as string).split(',').join(' ');
            query = query.select(fields)
        } else {
            query = query.select('-__v')
        }

        //4) PAGINATION
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 100;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit)

        if (req.query.page) {
            const numTours = await Tour.countDocuments();
            if (skip >= numTours) throw new Error('This page does not exist');
        }

        //EXECUTE QUERY
        const allTours = await query;

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