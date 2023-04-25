const express = require("express");
const { auth } = require("../../middleware/authMiddleware");
const validation = require("../../middleware/validationMiddleware");
const { schema, favoriteSchema } = require("../../service/schemas/contact");
const {
  get,
  getById,
  create,
  update,
  updateFavorite,
  remove,
} = require("../../controllers/contactsController");

const router = express.Router();

router.get("/", auth, get);

router.get("/:contactId", auth, getById);

router.post("/", auth, validation(schema), create);

router.put("/:contactId", auth, validation(schema), update);

router.patch(
  "/:contactId/favorite",
  auth,
  validation(favoriteSchema),
  updateFavorite
);

router.delete("/:contactId", auth, remove);

module.exports = router;
