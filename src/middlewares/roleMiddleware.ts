import { Request, Response, NextFunction, RequestHandler } from "express";
import authMiddleWare from "./authMiddleWare";

const checkRoles = (
  roles: Array<"admin" | "author" | "reader">
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction):Promise<void> => {
    const userRole = req.user?.role; // Assuming `req.user` is populated
    console.log("=====================",userRole)
    if (roles.includes(userRole)) {
       next();
       return
    } else {
       res.status(403).json({ message: "Forbidden" });
       return
    }
  };
};

export default checkRoles;
