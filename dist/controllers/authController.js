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
exports.login = exports.signUp = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const signToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, photo, password, passwordConfirm } = req.body;
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
