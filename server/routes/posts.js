import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts); // this is going to grab the user feed/posts
router.get("/:userId/posts", verifyToken, getUserPosts); // only a certain user's posts

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost); // to like/unlike a post

export default router;