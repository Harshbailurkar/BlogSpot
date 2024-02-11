import express from "express";
import storage from "../controllers/multer.controller.js";
import {
  handleAddBlog,
  handleAddComment,
  handleDeleteBlog,
  handleDeleteComment,
  handleGetBlog,
} from "../controllers/blog.controller.js";
import multer from "multer";

const router = express.Router();

const upload = multer({ storage: storage });

router.get("/addBlog", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

router.post("/", upload.single("coverImage"), handleAddBlog);

router.get("/:id", handleGetBlog);

router.post("/comment/:id", handleAddComment);

router.get("/deleteblog/:id", handleDeleteBlog);

router.post("/:blogId/comment/:commentId", handleDeleteComment);

export default router;
