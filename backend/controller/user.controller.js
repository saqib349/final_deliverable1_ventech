import User from "../models/User.model.js";
import { hashigPassword } from "../util/hashing.js";


export async function getUsers(req,res,next){
    try{
        const users=await User.find({})
        return res.json({
            data:users
        })
    }
    catch(err){
        next(err)
    }
    
}

export async function getUserById(req,res,next){
    try{
        const _id=req.params.id
        const user=await User.findById(_id)
        if (!user){
            return res.status(404).json({
                message:"user not found"
            })
        }
        return res.json({
            data:user
        })
    }
    catch(err){
        next(err)
    }


}
export async function deleteUser(req,res,next){
    try{
        const _id=req.params.id
        const user =await  User.findByIdAndDelete(_id)
        if (!user){
            return res.status(404).json({
                message:"user not found"
            })
        }
        return res.json({
            data:user
        })
    }   
    catch(err){
        next(err)
    }

}

export async function updateUser(req,res,next){
    try{
        const _id=req.params.id
        const {username,email,role}=req.body 
        const user =await  User.findByIdAndUpdate(_id,{
            username,
            email,
            role
        },
        {returnDocument:"after"}
    )
        if (!user){
            return res.status(404).json({
                message:"user not found"
            })
        }
       return  res.json({
            data:user
        })
    }   
    catch(err){
        next(err)
    }

}

export async function addUser(req,res,next){
    try{
        const {username,email,password,role}=req.body
        const hashedPassword=await hashigPassword(password)
        const user =await  User.create({
            username,
            email,
            password:hashedPassword,
            role
        })
        return res.status(201).json({
            data:user
        })
    }   
    catch(err){
        next(err)
    }

}

