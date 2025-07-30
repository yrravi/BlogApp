import { DataTypes, Model, Sequelize } from "sequelize";
import bcrypt from "bcryptjs";
import sequelize from "../config/database";


export interface UserAttributes {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  googleId?: string;
  bio?: string;
  role?: "admin" | "author" | "reader";
  profilePicture?: string;
}

export class User extends Model<UserAttributes> implements UserAttributes {

  public id!: string;
  public name!: string;
  public email?: string;
  public password?: string;
  public googleId?: string;
  public bio?: string;
  public role?: "admin" | "author" | "reader";
  public profilePicture?: string;

  public comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password || "");
  }
}



User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    googleId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    bio: {
      type: DataTypes.STRING, 
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM("admin", "author", "reader"), 
      defaultValue: "reader", 
    },
    profilePicture: {
      type: DataTypes.STRING, 
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "users",
  }
);

// Hash password before saving
User.beforeCreate(async (user) => {
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

export default User;



