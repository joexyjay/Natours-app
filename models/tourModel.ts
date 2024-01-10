import mongoose from "mongoose";

export interface TourInstance extends mongoose.Document {
    name: string;
    duration: number;
    maxGroupSize: number;
    difficulty: string;
    ratingsAverage: number;
    ratingsQuantity: number;
    price: number;
    priceDiscount: number;
    summary: string;
    description: string;
    imageCover: string;
    images: [string];
    startDates: [Date];
}

const tourSchema = new mongoose.Schema({
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
    },
    imageCover: {
        type: String,
        required: true
    },
    images: [String],
    startDates: [Date]
},
{
    timestamps: true
})

const Tour = mongoose.model<TourInstance>('Tour', tourSchema)

export default Tour