import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import User from "../models/userModel";


console.log("In COntroller")
const generateToken = (user: any): string => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET || "", {
    expiresIn: "1h",
  });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, googleId, bio, role, profilePicture } = req.body;
    const user = await User.create({ name, email, password, googleId, bio, role, profilePicture });
    res.status(201).json({ message: "User registered successfully", user });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("local", { session: false }, (err: any, user: any, info: { message: any; }) => {
    if (err || !user) {
      return res.status(400).json({ message: info?.message || "Login failed" });
    }
    const token = generateToken(user);
    res.json({ token });
  })(req, res, next);
};

export const googleAuthCallback = (req: Request, res: Response) => {
  const token = generateToken(req.user as any);
  res.json({ message: "Successfully logged-in", token });
};
