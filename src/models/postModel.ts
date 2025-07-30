import { DataTypes, Model, Sequelize } from "sequelize";
import sequelize from "../config/database";
import Comment from "./commentModel";

export interface PostAttributes {
  id?: string;
  title: string;
  content: string; // Markdown content
  htmlContent?: string; // Rendered HTML
  userId: string; // Foreign key to User
  viewCount:number
  state: "draft" | "published";
  imageUrl?: string;
}

export class Post extends Model<PostAttributes> implements PostAttributes {
  static initModel(sequelize: Sequelize) {
      throw new Error("Method not implemented.");
  }
  public id!: string;
  public title!: string;
  public content!: string;
  public htmlContent?: string;
  public userId!: string;
  public viewCount!:number
  public state!: "draft" | "published";
  public imageUrl?: string;
}

Post.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    htmlContent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    state: {
      type: DataTypes.ENUM("draft", "published"),
      defaultValue: "draft",
    },
    viewCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0, // Default to 0
      },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "posts",
  }
);

// Define associations
//Post.hasMany(Comment, { foreignKey: "postId", onDelete: "CASCADE" });

export default Post;
