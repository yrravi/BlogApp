import { Request, Response } from "express";
import markdownIt from "markdown-it";
import { Op } from "sequelize"
import Post from "../models/postModel";


// Markdown parser
const md = new markdownIt();

// Create a new post
export const createPost = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id; // Authenticated user ID
        const { title, content } = req.body;

        if (!title || !content) {
            res.status(400).json({ error: "Title and content are required" });
            return;
        }


        const post = await Post.create({ title, content, htmlContent: md.render(content), userId, state: "draft", viewCount: 0 });

        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ error: "Failed to create post" });
    }
};

// Edit a post
export const editPost = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { postID, title, content, state } = req.body;

        const post = await Post.findByPk(postID);
        // console.log("EDITPSOT",userId)

        if (!post || post.userId !== userId) {
            res.status(403).json({ error: "Unauthorized or post not found" });
            return;
        }

        post.title = title || post.title;
        post.content = content || post.content;
        post.htmlContent = content ? md.render(content) : post.htmlContent;
        post.state = state || post.state;

        await post.save();

        res.json({ message: "Post got edited", post });
    } catch (err) {
        res.status(500).json({ error: "Failed to update post" });
    }
};

// Delete a post
export const deletePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { postId } = req.body;

        const post = await Post.findByPk(postId);

        if (!post || post.userId !== userId) {
            res.status(403).json({ error: "Unauthorized or post not found" });
            return;
        }

        await post.destroy();

        res.status(200).json({ message: "Post deleted successfully", post });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete post" });
    }
};

//Get all posts
export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
    try {
        // Extract pagination query parameters
        const page = parseInt(req.query.page as string) || 1; // Default to page 1
        const limit = parseInt(req.query.limit as string) || 10; // Default to 10 posts per page
        const offset = (page - 1) * limit; // Calculate the offset

        // Query for posts with state "published"
        const { rows: posts, count: totalPosts } = await Post.findAndCountAll({
            where: { state: "published" },
            attributes: ["id", "title", "htmlContent", "createdAt", "updatedAt"],
            order: [["createdAt", "DESC"]], // Sort by creation date, newest first
            limit, // Number of records per page
            offset, // Start index
        });
        res.status(200).json({
            totalPosts,
            totalPages: Math.ceil(totalPosts / limit),
            currentPage: page,
            posts,
        });

    } catch (err) {
        res.status(500).json({ error: "Failed to fetch published posts" });

    }
}

//Get Posts by :id
export const getPostsById = async (req: Request, res: Response): Promise<void> => {
    try {
        const postID = req.params.id;
        const post = await Post.findByPk(postID, {
            attributes: ["id", "title", "content", "state", "viewCount"],
            order: [["createdAt", "DESC"]]
        });

        if (!post) {
            res.status(404).json({ error: "Post not found" });
            return;
        }
        post.viewCount += 1;
        await post.save()
        res.status(200).json(post)

    } catch (err) {
        res.status(500).json({ error: "Failed to fetch Posts" });
    }
}

//GET all posts(including "pusblished"/ "draft") of particular user
export const getallMyposts = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized access" });
            return;
        }
        const page = parseInt(req.query.page as string) || 1; // Default to page 1
        const limit = parseInt(req.query.limit as string) || 10; // Default to 10 posts per page
        const offset = (page - 1) * limit; // Calculate the offset

        // Query for posts with state "published"
        const { rows: posts, count: totalPosts } = await Post.findAndCountAll({
            where: { userId },
            attributes: ["id", "title", "htmlContent", "state", "createdAt", "updatedAt"],
            order: [["createdAt", "DESC"]], // Sort by creation date, newest first
            limit, // Number of records per page
            offset, // Start index
        });
        res.status(200).json({
            totalPosts,
            totalPages: Math.ceil(totalPosts / limit),
            currentPage: page,
            posts,
        });

    } catch (err) {
        res.status(500).json({ err: "Failed fetch the posts" })

    }
}

//Search API
export const searchPosts = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, state } = req.query;

        // Build the search condition
        const whereCondition: any = {};

        if (title) {
            whereCondition.title = { [Op.iLike]: `%${title}%` }; // Case-insensitive search
        }

        if (state) {
            whereCondition.state = state; // Exact match for state ("draft" or "published")
        }

        const posts = await Post.findAll({
            where: whereCondition,
        });

        res.json({ message: "Search results", posts });
    } catch (error) {
        console.error("Error searching posts:", error);
        res.status(500).json({ error: "Failed to search posts" });
    }
}