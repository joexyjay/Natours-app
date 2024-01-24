import jwt from "jsonwebtoken"
const generateToken = (res:any, id: any) => {
    const token = jwt.sign({id}, process.env.JWT_SECRET as string, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
    res.cookie('jwt', token, {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        secure: process.env.NODE_ENV === 'production' ? true : false,
        httpOnly: true
    })
}

export default generateToken