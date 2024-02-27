import { errorHandler } from "../utils/error.js"
import Comment from '../models/comment.model.js'

export const createComment = async(req,res,next) =>{
    try {
        const {content,postId, userId} = req.body

        if(userId !== req.user.id){
            return next(errorHandler(403,'comment not allowed.'))
        }

        const newComment = new Comment({
            content,
            postId,
            userId
        })
        await newComment.save()
        res.status(200).json(newComment)
    } catch (error) {
        next(error)
    }
}

// export default createComment

export const getPostComments = async(req,res,next) =>{
    try {
       const comments = await Comment.find({postId:req.params.postId}).sort({createdAt: -1}) 
       
       res.status(200).json(comments)
    } catch (error) {
        next(error)
    }
}

export const likeComment = async(req,res,next)=>{
    try {
        //chk if comment exists in the array, it may not exist
        const comment = await Comment.findById(req.params.commentId)
        if(!comment){
            return next(errorHandler(404, 'comment not found'))
        }
        //chk if user exists in the LIKE array, it may not
        const userIndex = comment.likes.indexOf(req.user.id)
        if(userIndex === -1) {// user has index loc in the arr, if not there, it'll be -1
            comment.numberOfLikes += 1
            comment.likes.push(req.user.id)
        } else {
            comment.numberOfLikes -= 1
            comment.likes.splice(userIndex, 1)
        }
        await comment.save() // if not saved, when refresh the commment.likes array will not show updated data 
        res.status(200).json(comment)
    } catch (error) {
        next(error)
    }
}