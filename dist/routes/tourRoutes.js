"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const tourController_1 = require("../controllers/tourController");
const router = express_1.default.Router();
router.route('/top-5-cheap').get(tourController_1.aliasTopTours, tourController_1.getAllTours);
router.route('/tour-stats').get(tourController_1.getTourStats);
router.route('/monthly-plan/:year').get(tourController_1.getMonthlyPlan);
router
    .route('/')
    .get(authController_1.protect, tourController_1.getAllTours)
    .post(tourController_1.createTour);
router
    .route('/:id')
    .get(tourController_1.getOneTour)
    .patch(tourController_1.updateTour)
    .delete(tourController_1.deleteTour);
exports.default = router;
