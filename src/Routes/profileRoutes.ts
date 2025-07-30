import { Router } from "express";
import {deleteProfile, getProfile,updateProfile } from "../controllers/profileController";
import authMiddleWare from "../middlewares/authMiddleWare";
import checkRoles  from "../middlewares/roleMiddleware"

const router = Router();

// View profile (public access)
router.get("/:id",authMiddleWare,checkRoles(["admin"]),getProfile);

// Edit profile (protected route)
router.put("/update", authMiddleWare, updateProfile);

router.delete("/delete/:id",authMiddleWare,checkRoles(["admin"]),deleteProfile)

export default router;
