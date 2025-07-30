import { Request, Response } from "express";
import User from "../models/userModel";
//import user from "../middlewares/authMiddleWare"

// View profile
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id; // Profile ID from URL
    const user = await User.findOne({ where: { id }, attributes: ["id", "name", "role", "bio"] });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
};

// Edit profile
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id; // Current user's ID (from auth middleware)
    const { name, bio, profilePicture } = req.body;
    const user = await User.findByPk(userId);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    user.name = name || user.name;
    user.bio = bio || user.bio;
    user.profilePicture = profilePicture || user.profilePicture;

    await user.save();

    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile" });
  }
};

// Delete profile
export const deleteProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;

    const user = await User.findOne({ where: { id } });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    await user.destroy(); // Delete the user record

    res.json({ message: "Profile deleted successfully", user });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete profile" });
  }
};
