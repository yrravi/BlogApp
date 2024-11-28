import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";

export default async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
     res.status(401).json({ error: "No token provided" });
     return
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as { id:string}
    const user:any = await User.findByPk(decoded.id);
    //console.log("idvuirehvcnje",user)

    if (!user) {
       res.status(401).json({ error: "Invalid token" });
       return
    }

    req.user = {id : user.id,role:user.role} ;// Attach user ID to request object
    //console.log("LOGS", req.user)
    next();
  } catch (err) {
    res.status(401).json({ error: "Failed to authenticate token" });
  }
};


// export const isAuthenticated = (req:Request,res:Response,next:NextFunction): void =>{
//   if(req.user){
//     next();
//   }else{
//     res.status(401).json({error:"Unauthorized access...."})
//   }
// }
