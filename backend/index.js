import express from 'express'
import connectDB from './config/database.js'
import todoRouter from './routes/todos.router.js'
import cors from 'cors'
import authRouter from './routes/auth.router.js'
import { authMiddleware, authorizationMiddleWare } from './middlewares/auth.middleware.js'
import cookieParser from 'cookie-parser'
import userRouter from './routes/user.router.js'


const app = express()
app.use(cors({
    origin:process.env.FRONTEND_UR|| "http://localhost:4200",
     credentials: true
}));
app.use(express.json())
app.use(cookieParser())

app.get("/auth/me",authMiddleware,(req,res)=>{
        res.json({
            data:req.user
        })
})

app.use("/todo",authMiddleware,todoRouter)
app.use("/user",authRouter)
app.use("/admin/user",authMiddleware,authorizationMiddleWare,userRouter)
// app.use('/user',authRouter)
// app.get('/login',(req,res)=>{
//     res.render("login")
// })  


const serverStarted= async ()=>{
    await connectDB()
    app.listen(process.env.PORT,()=>{
        console.log(`server started at ${process.env.PORT}`)
    })
}

serverStarted();


