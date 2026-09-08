import User from "../models/User.model.js";


export async function getUsers(req,res){
    try{
        const users=await User.find({})
        res.json({
            data:users
        })
    }
    catch(err){
        res.status(500).json({
            message:err.message
        })
    }
    
}