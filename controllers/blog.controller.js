import fs from "fs";
import path from "path";
import Blogs from "../models/blog.models.js";
import comments from "../models/comments.models.js";
import cloudinary from "cloudinary";
import dotenv from "dotenv";
import { marked } from "marked";

dotenv.config({
  path: "./.env",
});

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function handleAddBlog(req, res) {
  const { title, body, description } = req.body;

  let coverImageURL = "";
  if (req.file) {
    try {
      // Upload the file to Cloudinary
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "blogs", // Optional: to organize uploads in a specific folder
        public_id: `${req.file.filename}-${Date.now()}`, // Unique name for the uploaded file
        resource_type: "image", // Specify the type of file being uploaded
      });
      coverImageURL = result.secure_url;

      // Delete the file from the server after successful upload
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error("Error deleting file from server:", err);
        }
      });
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      return res.status(500).json({ message: "Error uploading image" });
    }
  }
  const convertedBody = marked(body);
  try {
    const blog = await Blogs.create({
      title,
      description,
      body: convertedBody,
      createdBy: req.user._id,
      coverImageURL,
    });
    return res.redirect(`/blog/${blog._id}`);
  } catch (error) {
    console.error("Error creating blog:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function handleGetBlog(req, res) {
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
}

async function handleAddComment(req, res) {
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
}

async function handleDeleteBlog(req, res) {
  try {
    await Blogs.deleteOne({ _id: req.params.id });
    return res.redirect("/");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function handleDeleteComment(req, res) {
  try {
    await comments.deleteOne({ _id: req.params.commentId });
    return res.redirect(`/blog/${req.params.blogId}`);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
export {
  handleAddBlog,
  handleGetBlog,
  handleAddComment,
  handleDeleteBlog,
  handleDeleteComment,
};
