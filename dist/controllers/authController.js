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
exports.restrictTo = exports.protect = exports.login = exports.signUp = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const signToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, photo, role, password, passwordConfirm } = req.body;
        let newUser = yield userModel_1.default.findOne({ email });
        if (newUser) {
            return res.status(404).json({
                status: "fail",
                msg: "user already exist"
            });
        }
        newUser = yield userModel_1.default.create({
            name,
            email,
            photo,
            role,
            password,
            passwordConfirm
        });
        const token = signToken(newUser._id);
        res.status(201).json({
            status: "success",
            data: {
                token,
                user: newUser
            }
        });
    }
    catch (error) {
        res.status(400).json({
            status: "fail",
            msg: error.message,
        });
    }
});
exports.signUp = signUp;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                status: "fail",
                msg: "Please provide email and password"
            });
        }
        const user = yield userModel_1.default.findOne({ email }).select('+password');
        if (!user || !(yield user.correctPassword(password, user.password))) {
            return res.status(401).json({
                status: "fail",
                msg: "Incorrect email or password"
            });
        }
        const token = signToken(user._id);
        res.status(200).json({
            status: "success",
            token
        });
    }
    catch (error) {
        res.status(400).json({
            status: "fail",
            msg: error.message,
        });
    }
});
exports.login = login;
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1) Getting token and check of it's there
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return res.status(401).json({
                status: "fail",
                msg: "You are not logged in! Please log in to get access"
            });
        }
        // 2) Verification token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // 3) Check if user still exists
        const currentUser = yield userModel_1.default.findById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({
                status: "fail",
                msg: "The user belonging to this token no longer exist"
            });
        }
        // 4) Check if user changed password after the token was issued
        if (currentUser.changedPasswordAfter(decoded.iat)) {
            return res.status(401).json({
                status: "fail",
                msg: "User recently changed password! Please log in again"
            });
        }
        // GRANT ACCESS TO PROTECTED ROUTE
        req.user = currentUser;
        next();
    }
    catch (error) {
        res.status(400).json({
            status: "fail",
            msg: error.message,
        });
    }
});
exports.protect = protect;
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                status: "fail",
                msg: "You do not have permission to perform this action"
            });
        }
        next();
    };
};
exports.restrictTo = restrictTo;
