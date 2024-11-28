import express from "express";
import {
    deleteNotification,
    getNotifications,
    markNotificationAsRead,
} from "../controllers/notificationController";
import authMiddleware from "../middlewares/authMiddleWare";

const router = express.Router();

router.get("/get", authMiddleware, getNotifications);
router.patch("/read/:notificationId", authMiddleware, markNotificationAsRead);
router.delete("/delete/:id",authMiddleware,deleteNotification)

export default router;
