
import express from 'express'
import { facebookCallback, facebookLogin, googleCallback, googleLogin, login, logout, signup,verifyOtp } from '../controller/aut.controller.js'


const authRouter= express.Router()


authRouter.post('/signup',signup)
authRouter.post('/login',login)
authRouter.post('/logout',logout)
authRouter.post('/verify-otp/:userId', verifyOtp)
authRouter.get('/google',googleLogin)
authRouter.get('/google/callback', googleCallback);
authRouter.get('/facebook',facebookLogin)
authRouter.get('/facebook/callback',facebookCallback)


export default authRouter