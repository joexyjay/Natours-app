"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const tourSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    duration: {
        type: Number,
        required: true
    },
    maxGroupSize: {
        type: Number,
        required: true
    },
    difficulty: {
        type: String,
        required: true
    },
    ratingsAverage: {
        type: Number,
        default: 4.5
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: Number,
    priceDiscount: Number,
    summary: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        // select: false // This will hide the description field from the response
    },
    imageCover: {
        type: String,
        required: true
    },
    images: [String],
    startDates: [Date]
}, {
    timestamps: true
});
const Tour = mongoose_1.default.model('Tour', tourSchema);
exports.default = Tour;
