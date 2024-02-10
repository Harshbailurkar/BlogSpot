import express from "express";
import Users from "../models/user.models.js";

const router = express.Router();

router.get("/login", (req, res) => {
  res.render("login");
});
router.get("/signup", (req, res) => {
  res.render("signup");
});
router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  await Users.create({ fullName, email, password });
  return res.redirect("/");
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const Token = await Users.matchPasswordAndGenerateToken(email, password);
    return res.cookie("token", Token).redirect("/");
  } catch (err) {
    res.render("login", {
      error: err,
    });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

router.get("/setting", async (req, res) => {
  const user = await Users.findById(req.user._id);

  res.render("setting", {
    user: req.user,
    loggedInUser: user,
  });
});
router.post("/setting", async (req, res) => {
  const { changeName, changeEmail, changePassword } = req.body;
  const updateFields = {};
  if (changeName) updateFields.fullName = changeName;
  if (changeEmail) updateFields.email = changeEmail;
  if (changePassword) updateFields.password = changePassword;
  if (Object.keys(updateFields).length === 0) {
    return res.redirect("setting");
  }
  await Users.findByIdAndUpdate(req.user._id, updateFields);
  return res.redirect("login");
});

export default router;
