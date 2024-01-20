import { Request, Response } from "express";
import User from "../models/userModel";

export const getAllUsers = async (req:Request, res:Response) => {
    const users = await User.find();
    res.status(200).json({
        status: 'success',
        result: users.length,
        data: users
    })
}

interface AuthRequest extends Request {
    user?: any; // Add the 'user' property to the Request type
  }
export const updateMe = async (req:AuthRequest, res:Response) => {
    // 1) Create error if user POSTs password data
    if(req.body.password || req.body.passwordConfirm) {
        return res.status(400).json({
            status: 'fail',
            msg: 'This route is not for password updates. Please use /updatePassword'
        })
    }

    // 2) Filter out unwanted fields names that are not allowed to be updated
    const filteredBody:any = {}
    const allowedFields = ['name', 'email']
    Object.keys(req.body).forEach(field => {
        if(allowedFields.includes(field)) filteredBody[field] = req.body[field]
    })

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
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