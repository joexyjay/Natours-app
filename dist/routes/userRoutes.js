"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
router.param('id', (req, res, next, val) => {
    console.log(`User id is: ${val}`);
    next();
});
router.post('/signup', authController_1.signUp);
router.post('/login', authController_1.login);
router.post('/forgotPassword', authController_1.forgotPassword);
router.patch('/resetPassword/:token', authController_1.resetPassword);
router.patch('/updatePassword', authController_1.protect, authController_1.updatePassword);
router.route('/').get(userController_1.getAllUsers).post(userController_1.createUser);
router.route('/:id').get(userController_1.getUser).patch(userController_1.updateUser).delete(userController_1.deleteUser);
exports.default = router;
