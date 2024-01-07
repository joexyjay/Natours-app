import fs from 'fs'
import express, {Request, Response} from 'express';

const app = express()

app.use(express.json())

// app.get('/', (req:Request, res:Response)=> {
//     res.status(200).json({
//         message: 'Hello from the server side...'
//     })
// })
const tours = JSON
.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
.toString())

app.get('/api/v1/tours', (req:Request, res:Response) => {
    res.status(200).json({
        status: "success",
        result: tours.length,
        data: {
            tours
        }
    })
})

app.get('/api/v1/tours/:id', (req:Request, res:Response) => {
    
    const id = parseInt(req.params.id)
    const tour = tours.find((el: { id: number; }) => el.id === id)

    if(!tour){
        return res.status(404).json({
            status: "failed",
            msg: "invalid ID"
        })
    }
    res.status(200).json({
        status:"success",
        data: {
            tour
        }
    })
})

app.post('/api/v1/tours', (req:Request, res:Response) => {
    // console.log(req.body)
    const newID = tours[tours.length - 1].id + 1
    const newTour = Object.assign({id:newID}, req.body)
    tours.push(newTour)

    fs.writeFile
    (`${__dirname}/dev-data/data/tours-simple.json`, 
    JSON.stringify(tours), err => {
        res.status(201).json({
            status: "success",
            data: newTour
        })
    })
})

app.patch('/api/v1/tours/:id', (req:Request, res:Response) => {
    res.status(200).json({
        status: "success",
        data: {
            tours: "updated tour successfully"
        }
    })
})

app.delete('/api/v1/tours/:id', (req:Request, res:Response) => {
    res.status(204).json({
        data: null
    })
})

const port = 3000

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})