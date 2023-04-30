const express = require("express");
const { auth } = require("../../middleware/authMiddleware");
const { upload } = require("../../middleware/multerMiddleware");
const { jimpAvatarResizer } = require("../../middleware/jimpMiddleware");
const validation = require("../../middleware/validationMiddleware");
const {
  schema,
  subscriptionSchema,
  emailSchema,
} = require("../../service/schemas/user");
const {
  verifyEmail,
  reverifyEmail,
  register,
  login,
  logout,
  getCurrentUser,
  updateSubscription,
  updateAvatar,
} = require("../../controllers/authController");

const router = express.Router();

router.get("/verify/:verificationToken", verifyEmail);
router.post("/verify", validation(emailSchema), reverifyEmail);
router.post("/signup", validation(schema), register);
router.post("/login", validation(schema), login);
router.get("/logout", auth, logout);
router.get("/current", auth, getCurrentUser);
router.patch("/", auth, validation(subscriptionSchema), updateSubscription);

router.patch(
  "/avatars",
  auth,
  upload.single("avatar"),
  jimpAvatarResizer,
  updateAvatar
);

module.exports = router;
