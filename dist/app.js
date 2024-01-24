"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const morgan_1 = __importDefault(require("morgan"));
const tourRoutes_1 = __importDefault(require("./routes/tourRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
if (process.env.NODE_ENV === "development") {
    app.use((0, morgan_1.default)('dev'));
}
const limiter = (0, express_rate_limit_1.default)({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour'
});
app.use('/api', limiter);
app.use(express_1.default.static(`${__dirname}/public`));
app.use((req, res, next) => {
    console.log('Hello from the middleware');
    next();
});
app.use('/api/v1/tours', tourRoutes_1.default);
app.use('/api/v1/users', userRoutes_1.default);
app.all('*', (req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server`
    });
});
exports.default = app;
