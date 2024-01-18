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

interface AuthRequest extends Request {
    user?: any; // Add the 'user' property to the Request type
  }

export const protect = async (req:AuthRequest, res:Response, next:NextFunction  ) => {
    try {
        // 1) Getting token and check of it's there
        let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }
    if(!token) {
        return res.status(401).json({
            status: "fail",
            msg: "You are not logged in! Please log in to get access"
        })
    }

    // 2) Verification token
    const decoded:any = jwt.verify(token, process.env.JWT_SECRET as string)

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id)
        if(!currentUser) {
            return res.status(401).json({
                status: "fail",
                msg: "The user belonging to this token no longer exist"
            })
        }
    
    // 4) Check if user changed password after the token was issued
    if(currentUser.changedPasswordAfter(decoded.iat)) {
        return res.status(401).json({
            status: "fail",
            msg: "User recently changed password! Please log in again"
        })
    }
    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser
        next()
    } catch (error:any) {
        res.status(400).json({
            status: "fail",
            msg: error.message,
        })
        
    }
}