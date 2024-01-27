import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import userRoutes from './routes/user.route.js'
import authRoutes from './routes/auth.route.js'


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
app.use((err,req,res,next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal Server Error'
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})


// ------------------------------ ROUTES + CONTROLLERS -----------------------------
app.use('/api/user',userRoutes)
app.use('/api/auth',authRoutes)