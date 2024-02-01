import mongoose from "mongoose";
import validator from "validator";

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
    startLocation: {
        type: string;
        coordinates: [number];
        address: string;
        description: string;
    };
    locations: [
        {
            type: string;
            coordinates: [number];
            address: string;
            description: string;
            day: number;
        }
    ],
    guides: [
        {
            type: mongoose.Schema.Types.ObjectId;
            ref: 'User';
        }
    
    ];
}

const tourSchema = new mongoose.Schema({
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
            validator: function (this: TourInstance, val: number) {
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
    startDates: [Date],
    startLocation: {
        // GeoJSON
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    // guides: Array // This is for embedding
    guides: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
},
{
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

//DOCUMENT MIDDLEWARE: Runs before .save() and .create() command
// tourSchema.pre('save', function(){
//     console.log(this)
// })

tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'

})

const Tour = mongoose.model<TourInstance>('Tour', tourSchema)

export default Tour