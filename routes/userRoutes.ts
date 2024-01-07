import express, {Request, Response, NextFunction} from "express";
import { 
    getAllUsers, 
    createUser, 
    getUser, 
    updateUser, 
    deleteUser } from "../controllers/userController";

const router = express.Router()

router.param('id', (req:Request, res:Response, next:NextFunction, val:number) => {
    console.log(`User id is: ${val}`)
    next()
})

router.route('/').get(getAllUsers).post(createUser)
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

export default router