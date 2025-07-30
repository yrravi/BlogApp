import { Router } from "express";
import passport from "passport";
import { register, login, googleAuthCallback } from "../controllers/authController";

const router = Router();
console.log("In ROutes")

router.post("/register", register);
router.post("/login", login);


//Google auth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleAuthCallback
);

export default router;
