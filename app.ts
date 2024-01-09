import express, {NextFunction, Request, Response} from 'express';
import morgan from 'morgan'
import tourRouter from './routes/tourRoutes';
import userRouter from './routes/userRoutes'


const app = express()

app.use(express.json())

if(process.env.NODE_ENV === "development") {
    app.use(morgan('dev'))
}

app.use(express.static(`${__dirname}/public`))

app.use((req:Request, res:Response, next:NextFunction)=> {
    console.log('Hello from the middleware')
    next()
})

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

export default app