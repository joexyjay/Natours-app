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
exports.deleteUser = exports.updateUser = exports.getUser = exports.createUser = exports.updateMe = exports.getAllUsers = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userModel_1.default.find();
    res.status(200).json({
        status: 'success',
        result: users.length,
        data: users
    });
});
exports.getAllUsers = getAllUsers;
const updateMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return res.status(400).json({
            status: 'fail',
            msg: 'This route is not for password updates. Please use /updatePassword'
        });
    }
    // 2) Filter out unwanted fields names that are not allowed to be updated
    const filteredBody = {};
    const allowedFields = ['name', 'email'];
    Object.keys(req.body).forEach(field => {
        if (allowedFields.includes(field))
            filteredBody[field] = req.body[field];
    });
    // 3) Update user document
    const updatedUser = yield userModel_1.default.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});
exports.updateMe = updateMe;
const createUser = (req, res) => {
    res.status(500).json({
        status: 'failed',
        msg: 'not defined'
    });
};
exports.createUser = createUser;
const getUser = (req, res) => {
    res;
};
exports.getUser = getUser;
const updateUser = (req, res) => {
    res;
};
exports.updateUser = updateUser;
const deleteUser = (req, res) => {
    res;
};
exports.deleteUser = deleteUser;
