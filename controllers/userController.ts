import { Request, Response } from "express";

export const getAllUsers = (req:Request, res:Response) => {
    res.status(500).json({
        msg: 'Internal server error',
        data: 'error'
    })
}
export const createUser = (req:Request, res:Response) => {
    res.status(500).json({
        status: 'failed',
        msg: 'not defined'
    })
}
export const getUser = (req:Request, res:Response) => {
    res
}
export const updateUser = (req:Request, res:Response) => {
    res
}
export const deleteUser = (req:Request, res:Response) => {
    res
}