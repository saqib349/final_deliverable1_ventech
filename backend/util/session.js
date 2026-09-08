import jwt from "jsonwebtoken"

process.loadEnvFile()
export function createToken(user){
    return jwt.sign(user,process.env.SECRETE_KEY)
}
export function verifyToken(token){
    return jwt.verify(token,process.env.SECRETE_KEY)
}

