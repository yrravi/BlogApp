import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import User from "./userModel";

export interface NotificationAttributes {
    id?: string;
    type: "comment"; // Type of notification
    message: string; // Notification content
    userId: string; // User receiving the notification
    isRead: boolean; // Whether the notification has been read
    createdAt?: Date; // Automatically managed by Sequelize
    updatedAt?: Date; // Automatically managed by Sequelize
}

export class Notification extends Model<NotificationAttributes> implements NotificationAttributes {
    public id!: string;
    public type!: "comment";
    public message!: string;
    public userId!: string;
    public isRead!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Notification.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        type: {
            type: DataTypes.ENUM("comment"),
            allowNull: false,
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
        },
        isRead: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        sequelize,
        tableName: "notifications",
    }
);

// Define association
User.hasMany(Notification, { foreignKey: "userId", onDelete: "CASCADE" });
Notification.belongsTo(User, { foreignKey: "userId" });

export default Notification;
