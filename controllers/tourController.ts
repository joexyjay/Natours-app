import { Request, Response } from "express";
import Tour from '../models/tourModel';
import { AnyExpression, SortOrder } from 'mongoose';

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
        
        let query = Tour.find(JSON.parse(queryStr)).populate({
            path: 'guides',
            select: '-__v -passwordChangedAt'
        });

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
    } catch (error:any) {
        res.status(400).json({
            status: "fail",
            msg: error.message
        }) 
    }
}

export const getOneTour = async (req:Request, res:Response) => {
    try {
        const tour = await Tour.findById(req.params.id).populate({
            path: 'guides',
            select: '-__v -passwordChangedAt'
        
        }).populate({
            path: 'reviews',
            select: '-__v -passwordChangedAt'
        })

        if(!tour) {
            return res.status(404).json({
                status: "fail",
                msg: "No tour found with that ID"
            })
        }
        res.status(200).json({
            status: "success",
            data: {
                tour
            }
        })
    } catch (error:any) {
        res.status(400).json({
            status: "fail",
            msg: error.message
        }) 
    }
}

export const createTour = async (req:Request, res:Response) => {
   try {
    let newTour = await Tour.findOne({ name: req.body.name })
    if(newTour) {
        return res.status(400).json({
            status: "fail",
            msg: "Tour already exists"
        })
    } 
    newTour = await Tour.create(req.body)
    res.status(201).json({
        status: "success",
        data: {
            tour: newTour
        }
    })
   } catch (error:any) {
    res.status(400).json({
        status: "fail",
        msg: error.message
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
        if(!updatedTour) {
            return res.status(404).json({
                status: "fail",
                msg: "No tour found with that ID"
            })
        }
        res.status(201).json({
            status: "success",
            data: {
                tour: updatedTour
            }
        })
        
    } catch (error:any) {
        res.status(400).json({
            status: "fail",
            msg: error.message
        }) 
    }
}

export const deleteTour = async (req:Request, res:Response) => {
    try {
        const tour = await Tour.findByIdAndDelete(req.params.id)
        if(!tour) {
            return res.status(404).json({
                status: "fail",
                msg: "No tour found with that ID"
            })
        }
        res.status(200).json({
            status: 'success',
            message: 'Tour deleted successfully',
        })
    } catch (error:any) {
        res.status(500).json({
            status: "fail",
            msg: 'internal server error'
        }) 
    } 
   
}

export const getTourStats = async (req:Request, res:Response) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } }
            },
            {
                $group: {
                    _id: '$difficulty',
                    numTours: { $sum: 1 },
                    numRatings: { $sum: '$ratingsQuantity' },
                    avgRating: { $avg: '$ratingsAverage'},
                    avgPrice: { $avg: '$price'},
                    minPrice: { $min: '$price'},
                    maxPrice: { $max: '$price'}
                }
            },
            {
                $sort: { avgPrice: 1 }
            }
        ])
        res.status(200).json({
            status: "success",
            data: {
                stats
            }
        })
    } catch (error:any) {
        res.status(400).json({
            status: "fail",
            msg: error.message
        }) 
    }
}
// This function is to check the number of tours in each month so as to know the busiest month in a given year
export const getMonthlyPlan = async (req:Request, res:Response) => {
    try {
        const year = Number(req.params.year)
        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: { 
                    startDates: { 
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    } 
                }
            },
            {
                $group: {
                    _id: { $month: '$startDates' },
                    numTourStarts: { $sum: 1},
                    tours: { $push: '$name' }
                }
            },
            {
                $addFields: { month: '$_id' }
            },
            {
                $project: { _id: 0 }
            },
            {
                $sort: { numTourStarts: -1 }
            },
            {
                $limit: 12
            }
        ])
        res.status(200).json({
            status: "success",
            data: {
                plan
            }
        })
    } catch (error:any) {
        res.status(400).json({
            status: "fail",
            msg: error.message
        }) 
    }
}