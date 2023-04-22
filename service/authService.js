const { User } = require("./schemas/user");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const secret = process.env.SECRET;

const getUser = async ({ email }) => {
  return User.findOne({ email });
};

const addUser = async ({ email, password }) => {
  const newUser = new User({ email, password });
  const { subscription } = newUser;
  newUser.setPassword(password);
  await newUser.save();
  return { email, subscription };
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

module.exports = {
  getUser,
  addUser,
  addToken,
  getUserById,
  removeToken,
  updateSubscriptionByEmail,
};
