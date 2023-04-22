const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

const contact = new Schema(
  {
    owner: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "users",
    },
    name: {
      type: String,
      unique: true,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false }
);

const schema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  phone: Joi.string().min(8).max(99).required(),
});

const favoriteSchema = Joi.object().keys({
  favorite: Joi.boolean().required(),
});

const Contact = mongoose.model("contacts", contact);

module.exports = {
  schema,
  favoriteSchema,
  Contact,
};
