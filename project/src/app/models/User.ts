type User = {
    username:string,
    email:string,
    password:string,
    role:string
    
}

type Admin_users = {
    _id:string,
    username:string,
    email:string,
    password:string,
    role:string
}

interface loginResponse {
    message: string,
    userId: string
}