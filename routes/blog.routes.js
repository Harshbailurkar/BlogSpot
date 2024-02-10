import express from "express";
import Blogs from "../models/blog.models.js";
import multer from "multer";
import path from "path";
import comments from "../models/comments.models.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const FileName = Date.now() + "-" + file.originalname;
    cb(null, FileName);
  },
});

const upload = multer({ storage: storage });

router.get("/addBlog", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

router.post("/", upload.single("coverImage"), async (req, res) => {
  const { title, body, description } = req.body;
  // console.log(req.body);
  // console.log(req.user);
  let coverImageURL = "";
  if (req.file) {
    const file = req.file.filename;
    console.log(file);
    coverImageURL = `/uploads/${req.file.filename}`;
  }

  const blog = await Blogs.create({
    title,
    description,
    body,
    authorName: req.user.name,
    createdBy: req.user._id,
    coverImageURL,
  });

  return res.redirect(`/blog/${blog._id}`);
});

router.get("/:id", async (req, res) => {
  try {
    const blog = await Blogs.findById(req.params.id).populate("createdBy");
    const Comments = await comments
      .find({ blogId: req.params.id })
      .populate("createdBy");

    return res.render("blog", {
      blog,
      user: req.user,
      Comments,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/comment/:id", async (req, res) => {
  try {
    const comment = await comments.create({
      content: req.body.content,
      blogId: req.params.id, // Using req.params.id for the comment's _id
      createdBy: req.user._id,
    });
    return res.redirect(`/blog/${req.params.id}`);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/deleteblog/:id", async (req, res) => {
  await Blogs.deleteOne({ _id: req.params.id });

  return res.redirect("/");
});
export default router;
