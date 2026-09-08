
import express from "express"
import { getUsers } from "../controller/user.controller.js"

const userRouter = express.Router()

userRouter.get("/getUsers",getUsers)

export default userRouter;