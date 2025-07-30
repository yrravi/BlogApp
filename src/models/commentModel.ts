import { DataTypes, Model, Sequelize } from "sequelize";
import sequelize from "../config/database";
import User from "./userModel";
import Post from "./postModel";

export interface CommentAttributes {
  id?: string;
  content: string; // Content of the comment
  userId: string; // Foreign key to User
  postId: string; // Foreign key to Post
  createdAt?: Date; // Automatically handled by Sequelize
  updatedAt?: Date; // Automatically handled by Sequelize
}

export class Comment extends Model<CommentAttributes> implements CommentAttributes {
  static initModel(sequelize: Sequelize) {
      throw new Error("Method not implemented.");
  }
  public id!: string;
  public content!: string;
  public userId!: string;
  public postId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Comment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
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
    postId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Post,
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "comments",
  }
);

// Define associations
// User.hasMany(Comment, { foreignKey: "userId", onDelete: "CASCADE" });
// Comment.belongsTo(User, { foreignKey: "userId" });

// Post.hasMany(Comment, { foreignKey: "postId", onDelete: "CASCADE" });
// Comment.belongsTo(Post, { foreignKey: "postId" });

export default Comment;
