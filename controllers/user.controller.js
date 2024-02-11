import Users from "../models/user.models.js";

async function handleAddUser(req, res) {
  const { fullName, email, password } = req.body;
  await Users.create({ fullName, email, password });
  return res.redirect("/");
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
  if (changeName) updateFields.fullName = changeName;
  if (changeEmail) updateFields.email = changeEmail;
  if (changePassword) updateFields.password = changePassword;
  if (Object.keys(updateFields).length === 0) {
    return res.redirect("setting");
  }
  await Users.findByIdAndUpdate(req.user._id, updateFields);
  return res.redirect("login");
}
export { handleAddUser, handleLoginUser, handleUserSetting };
