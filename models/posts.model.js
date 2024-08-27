import { Schema, model } from "mongoose";

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    post_at: {
        type: Date,
        default: Date.now()
    }
});


const Post = model('Post', postSchema);
export default Post;