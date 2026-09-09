
import express from "express"
import { deleteUser, getUsers, updateUser } from "../controller/user.controller.js"

const userRouter = express.Router()

userRouter.route("/").get(getUsers)
userRouter.route("/:id").delete(deleteUser).patch(updateUser)

export default userRouter;