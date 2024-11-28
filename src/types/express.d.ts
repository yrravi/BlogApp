import { UserAttributes } from "../models/userModel";

declare global {
  namespace Express {
      interface User extends UserAttributes {} 
  }
}
