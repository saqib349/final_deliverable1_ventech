import User from "../models/User.model.js"
import { createToken } from "../util/session.js"
import { comparePasswords, hashigPassword } from "../util/hashing.js"
import { sendEmail } from "../services/email.service.js"


export async function signup(req, res,next) {
    try {
        const { username, email, password } = req.body
        const userExist= await User.findOne({email})
        if (userExist){
            return res.status(400).json({
                message: "user exist already with this email"
            })
        }
        const hashedPassword = await hashigPassword(password)
        const result = await User.create({
            username,
            email,
            password: hashedPassword
        })
        await sendEmail(email, username)
        res.status(201).json({
            data: result
        })
    }
    catch (err) {
        next(err)
    }

}
export async function login(req, res,next) {
    try {

        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({
                message: "email not correct"
            })
        }
        const isPasswordCorrect = await comparePasswords(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(404).json({
                message: "password not correct"
            })
        }
        const token = createToken({ username:user.username, _id: user._id,role:user.role })
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });
        const newUser={
            username:user.username,
            role:user.role,
            _id:user._id
        }
        return res.json({
            data: newUser,
        })
    }
    catch (err) {
        next(err)
    }

}

export function logout(req,res){
    console.log(req.cookies.token)
     res.clearCookie("token",{
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        })
    return res.json({
        message:"successfully logout"
    })
}