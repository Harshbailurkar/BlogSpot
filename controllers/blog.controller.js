import express from "express";
import Blogs from "../models/blog.models.js";
import comments from "../models/comments.models.js";

async function handleAddBlog(req, res) {
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
    createdBy: req.user._id,
    coverImageURL,
  });
  return res.redirect(`/blog/${blog._id}`);
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
