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
exports.getReview = exports.getAllReviews = exports.createReview = void 0;
const reviewModel_1 = __importDefault(require("../models/reviewModel"));
const createReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newReview = yield reviewModel_1.default.create(req.body);
        res.status(201).json({
            status: "success",
            msg: "Review created successfully",
            data: {
                review: newReview
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
exports.createReview = createReview;
const getAllReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allReviews = yield reviewModel_1.default.find();
        res.status(200).json({
            status: "success",
            result: allReviews.length,
            data: {
                allReviews
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
exports.getAllReviews = getAllReviews;
const getReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const review = yield reviewModel_1.default.findById(req.params.id);
        res.status(200).json({
            status: "success",
            data: {
                review
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
exports.getReview = getReview;
