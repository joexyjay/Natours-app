"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: './config.env' });
const app_1 = __importDefault(require("./app"));
// const DB = process.env.DB_URI || '';
mongoose_1.default.connect(process.env.MONGO_URI)
    .then(() => {
    console.log('Database connected successfully');
}).catch((err) => {
    console.log(err);
});
// const connectDB = async () => {
//     try {
//         const con = await mongoose.connect(process.env.MONGO_URI as string) 
//         console.log(`DB connected: ${con.connection.host}`)
//     } catch (error) {
//         console.log(error)
//     }
// }
// connectDB()
const port = 3000;
app_1.default.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
