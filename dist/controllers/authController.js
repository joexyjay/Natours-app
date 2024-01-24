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
exports.updatePassword = exports.resetPassword = exports.forgotPassword = exports.restrictTo = exports.protect = exports.login = exports.signUp = void 0;
const crypto_1 = __importDefault(require("crypto"));
const userModel_1 = __importDefault(require("../models/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const email_1 = __importDefault(require("../utils/email"));
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
        newUser.password = undefined || '';
        (0, generateToken_1.default)(res, newUser._id);
        res.status(201).json({
            status: "success",
            data: {
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
        (0, generateToken_1.default)(res, user._id);
        res.status(200).json({
            status: "success",
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
        // 1) Getting token and check if it's there
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
            console.log('token from header:', token);
        }
        else if (req.cookies.jwt) {
            token = req.cookies.jwt;
            console.log('token from cookie:', token);
        }
        if (!token) {
            return res.status(401).json({
                status: "fail",
                msg: "You are not logged in! Please log in to get access"
            });
        }
        // 2) Verification token
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        }
        catch (error) {
            return res.status(401).json({
                status: "fail",
                msg: "Invalid token"
            });
        }
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
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 1) Get user based on POSTed email
    const user = yield userModel_1.default.findOne({ email: req.body.email });
    if (!user) {
        return res.status(404).json({
            status: "fail",
            msg: "There is no user with this email address"
        });
    }
    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    yield user.save({ validateBeforeSave: false });
    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
    try {
        yield (0, email_1.default)({
            email: user.email,
            subject: "Your password reset token (valid for 10 min)",
            message
        });
        console.log('Email sent successfully');
        res.status(200).json({
            status: "success",
            msg: "Token sent to email"
        });
    }
    catch (error) {
        console.error('Error sending email:', error);
        user.passwordResetToken = undefined || '';
        // Set a default expiration (e.g., 10 minutes from now)
        const defaultExpiration = new Date();
        defaultExpiration.setMinutes(defaultExpiration.getMinutes() + 10);
        user.passwordResetExpires = defaultExpiration;
        yield user.save({ validateBeforeSave: false });
        return res.status(500).json({
            status: "fail",
            msg: error.message
        });
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1) Get user based on the token
        const hashedToken = crypto_1.default
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');
        const user = yield userModel_1.default.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        });
        // 2) If token has not expired, and there is a user, set the new password
        if (!user) {
            return res.status(400).json({
                status: "fail",
                msg: "Token is invalid or has expired"
            });
        }
        // Check if passwords match
        if (req.body.password !== req.body.passwordConfirm) {
            return res.status(400).json({
                status: "fail",
                msg: "Passwords do not match"
            });
        }
        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        user.passwordResetToken = undefined || '';
        // Set a default expiration (e.g., 10 minutes from now)
        const defaultExpiration = new Date();
        defaultExpiration.setMinutes(defaultExpiration.getMinutes() + 10);
        user.passwordResetExpires = defaultExpiration;
        yield user.save();
        // 3) Update changedPasswordAt property for the user
        // 4) Log the user in, send JWT
        (0, generateToken_1.default)(res, user._id);
        res.status(200).json({
            status: "success",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            status: "error",
            msg: err.message
        });
    }
});
exports.resetPassword = resetPassword;
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1) Get user from collection
        const user = yield userModel_1.default.findById(req.user.id).select('+password');
        // 2) Check if POSTed current password is correct
        if (!user || !(yield user.correctPassword(req.body.passwordCurrent, user.password))) {
            return res.status(401).json({
                status: "fail",
                msg: "Your current password is wrong"
            });
        }
        // 3) Check if new password and password confirmation match
        if (req.body.password !== req.body.passwordConfirm) {
            return res.status(400).json({
                status: "fail",
                msg: "New password and password confirmation do not match"
            });
        }
        // 4) If so, update password
        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        yield user.save();
        // 5) Log user in, send JWT
        (0, generateToken_1.default)(res, user._id);
        res.status(200).json({
            status: "success",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            status: "error",
            msg: err.message
        });
    }
});
exports.updatePassword = updatePassword;
