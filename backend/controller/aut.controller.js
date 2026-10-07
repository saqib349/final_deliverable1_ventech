import User from "../models/User.model.js"
import { createToken } from "../util/session.js"
import { comparePasswords, hashigPassword } from "../util/hashing.js"
import { sendEmail } from "../services/email.service.js"
import crypto from "crypto"


export async function signup(req, res) {
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
        const subject = "Welcome to Our Platform!";
        const text = `Hello ${username},\n\nThank you for signing up! We're thrilled to have you on board. If you have any questions or need assistance, feel free to reach out.\n\nBest regards,\nThe Team`;
        await sendEmail(email, subject, text)
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
        const otp = crypto.randomInt(100000,1000000).toString();
        const subject = "Your OTP Code";
        const text = `Hello ${user.username},\n\nYour OTP code is: ${otp}\n\nPlease use this code to complete your login process. This code is valid for a limited time.\n\nBest regards,\nThe Team`;
        await sendEmail(email, subject, text)
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 2 * 60 * 1000);
        await user.save();
        res.status(200).json({
            message: "OTP sent to your email. Please check your inbox.",
            userId: user._id
        })
        // const token = createToken({ username:user.username, _id: user._id,role:user.role })
        // res.cookie('token', token, {
        //     httpOnly: true,
        //     secure: false,
        //     sameSite: 'lax'
        // });
        // res.json({
        //     data: user,
        // })
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }

}

export const verifyOtp = async (req, res) => {
    try {
        const { userId } = req.params;
        const { otp } = req.body;
        console.log(userId, otp)
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        if (user.otp !== otp) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }
        if (user.otpExpires < new Date()) {
            return res.status(400).json({
                message: "OTP has expired"
            });
        }
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();
        const token = createToken({ username:user.username, _id: user._id,role:user.role })
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });
        res.status(200).json({
            message: "OTP verified successfully",
            data: user
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

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