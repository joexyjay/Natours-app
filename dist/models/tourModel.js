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
        trim: true,
        minlength: [10, 'A tour must be more than 10 characters'],
        maxlength: [40, 'A tour must be below 40 characters'],
        // validate: [validator.isAlpha, 'Tour name must only contain characters'] // This will only work on new document creation, and also if you dont want spaces
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
        required: true,
        enum: {
            values: ['easy', 'medium', 'difficulty'],
            message: 'Difficulty is either easy, medium or difficulty'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1'],
        max: [5, 'Rating must be below 5']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: true
    },
    priceDiscount: {
        type: Number,
        validate: {
            // This only points to current doc on NEW document creation
            validator: function (val) {
                return val < this.price;
            }
        },
        message: 'Discount price should be below regular price'
    },
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
//DOCUMENT MIDDLEWARE: Runs before .save() and .create() command
// tourSchema.pre('save', function(){
//     console.log(this)
// })
const Tour = mongoose_1.default.model('Tour', tourSchema);
exports.default = Tour;
