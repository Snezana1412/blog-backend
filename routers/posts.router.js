import express from "express";
import { getAllPosts } from "../controllers/posts.controller.js";
import { protect } from "../middlewares/auth.js";
const router = express.Router();


// list posts
router.route('/').get( protect, getAllPosts);


export default router;