import express, {Request, Response, NextFunction} from 'express'
import User from '../models/userModel'

export const signUp = async (req:Request, res:Response) => {
    try {
        let newUser = await User.findOne({email: req.body.email})
        if(newUser) {
            return res.status(404).json({
                status: "fail",
                msg: "user already exist"
            })
        }
        newUser = await User.create(req.body)
        res.status(201).json({
            status: "success",
            data: {
                user: newUser
            }
        })
    } catch (error:any) {
        res.status(400).json({
            status: "fail",
            msg: error.message,
        })
    }
}