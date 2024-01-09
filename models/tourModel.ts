import mongoose from "mongoose";

export interface TourInstance extends mongoose.Document {
    name: string;
    rating: number;
    price: number;
}

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    rating: {
        type: Number,
        default: 4.5
    },
    price: Number,
},
{
    timestamps: true
})

const Tour = mongoose.model<TourInstance>('Tour', tourSchema)

export default Tour