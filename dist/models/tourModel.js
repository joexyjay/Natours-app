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
        unique: true
    },
    rating: {
        type: Number,
        default: 4.5
    },
    price: Number,
}, {
    timestamps: true
});
const Tour = mongoose_1.default.model('Tour', tourSchema);
exports.default = Tour;
