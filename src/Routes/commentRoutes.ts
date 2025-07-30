import express from "express";
import { addComment, editComment, deleteComment } from "../controllers/commentController";
import  authMiddleWare  from "../middlewares/authMiddleWare"; // Middleware to ensure the user is logged in
import checkRoles from "../middlewares/roleMiddleware";
const router = express.Router();

// Add a comment
router.post("/add", authMiddleWare, addComment);

// Edit a comment
router.put("/:commentId", authMiddleWare,editComment);

// Delete a comment
router.delete("/:commentId", authMiddleWare,deleteComment);

export default router;
