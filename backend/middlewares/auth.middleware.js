
import {  verifyToken } from "../util/session.js";


export function authMiddleware(req, res, next) {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Token is not found"
        });
    }

    const decode = verifyToken(token);

    if (!decode) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    req.user = decode;

    console.log(req.user);

    next();
}

export function authorizationMiddleWare(req,res,next){
    if (req.user.role!=="admin"){
        return res.status(403).json({
            message:"authorization required"
        })
    }
    next()
}