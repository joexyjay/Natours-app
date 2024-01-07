import fs from 'fs'
import express, {Request, Response} from 'express';

const app = express()

// app.get('/', (req:Request, res:Response)=> {
//     res.status(200).json({
//         message: 'Hello from the server side...'
//     })
// })
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`).toString())

app.get('/api/v1/tours', (req:Request, res:Response) => {
    res.status(200).json({
        status: "success",
        result: tours.length,
        data: {
            tours
        }
    })
})

const port = 3000

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})