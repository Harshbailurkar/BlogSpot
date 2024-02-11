import express from "express";
import Users from "../models/user.models.js";
import {
  handleAddUser,
  handleLoginUser,
  handleUserSetting,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/login", (req, res) => {
  res.render("login");
});
router.get("/signup", (req, res) => {
  res.render("signup");
});
router.post("/signup", handleAddUser);

router.post("/login", handleLoginUser);

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

router.post("/setting", handleUserSetting);

export default router;
