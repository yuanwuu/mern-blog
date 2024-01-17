import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'


mongoose
.connect(process.env.MONGODB_URI)
.then(
    console.log('connected to MongoDB via Mongoose')
    )
.catch((error)=>
    console.log(error)
)
    
const PORT = process.env.PORT || 3001
const app = express()



app.listen(PORT, ()=>{
    console.log('Port:',PORT)
})