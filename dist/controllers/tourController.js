"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMonthlyPlan = exports.getTourStats = exports.deleteTour = exports.updateTour = exports.createTour = exports.getOneTour = exports.getAllTours = exports.aliasTopTours = void 0;
const tourModel_1 = __importDefault(require("../models/tourModel"));
const handlerFactory_1 = require("./handlerFactory");
// const tours = JSON
// .parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// .toString())
const aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};
exports.aliasTopTours = aliasTopTours;
const getAllTours = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //BUILD QUERY
        //1) Filtering
        const queryObj = Object.assign({}, req.query);
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);
        //1B) Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        console.log(JSON.parse(queryStr));
        let query = tourModel_1.default.find(JSON.parse(queryStr)).populate({
            path: 'guides',
            select: '-__v -passwordChangedAt'
        });
        //2) SORTING
        if (typeof req.query.sort === 'string') {
            query = query.sort(req.query.sort);
        }
        else if (typeof req.query.sort === 'object') {
            query = query.sort(req.query.sort);
        }
        else {
            query = query.sort('-createdAt');
        }
        //3) FIELD LIMITING
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        }
        else {
            query = query.select('-__v');
        }
        //4) PAGINATION
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 100;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        if (req.query.page) {
            const numTours = yield tourModel_1.default.countDocuments();
            if (skip >= numTours)
                throw new Error('This page does not exist');
        }
        //EXECUTE QUERY
        const allTours = yield query;
        //SEND RESPONSE
        res.status(200).json({
            status: "success",
            data: {
                results: allTours.length,
                allTours
            }
        });
    }
    catch (error) {
        res.status(400).json({
            status: "fail",
            msg: error.message
        });
    }
});
exports.getAllTours = getAllTours;
const getOneTour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tour = yield tourModel_1.default.findById(req.params.id).populate({
            path: 'guides',
            select: '-__v -passwordChangedAt'
        }).populate({
            path: 'reviews',
            select: '-__v -passwordChangedAt'
        });
        if (!tour) {
            return res.status(404).json({
                status: "fail",
                msg: "No tour found with that ID"
            });
        }
        res.status(200).json({
            status: "success",
            data: {
                tour
            }
        });
    }
    catch (error) {
        res.status(400).json({
            status: "fail",
            msg: error.message
        });
    }
});
exports.getOneTour = getOneTour;
const createTour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let newTour = yield tourModel_1.default.findOne({ name: req.body.name });
        if (newTour) {
            return res.status(400).json({
                status: "fail",
                msg: "Tour already exists"
            });
        }
        newTour = yield tourModel_1.default.create(req.body);
        res.status(201).json({
            status: "success",
            data: {
                tour: newTour
            }
        });
    }
    catch (error) {
        res.status(400).json({
            status: "fail",
            msg: error.message
        });
    }
});
exports.createTour = createTour;
const updateTour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedTour = yield tourModel_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updatedTour) {
            return res.status(404).json({
                status: "fail",
                msg: "No tour found with that ID"
            });
        }
        res.status(201).json({
            status: "success",
            data: {
                tour: updatedTour
            }
        });
    }
    catch (error) {
        res.status(400).json({
            status: "fail",
            msg: error.message
        });
    }
});
exports.updateTour = updateTour;
exports.deleteTour = (0, handlerFactory_1.deleteOne)(tourModel_1.default);
// export const deleteTour = async (req:Request, res:Response) => {
//     try {
//         const tour = await Tour.findByIdAndDelete(req.params.id)
//         if(!tour) {
//             return res.status(404).json({
//                 status: "fail",
//                 msg: "No tour found with that ID"
//             })
//         }
//         res.status(200).json({
//             status: 'success',
//             message: 'Tour deleted successfully',
//         })
//     } catch (error:any) {
//         res.status(500).json({
//             status: "fail",
//             msg: 'internal server error'
//         }) 
//     } 
// }
const getTourStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stats = yield tourModel_1.default.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } }
            },
            {
                $group: {
                    _id: '$difficulty',
                    numTours: { $sum: 1 },
                    numRatings: { $sum: '$ratingsQuantity' },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            },
            {
                $sort: { avgPrice: 1 }
            }
        ]);
        res.status(200).json({
            status: "success",
            data: {
                stats
            }
        });
    }
    catch (error) {
        res.status(400).json({
            status: "fail",
            msg: error.message
        });
    }
});
exports.getTourStats = getTourStats;
// This function is to check the number of tours in each month so as to know the busiest month in a given year
const getMonthlyPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const year = Number(req.params.year);
        const plan = yield tourModel_1.default.aggregate([
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
                    numTourStarts: { $sum: 1 },
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
        ]);
        res.status(200).json({
            status: "success",
            data: {
                plan
            }
        });
    }
    catch (error) {
        res.status(400).json({
            status: "fail",
            msg: error.message
        });
    }
});
exports.getMonthlyPlan = getMonthlyPlan;
