import Users from "../models/user.models.js";
import Blogs from "../models/blog.models.js";
import comments from "../models/comments.models.js";

async function handleAddUser(req, res) {
  try {
    let { fullName, email, password } = req.body;
    fullName = fullName.replace(/ /g, "_").trim();
    await Users.create({ fullName, email, password });
    return res.redirect("login");
  } catch (err) {
    const msg = "Credentials Already Exits! Name and Email should be unique.";
    res.render("signup", {
      error: msg,
    });
  }
}

async function handleLoginUser(req, res) {
  try {
    const { email, password } = req.body;
    const Token = await Users.matchPasswordAndGenerateToken(email, password);
    return res.cookie("token", Token).redirect("/");
  } catch (err) {
    res.render("login", {
      error: err,
    });
  }
}

async function handleUserSetting(req, res) {
  const { changeName, changeEmail, changePassword } = req.body;
  const updateFields = {};
  if (changeName) updateFields.fullName = changeName.replace(/ /g, "_").trim();
  if (changeEmail) updateFields.email = changeEmail;
  if (changePassword) updateFields.password = changePassword;
  if (Object.keys(updateFields).length === 0) {
    return res.redirect("setting");
  }
  await Users.findByIdAndUpdate(req.user._id, updateFields);
  return res.redirect("login");
}

async function handleDeleteUser(req, res) {
  try {
    await Users.deleteOne({ _id: req.user._id });
    await Blogs.deleteMany({ createdBy: req.user._id });
    await comments.deleteMany({ createdBy: req.user._id });
    res.clearCookie("token");
    return res.redirect("/");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export { handleAddUser, handleLoginUser, handleUserSetting, handleDeleteUser };
