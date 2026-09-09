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
export async function deleteUser(req,res){
    try{
        const _id=req.params.id
        const user =await  User.findByIdAndDelete(_id)
        if (!user){
            res.status(404).json({
                message:"user not found"
            })
        }
        res.json({
            data:user
        })
    }   
    catch(err){
        res.status(400).json({
            message:err.message
        })
    }

}

export async function updateUser(req,res){
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
            res.status(404).json({
                message:"user not found"
            })
        }
        res.json({
            data:user
        })
    }   
    catch(err){
        res.status(400).json({
            message:err.message
        })
    }

}

