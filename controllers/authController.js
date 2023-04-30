const service = require("../service/authService");

const verifyEmail = async (req, res, next) => {
  const { verificationToken } = req.params;
  const user = await service.getUserByVerificationToken({ verificationToken });
  if (!user) {
    return res.status(404).json({
      message: "Not found",
      code: 404,
    });
  }
  try {
    await service.updateVerificationToken(user._id);
    return res.status(200).json({
      message: "Verification successful",
      code: 200,
    });
  } catch (error) {
    next(error);
  }
};

const reverifyEmail = async (req, res, next) => {
  const { email } = req.body;
  const user = await service.getUser({ email });
  if (user.verify) {
    return res.status(400).json({
      message: "Verification has already been passed",
    });
  }
  try {
    await service.resendEmail({ user });
    return res.status(200).json({
      message: "Verification email sent",
      code: 200,
    });
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  const { email, password } = req.body;
  const userEmail = await service.getUser({ email });
  if (userEmail) {
    return res.status(409).json({
      message: "Email is already in use",
      code: 409,
      data: "Conflict",
    });
  }
  try {
    const user = await service.addUser({ email, password });
    res.status(201).json({
      message: "Registration successful",
      code: 201,
      user,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await service.getUser({ email });
  if (!user || !user.verify || !user.validPassword(password)) {
    return res.status(401).json({
      message: "Please, verify your email and check whether it's correct",
      code: 401,
      data: "Unauthorized",
    });
  }
  const token = await service.addToken({ user });
  const { subscription } = user;
  return res.json({
    message: "Success",
    code: 200,
    token,
    user: { email, subscription },
  });
};

const logout = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await service.getUserById(_id);
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    await service.removeToken(_id);
    return res.status(204).json();
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const { _id, email, subscription } = req.user;
    const user = await service.getUserById(_id);
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    return res.json({
      message: "Success",
      code: 200,
      user: { email, subscription },
    });
  } catch (error) {
    next(error);
  }
};

const updateSubscription = async (req, res, next) => {
  try {
    const { email, subscription } = req.body;
    const user = await service.updateSubscriptionByEmail({
      email,
      subscription,
    });
    res.json({ message: "Updated", code: 200, data: { user } });
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  const { path: tmpUpload, originalname } = req.file;
  const { _id } = req.user;
  try {
    const avatarURL = await service.changeAvatar(_id, {
      tmpUpload,
      originalname,
    });
    return res.status(200).json({ avatarURL });
  } catch (error) {
    service.unlinkPath({ tmpUpload });
    next(error);
  }
};

module.exports = {
  verifyEmail,
  reverifyEmail,
  register,
  login,
  logout,
  getCurrentUser,
  updateSubscription,
  updateAvatar,
};
