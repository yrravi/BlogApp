import { Router } from "express";
import authMiddleWare from "../middlewares/authMiddleWare";
//import { isAuthenticated } from "../middlewares/authMiddleWare";
import { createPost, editPost, deletePost, getAllPosts, getPostsById, getallMyposts, searchPosts } from "../controllers/postController";
import checkRoles from "../middlewares/roleMiddleware";
const router = Router();

// Create a post
router.post("/createPost", authMiddleWare,checkRoles(["author"]), createPost);

// Edit a post
router.put("/editPost", authMiddleWare,checkRoles(["author"]), editPost);

// Delete a post
router.delete("/deletePost", authMiddleWare,checkRoles(["author"]), deletePost);

router.get("/getallPosts",getAllPosts)//Get all posts which are all "Published"

router.get("/getpostById/:id",getPostsById)

router.get("/myPosts",authMiddleWare,getallMyposts)//Get all posts which are all "Published/Drafted"

router.get("/search",searchPosts)

export default router;
