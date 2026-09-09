
import express from "express"
import { deleteUser, getUsers } from "../controller/user.controller.js"

const userRouter = express.Router()

userRouter.route("/").get(getUsers)
userRouter.route("/:id").delete(deleteUser)

export default userRouter;