import mongoose from "mongoose";
import { Query } from "mongoose";

export interface ReviewInstance extends mongoose.Document {
    review: string;
    rating: number;
    tour: mongoose.Schema.Types.ObjectId;
    user: mongoose.Schema.Types.ObjectId;
}

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review cannot be empty']
    },
    rating: {
        type: Number,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0']
    },
    tour: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belong to a tour']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user']
    }
},
{
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
},
)

reviewSchema.pre(/^find/, function(this: Query<ReviewInstance[], ReviewInstance>, next) {
    this.populate({
        path: 'user',
        select: 'name'
    }).populate({
        path: 'tour',
        select: 'name'
    });
    next();
});

const Review = mongoose.model<ReviewInstance>('Review', reviewSchema);

export default Review;