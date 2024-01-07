"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTour = exports.updateTour = exports.createTour = exports.getOneTour = exports.getAllTours = exports.checkID = void 0;
const fs_1 = __importDefault(require("fs"));
const tours = JSON
    .parse(fs_1.default.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
    .toString());
const checkID = (req, res, next, val) => {
    console.log(`Tour id is: ${val}`);
    const id = parseInt(req.params.id);
    console.log(id);
    if (id > tours.length) {
        return res.status(404).json({
            status: "failed",
            msg: "unknown ID"
        });
    }
    next();
};
exports.checkID = checkID;
const getAllTours = (req, res) => {
    res.status(200).json({
        status: "success",
        result: tours.length,
        data: {
            tours
        }
    });
};
exports.getAllTours = getAllTours;
const getOneTour = (req, res) => {
    const id = parseInt(req.params.id);
    const tour = tours.find((el) => el.id === id);
    if (!tour) {
        return res.status(404).json({
            status: "failed",
            msg: "invalid ID"
        });
    }
    res.status(200).json({
        status: "success",
        data: {
            tour
        }
    });
};
exports.getOneTour = getOneTour;
const createTour = (req, res) => {
    // console.log(req.body)
    const newID = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newID }, req.body);
    tours.push(newTour);
    fs_1.default.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: "success",
            data: newTour
        });
    });
};
exports.createTour = createTour;
const updateTour = (req, res) => {
    res.status(200).json({
        status: "success",
        data: {
            tours: "updated tour successfully"
        }
    });
};
exports.updateTour = updateTour;
const deleteTour = (req, res) => {
    res.status(204).json({
        data: null
    });
};
exports.deleteTour = deleteTour;
