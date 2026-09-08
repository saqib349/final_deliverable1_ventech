import User from "../models/User.model.js"
import { createToken } from "../util/session.js"
import { comparePasswords, hashigPassword } from "../util/hashing.js"


export async function signup(req, res) {
    try {
        const { username, email, password } = req.body
        console.log(username, email, password)
        const hashedPassword = await hashigPassword(password)
        const result = await User.create({
            username,
            email,
            password: hashedPassword
        })
        res.status(201).json({
            data: result
        })
    }
    catch (err) {
        res.status(400).json({
            message: err.message
        })
    }

}
export async function login(req, res) {
    try {

        const { email, password } = req.body
        console.log(email, password)
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
            secure: false,
            sameSite: 'none'
        });
        res.json({
            data: user,
        })
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }

}

export function logout(req,res){
    console.log(req.cookies.token)
    res.clearCookie("token",{
            httpOnly: true,
            secure: false,
            sameSite: 'lax'
        })
    res.json({
        message:"successfully login"
    })
}