import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js'
import jwt from 'jsonwebtoken'



export const signup = async (req,res, next) =>{
    const {username, password, email} = req.body

    if (!username || !password || !email || username === '' || password === '' || email === '') {
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



export const signin = async(req,res,next) =>{
    // to signin, need: email, password
    const {email,password} = req.body
    // what if the password & email field were empty
    if (!email || !password || email === '' || password === ''){
        next(errorHandler(400,'Invalid credital, all fields are required!'))
    }
    // validate creditials
    try {
        const validUser = await User.findOne({email})
        if(!validUser){
           return next(errorHandler(400,"User not found"))
        }
        const validPwd = bcryptjs.compareSync(password,validUser.password)
        if (!validPwd){
           return next(errorHandler(400,'Invalid password'))
        }
        // creditals validated, issue access token
        const token = jwt.sign({id: validUser._id},process.env.JWT_SECRET)

        //hide hashed pwd, ...rest = rest of the data, ._doc = user document
        const {password: pass, ...rest} = validUser._doc

        res
            .status(200)
            .cookie('access_token',token,{httpOnly:true})
            .json(rest) // return only the rest w/o password, see validUser._doc

    } catch (error) {
        next(error)
    }
}

export const google = async(req,res,next) =>{
    const {email,name,googlePhotoUrl} = req.body
    try {
        const user = await User.findOne({email})
        if (user){
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
            const {password, ...rest} = user._doc
            res
                .status(200)
                .cookie('access_token',token,{httpOnly:true})
                .json(rest)
        } else {
            const randomPwd = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
            const hashedPwd = bcryptjs.hashSync(randomPwd,10)
            const newUser = new User({
                username:name.toLowerCase().split(' ').join('')+Math.random().toString(9).slice(-4),
                email,
                password:hashedPwd,
                profilePicture:googlePhotoUrl
            })
            await newUser.save()
            const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET)
            const {password, ... rest} = newUser._doc
            res
                .status(200)
                .cookie('access_token',token,{httpOnly:true})
                .json(rest)
        }
        
    } catch (error) {
        next(error)
    }
}