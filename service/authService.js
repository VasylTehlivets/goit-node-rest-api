const { User } = require("./schemas/user");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fsp = require("fs/promises");

const secret = process.env.SECRET;
const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const getUser = async ({ email }) => {
  return User.findOne({ email });
};

const addUser = async ({ email, password }) => {
  const avatarURL = gravatar.url(email);
  const newUser = new User({ email, password });
  const { subscription } = newUser;
  newUser.setPassword(password);
  await newUser.save();
  return { email, subscription, avatarURL };
};

const addToken = async ({ user }) => {
  const payload = { id: user.id, email: user.email };
  const token = jwt.sign(payload, secret, { expiresIn: "1h" });
  await User.findByIdAndUpdate(user.id, { token });
  return token;
};

const getUserById = (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return null;
  }
  return User.findOne({ _id: userId });
};

const removeToken = async (userId) => {
  return await User.findByIdAndUpdate({ _id: userId }, { token: null });
};

const updateSubscriptionByEmail = async ({ email, subscription }) => {
  return await User.findOneAndUpdate(
    email,
    { subscription: subscription },
    { new: true }
  );
};

const changeAvatar = async (_id, { tmpUpload, originalname }) => {
  const imageName = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, imageName);
  await fsp.rename(tmpUpload, resultUpload);
  const avatarURL = path.join("public", "avatars", imageName);
  await User.findByIdAndUpdate(_id, { avatarURL });
  return avatarURL;
};

const unlinkPath = async ({ tmpUpload }) => {
  return await fsp.unlink(tmpUpload);
};

module.exports = {
  getUser,
  addUser,
  addToken,
  getUserById,
  removeToken,
  updateSubscriptionByEmail,
  changeAvatar,
  unlinkPath,
};
