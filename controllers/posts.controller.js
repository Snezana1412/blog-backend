import Post from "../models/posts.model.js"


// get all posts
export const getAllPosts = async(req, res, next) => {
    try {
        const posts = await Post.find();
        res.json({
            status: 'success',
            posts
        });
        
    } catch (error) {
        next(error)
    }
}