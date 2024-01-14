import express, {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/userModel'

const signToken = (id: any) => {
    return jwt.sign({id}, process.env.JWT_SECRET as string, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

export const signUp = async (req:Request, res:Response) => {
    try {
        const {name, email, photo, password, passwordConfirm} = req.body
        let newUser = await User.findOne({email})
        if(newUser) {
            return res.status(404).json({
                status: "fail",
                msg: "user already exist"
            })
        }
        newUser = await User.create({
            name,
            email,
            photo,
            password,
            passwordConfirm
        })

        const token = signToken(newUser._id)

        res.status(201).json({
            status: "success",
            data: {
                token,
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

export const login = async (req:Request, res:Response) => {
    try {
        const {email, password} = req.body
        if(!email || !password) {
            return res.status(400).json({
                status: "fail",
                msg: "Please provide email and password"
            })
        }

        const user = await User.findOne({email}).select('+password')
        if(!user || !(await user.correctPassword(password, user.password))) {
            return res.status(401).json({
                status: "fail",
                msg: "Incorrect email or password"
            })
        }

        const token = signToken(user._id)

        res.status(200).json({
            status: "success",
            token
        })
    } catch (error:any) {
        res.status(400).json({
            status: "fail",
            msg: error.message,
        })
    }
}