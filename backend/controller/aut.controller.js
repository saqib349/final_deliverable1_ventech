import User from "../models/User.model.js"
import { createToken } from "../util/session.js"
import { comparePasswords, hashigPassword } from "../util/hashing.js"
import { sendEmail } from "../services/email.service.js"
import crypto from "crypto"
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

export function googleLogin(req, res) {
    const googleAuthUrl = googleClient.generateAuthUrl({
        access_type: "offline",
        scope: ["openid", "email", "profile"],
        prompt: "select_account"
    });

    res.redirect(googleAuthUrl);
}

export async function googleCallback(req, res, next) {
    const { code } = req.query;
    console.log("Google callback code:", code);
    try {
        if (!code) {
            return res.status(400).json({ message: "Authorization code is missing" });
        }
        const { tokens } = await googleClient.getToken(code);
         if (!tokens.id_token) {
            return res.status(400).json({
                message: "Google ID token not received"
            });
        }
        const ticket = await googleClient.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.CLIENT_ID
        });
        const payload = ticket.getPayload();
        const { email, name, sub: googleId,email_verified } = payload;
        if (!email_verified) {
            return res.status(400).json({
                message: "Google email is not verified"
            });
        }
        let user = await User.findOne({ googleId });
        if (!user) {
            user = await User.findOne({ email });
            if (user) {
                user.googleId = googleId;
                user.authProvider = 'google';
                await user.save();
            } else {
                user = await User.create({
                    username: name,
                    email,
                    googleId,
                    authProvider: 'google'
                });
            }
           
        }
         const token = createToken({ username:user.username, _id: user._id,role:user.role })
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });
            res.redirect('https://final-deliverable1-ventech.vercel.app/dashboard');
    }
    catch (err) {
        next(err)
    }

}

export function facebookLogin(req, res) {
    const facebookAuthUrl =
        `https://www.facebook.com/v23.0/dialog/oauth` +
        `?client_id=${process.env.FACEBOOK_ID}` +
        `&redirect_uri=${encodeURIComponent(
            process.env.FACEBOOK_REDIRECT_URI
        )}` +
        `&scope=email,public_profile`;
    res.redirect(facebookAuthUrl);
}

export async function facebookCallback(req, res,next) {
    const { code } = req.query;
    console.log("Facebook callback code:", code);
    try {
        if (!code) {
            return res.status(400).json({ message: "Authorization code is missing" });
        }
        const tokenResponse = await fetch(
            `https://graph.facebook.com/v23.0/oauth/access_token` +
            `?client_id=${process.env.FACEBOOK_ID}` +
            `&redirect_uri=${encodeURIComponent(process.env.FACEBOOK_REDIRECT_URI)}` +
            `&client_secret=${process.env.FACEBOOK_SECRET}` +
            `&code=${code}`
        );
        const tokenData = await tokenResponse.json();
        if (!tokenData.access_token) {
            return res.status(400).json({
                message: "Facebook access token not received"
            });
        }
        const userResponse = await fetch(
            `https://graph.facebook.com/me?fields=id,name,email&access_token=${tokenData.access_token}`
        );
        const userData = await userResponse.json(); 
        const { id: facebookId, name, email } = userData;
        let user = await User.findOne({ facebookId });
        if (!user) {
            user = await User.findOne({ email });
            if (user) {
                user.facebookId = facebookId;
                user.authProvider = 'facebook';
                await user.save();
            } else {
                user = await User.create({
                    username: name,
                    email,
                    facebookId,
                    authProvider: 'facebook'
                });
            }
        }
        const token = createToken({ username:user.username, _id: user._id,role:user.role })
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });
        res.redirect('https://final-deliverable1-ventech.vercel.app/dashboard');    

    }
    catch (err) {
        next(err)
    }
}



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