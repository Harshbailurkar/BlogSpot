import jwt from "jsonwebtoken";

const secret = "ajdnjbjwdu#242jnaj23%^#%$638";

function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    name: user.fullName,
    email: user.email,
    profileImageURL: user.profileImageURL,
    role: user.role,
  };
  const Token = jwt.sign(payload, secret, { expiresIn: "1d" });
  return Token;
}

function verifyToken(token) {
  const payload = jwt.verify(token, secret);
  return payload;
}

export { createTokenForUser, verifyToken };
