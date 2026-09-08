import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
export function createToken(user){
    return jwt.sign(user,process.env.SECRETE_KEY)
}
export function verifyToken(token){
    return jwt.verify(token,process.env.SECRETE_KEY)
}

