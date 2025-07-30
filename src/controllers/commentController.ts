import { Request, Response } from "express";
import Comment from "../models/commentModel";
import Post from "../models/postModel";
import Notification from "../models/notificationModel";

// Add a comment to a post
export const addComment = async (req: Request, res: Response): Promise<void> => {
  const { content, postId } = req.body;
  const userId = req.user?.id; // Assuming `req.user` contains the logged-in user details

  try {
    // Ensure the post exists
    const post = await Post.findByPk(postId);
    if (!post) {
      res.status(404).json({ success: false, message: "Post not found" });
      return;
    }

    // Create a new comment
    const comment = await Comment.create({
      content,
      postId,
      userId,
    });

    //NOTIFICATION TRIGGER FUNCTION
    if (post && post.userId !== req.user?.id) {

      await Notification.create({
        type: "comment",
        message: `New comment on your post: "${post.title}"`,
        userId: post.userId,
      });
    }

    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ success: false, message: "Failed to add comment" });
  }
};

// Edit a comment
export const editComment = async (req: Request, res: Response): Promise<void> => {
  const { commentId } = req.params;
  const { content } = req.body;
  const userId = req.user?.id; // Assuming `req.user` contains the logged-in user details

  try {
    // Find the comment
    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      res.status(404).json({ success: false, message: "Comment not found" });
      return
    }

    // Ensure the comment belongs to the logged-in user
    if (comment.userId !== userId) {
      res.status(403).json({ success: false, message: "You cannot edit this comment" });
      return
    }

    // Update the comment
    comment.content = content;
    await comment.save();

    res.status(200).json({ success: true, data: comment });
  } catch (error) {
    console.error("Error editing comment:", error);
    res.status(500).json({ success: false, message: "Failed to edit comment" });
  }
};

// Delete a comment
export const deleteComment = async (req: Request, res: Response): Promise<void> => {
  const { commentId } = req.params;
  const userId = req.user?.id; // Assuming `req.user` contains the logged-in user details

  try {
    // Find the comment
    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      res.status(404).json({ success: false, message: "Comment not found" });
      return
    }

    // Ensure the comment belongs to the logged-in user
    if (comment.userId !== userId) {
      res.status(403).json({ success: false, message: "You cannot delete this comment" });
      return
    }

    // Delete the comment
    await comment.destroy();

    res.status(200).json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ success: false, message: "Failed to delete comment" });
  }
};


