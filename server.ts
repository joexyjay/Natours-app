import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config({path: './config.env'})

import app from "./app";

// const DB = process.env.DB_URI || '';

mongoose.connect(process.env.MONGO_URI as string)
.then(() => {
    console.log('Database connected successfully')
}).catch((err) => {
    console.log(err)
})

// const connectDB = async () => {
//     try {
//         const con = await mongoose.connect(process.env.MONGO_URI as string) 
//         console.log(`DB connected: ${con.connection.host}`)
//     } catch (error) {
//         console.log(error)
//     }
// }
// connectDB()
const port = 3000

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})
