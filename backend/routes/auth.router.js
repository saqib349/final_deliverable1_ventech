
import express from 'express'
import { login, logout, signup,verifyOtp } from '../controller/aut.controller.js'


const authRouter= express.Router()


authRouter.post('/signup',signup)
authRouter.post('/login',login)
authRouter.post('/logout',logout)
authRouter.post('/verify-otp/:userId', verifyOtp)

export default authRouter