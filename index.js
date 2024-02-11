import express from "express";
import path from "path";
import UserRoute from "./routes/user.routes.js";
import connectToMongoDB from "./connect.js";
import cookieParser from "cookie-parser";
import checkForAuthenticationCookie from "./middleware/auth.js";
import BlogRoute from "./routes/blog.routes.js";
import Blogs from "./models/blog.models.js";

const app = express();
const PORT = process.env.PORT || 3000;

connectToMongoDB("mongodb://127.0.0.1:27017/blogspot").then(
  console.log("mongoDB connected")
);

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  try {
    const allBlogs = await Blogs.find({}).populate("createdBy");
    res.render("home", {
      user: req.user,
      blogs: allBlogs,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.use("/user", UserRoute);
app.use("/blog", BlogRoute);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
