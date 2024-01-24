import {Request, Response, NextFunction} from 'express'
import crypto from 'crypto'
import User from '../models/userModel'
import jwt from 'jsonwebtoken'
import generateToken from '../utils/generateToken'
import sendEmail from '../utils/email'


export const signUp = async (req:Request, res:Response) => {
    try {
        const {name, email, photo, role, password, passwordConfirm} = req.body
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
            role,
            password,
            passwordConfirm
        })
        newUser.password = undefined || ''

        generateToken(res, newUser._id)
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
        generateToken(res, user._id)
        res.status(200).json({
            status: "success",
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
        // 1) Getting token and check if it's there
        let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
        console.log('token from header:', token)
    }
    else if(req.cookies.jwt) {
        token = req.cookies.jwt
        console.log('token from cookie:', token)
    }
    if(!token) {
        return res.status(401).json({
            status: "fail",
            msg: "You are not logged in! Please log in to get access"
        })
    }

    // 2) Verification token
    let decoded:any
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET as string)
    } catch (error:any) {
        return res.status(401).json({
            status: "fail",
            msg: "Invalid token"
        })
    }

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

export const restrictTo = (...roles:any) => {
    return (req:AuthRequest, res:Response, next:NextFunction) => {
        if(!roles.includes(req.user.role)) {
            return res.status(403).json({
                status: "fail",
                msg: "You do not have permission to perform this action"
            })
        }
        next()
    }
}

export const forgotPassword = async (req:Request, res:Response) => {
    // 1) Get user based on POSTed email
    const user = await User.findOne({email: req.body.email})
    if(!user) {
        return res.status(404).json({
            status: "fail",
            msg: "There is no user with this email address"
        })
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken()
    await user.save({validateBeforeSave: false})

    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}` 

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`

    try {
        await sendEmail({
            email: user.email,
            subject: "Your password reset token (valid for 10 min)",
            message
        })
        console.log('Email sent successfully')
        res.status(200).json({
            status: "success",
            msg: "Token sent to email"
        })
    } catch (error:any) {
        console.error('Error sending email:', error)
        user.passwordResetToken = undefined || ''

        // Set a default expiration (e.g., 10 minutes from now)
        const defaultExpiration = new Date();
        defaultExpiration.setMinutes(defaultExpiration.getMinutes() + 10)
        user.passwordResetExpires = defaultExpiration
        
        await user.save({validateBeforeSave: false})
        return res.status(500).json({
            status: "fail",
            msg: error.message
        })
    }
}

export const resetPassword = async (req: Request, res: Response) => {
    try {
        // 1) Get user based on the token
        const hashedToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex')

        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        })

        // 2) If token has not expired, and there is a user, set the new password
        if (!user) {
            return res.status(400).json({
                status: "fail",
                msg: "Token is invalid or has expired"
            })
        }

        // Check if passwords match
        if (req.body.password !== req.body.passwordConfirm) {
            return res.status(400).json({
                status: "fail",
                msg: "Passwords do not match"
            })
        }

        user.password = req.body.password
        user.passwordConfirm = req.body.passwordConfirm
        user.passwordResetToken = undefined || ''

        // Set a default expiration (e.g., 10 minutes from now)
        const defaultExpiration = new Date();
        defaultExpiration.setMinutes(defaultExpiration.getMinutes() + 10)
        user.passwordResetExpires = defaultExpiration

        await user.save()

        // 3) Update changedPasswordAt property for the user
        // 4) Log the user in, send JWT
        generateToken(res, user._id)

        res.status(200).json({
            status: "success",
        })
    } catch (err:any) {
        console.error(err);
        res.status(500).json({
            status: "error",
            msg: err.message
        });
    }
}

export const updatePassword = async (req: AuthRequest, res: Response) => {
    try {
        // 1) Get user from collection
        const user = await User.findById(req.user.id).select('+password')

        // 2) Check if POSTed current password is correct
        if (!user || !(await user.correctPassword(req.body.passwordCurrent, user.password))) {
            return res.status(401).json({
                status: "fail",
                msg: "Your current password is wrong"
            })
        }

        // 3) Check if new password and password confirmation match
        if (req.body.password !== req.body.passwordConfirm) {
            return res.status(400).json({
                status: "fail",
                msg: "New password and password confirmation do not match"
            })
        }

        // 4) If so, update password
        user.password = req.body.password
        user.passwordConfirm = req.body.passwordConfirm
        await user.save()

        // 5) Log user in, send JWT
        generateToken(res, user._id)
        res.status(200).json({
            status: "success",
        })
    } catch (err:any) {
        console.error(err);
        res.status(500).json({
            status: "error",
            msg: err.message
        });
    }
}

