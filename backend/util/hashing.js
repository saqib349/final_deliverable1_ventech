import bcrytp from "bcrypt"
export const hashigPassword=async (password)=>{
        return await bcrytp.hash(password,10)
}

export const comparePasswords =async (plainPassword, hashpassword) =>{
    return await bcrytp.compare(plainPassword,hashpassword)
}