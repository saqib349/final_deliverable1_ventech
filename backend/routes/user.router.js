
import express from "express"
import { addUser, deleteUser, getUserById, getUsers, updateUser } from "../controller/user.controller.js"

const userRouter = express.Router()

userRouter.route("/").get(getUsers).post(addUser)
userRouter.route("/:id").delete(deleteUser).patch(updateUser).get(getUserById)

export default userRouter;