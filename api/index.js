import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import userRoutes from './routes/user.route.js'
import authRoutes from './routes/auth.route.js'
import postRoutes from './routes/post.route.js'
import commentRoutes from './routes/comment.route.js'
import cookieParser from 'cookie-parser'
import path from 'path'

const __dirname = path.resolve()

const app = express()
const PORT = process.env.PORT || 3001
const dbConn = async() =>{
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        app.listen(PORT,()=>{
            console.log(`connected to MongoDB via Mongoose, PORT:${PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
}

dbConn()


// ------------------------------ MIDDLEWARE -----------------------------
app.use(express.json())

app.use(cookieParser()) // extract cookie from browser


// ------------------------------ ROUTES -----------------------------
app.use('/api/user',userRoutes)
app.use('/api/auth',authRoutes)
app.use('/api/post',postRoutes)
app.use('/api/comment',commentRoutes)

app.use(express.static(path.join(__dirname,'/client/dist')))
app.get('*',(req,res) =>{
    res.sendFile(path.join(__dirname,'client','dist','index.html'))
})

app.use((err,req,res,next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal Server Error'
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})