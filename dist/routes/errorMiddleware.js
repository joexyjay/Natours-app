"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
const errorHandler = (err, req, res, next) => {
    const error = new CustomError(err.message, 500);
    error.stack = err.stack;
};
