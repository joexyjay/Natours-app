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
exports.deleteTour = exports.updateTour = exports.createTour = exports.getOneTour = exports.getAllTours = void 0;
const tourModel_1 = __importDefault(require("../models/tourModel"));
// const tours = JSON
// .parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// .toString())
const getAllTours = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allTours = yield tourModel_1.default.find();
        res.status(200).json({
            status: "success",
            data: {
                allTours
            }
        });
    }
    catch (error) {
        res.status(400).json({
            status: "fail",
            msg: error
        });
    }
});
exports.getAllTours = getAllTours;
const getOneTour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tour = yield tourModel_1.default.findById(req.params.id);
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
            msg: error
        });
    }
});
exports.getOneTour = getOneTour;
const createTour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newTour = yield tourModel_1.default.create(req.body);
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
            msg: "Tour creation failed"
        });
    }
});
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
