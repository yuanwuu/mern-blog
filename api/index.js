import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import userRoutes from './routes/user.route.js'
import authRoutes from './routes/auth.route.js'
// import signIn from './routes/auth.route.js'


const PORT = process.env.PORT || 3001
mongoose
.connect(process.env.MONGODB_URI)
.then(
    console.log('connected to MongoDB via Mongoose')
    )
.catch((error)=>
    console.log(error)
)
    

const app = express()
app.use(express.json())


app.use('/api/user',userRoutes)
app.use('/api/auth',authRoutes)
// app.use('/api/signin',signIn)


app.listen(PORT, ()=>{
    console.log('Port:',PORT)
})