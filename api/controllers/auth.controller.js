import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js'

const signup = async (req,res, next) =>{
    const {username, password, email} = req.body

    if (!username || !password || !email || username === '' || password === '' || email === '') {
        // return res.status(400).json({message: 'all fields are required!'})
        next(errorHandler(400,'All fields are required')) // handling error via errorHandler function
    }

    const hasedPwd = bcryptjs.hashSync(password,10)

    const newUser = new User({
        username,
        password: hasedPwd,
        email})

    try {
        await newUser.save()
    res.json('signup successful')
    } catch (error) {
        // res.status(500).json({message:error.message}) <-- catching error w/o middleware
        next(error) // utilized the middleware created in index.js
    }

}

// export const signin = async(req,res) =>{
//     if(username === username){
//         res.json({message:'hello user'})
//     }
// }

export default signup