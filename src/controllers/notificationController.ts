import { Request, Response } from "express";
import Notification from "../models/notificationModel";


// Fetch all notifications for the logged-in user
export const getNotifications = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;

        const notifications = await Notification.findAll({
            where: { userId },
            order: [["createdAt", "DESC"]],
        });

        res.json({ notifications });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch notifications" });
    }
};

// Mark a notification as read
export const markNotificationAsRead = async (req: Request, res: Response): Promise<void> => {
    try {
        const { notificationId } = req.params;

        const notification = await Notification.findByPk(notificationId);

        if (!notification) {
            res.status(404).json({ error: "Notification not found" });
            return
        }

        notification.isRead = true;
        await notification.save();

        res.json({ message: "Notification marked as read" });
    } catch (error) {
        res.status(500).json({ error: "Failed to mark notification as read" });
    }
};



//Delete notification
export const deleteNotification = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const notification = await Notification.findOne({ where: { id } });

        if (!id) {
            res.status(404).json({ error: "Notification not found" });
            return;
        }
        await notification.destroy()

        res.json({ message: "Notification Deleted", notification })
    } catch (err) {
        res.status(500).json({ error: "Failed to mark notification as read" });
    }
}