import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import passport from "./config/passport";
import sequelize from "./config/database";
import authRoutes from "./Routes/authRoutes";
import profileRoutes from "./Routes/profileRoutes"
import postRoutes from "./Routes/postRoutes"
import commentRoutes from "./Routes/commentRoutes"
import notificationRoute from "./Routes/notificationRoutes"

dotenv.config();

const app = express();


app.use(
  session({
    secret: "my-session-secret",
    resave: false,
    saveUninitialized: false,
  })
);


app.use(passport.session());
app.use(bodyParser.json());
app.use(passport.initialize());


app.use("/auth", authRoutes);
app.use("/profile", profileRoutes)
app.use("/posts", postRoutes)
app.use("/comment", commentRoutes)
app.use("/notification", notificationRoute)

sequelize.sync({ alter: true }).then(() => {
  app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
});
