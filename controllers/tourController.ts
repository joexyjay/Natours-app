import fs from 'fs'
import { Request, Response} from "express";

const tours = JSON
.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
.toString())

export const getAllTours = (req:Request, res:Response) => {
    res.status(200).json({
        status: "success",
        result: tours.length,
        data: {
            tours
        }
    })
}

export const getOneTour = (req:Request, res:Response) => {
    
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
}

export const createTour = (req:Request, res:Response) => {
    // console.log(req.body)
    const newID = tours[tours.length - 1].id + 1
    const newTour = Object.assign({id:newID}, req.body)
    tours.push(newTour)

    fs.writeFile
    (`${__dirname}/../dev-data/data/tours-simple.json`, 
    JSON.stringify(tours), err => {
        res.status(201).json({
            status: "success",
            data: newTour
        })
    })
}

export const updateTour = (req:Request, res:Response) => {
    res.status(200).json({
        status: "success",
        data: {
            tours: "updated tour successfully"
        }
    })
}

export const deleteTour = (req:Request, res:Response) => {
    res.status(204).json({
        data: null
    })
}