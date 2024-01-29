import express, {NextFunction, Request, Response} from 'express';
import morgan from 'morgan';
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize'
import tourRouter from './routes/tourRoutes';
import userRouter from './routes/userRoutes'
import reviewRouter from './routes/reviewRoutes'


const app = express()

app.use(helmet())

app.use(express.json())
app.use(cookieParser())
app.use(mongoSanitize())

if(process.env.NODE_ENV === "development") {
    app.use(morgan('dev'))
}

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour'

})

app.use('/api', limiter)

app.use(express.static(`${__dirname}/public`))

app.use((req:Request, res:Response, next:NextFunction)=> {
    console.log('Hello from the middleware')
    next()
})

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/reviews', reviewRouter)

app.all('*', (req:Request, res:Response, next:NextFunction) => {
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server`
    })
})

export default app