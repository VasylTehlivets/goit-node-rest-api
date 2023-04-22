const express = require("express");
const { auth } = require("../../middleware/authMiddleware");
const validation = require("../../middleware/validation");
const { schema, subscriptionSchema } = require("../../service/schemas/user");
const {
  register,
  login,
  logout,
  getCurrentUser,
  updateSubscription,
} = require("../../controllers/authController");

const router = express.Router();

router.post("/signup", validation(schema), register);
router.post("/login", validation(schema), login);
router.get("/logout", auth, logout);
router.get("/current", auth, getCurrentUser);
router.patch("/", auth, validation(subscriptionSchema), updateSubscription);

module.exports = router;
