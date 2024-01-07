"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
// app.get('/', (req:Request, res:Response)=> {
//     res.status(200).json({
//         message: 'Hello from the server side...'
//     })
// })
const tours = JSON.parse(fs_1.default.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`).toString());
app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: "success",
        result: tours.length,
        data: {
            tours
        }
    });
});
const port = 3000;
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
