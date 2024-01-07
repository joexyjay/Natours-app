"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const tours = JSON
    .parse(fs_1.default.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
    .toString());
const getAllTours = (req, res) => {
    res.status(200).json({
        status: "success",
        result: tours.length,
        data: {
            tours
        }
    });
};
const getOneTour = (req, res) => {
    const id = parseInt(req.params.id);
    const tour = tours.find((el) => el.id === id);
    if (!tour) {
        return res.status(404).json({
            status: "failed",
            msg: "invalid ID"
        });
    }
    res.status(200).json({
        status: "success",
        data: {
            tour
        }
    });
};
const createTour = (req, res) => {
    // console.log(req.body)
    const newID = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newID }, req.body);
    tours.push(newTour);
    fs_1.default.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: "success",
            data: newTour
        });
    });
};
const updateTour = (req, res) => {
    res.status(200).json({
        status: "success",
        data: {
            tours: "updated tour successfully"
        }
    });
};
const deleteTour = (req, res) => {
    res.status(204).json({
        data: null
    });
};
// app.get('/api/v1/tours', getAllTours)
// app.get('/api/v1/tours/:id', getOneTour)
// app.post('/api/v1/tours', createTour)
// app.patch('/api/v1/tours/:id', updateTour)
// app.delete('/api/v1/tours/:id', deleteTour)
app
    .route('/api/v1/tours')
    .get(getAllTours)
    .post(createTour);
app
    .route('/api/v1/tours/:id')
    .get(getOneTour)
    .patch(updateTour)
    .delete(deleteTour);
const port = 3000;
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
