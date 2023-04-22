const { Contact } = require("./schemas/contact");
const mongoose = require("mongoose");

const getContacts = async ({ _id, page, limit, favorite }) => {
  const skip = (page - 1) * limit;
  if (!favorite) {
    return await Contact.find({ owner: _id }, "", {
      skip,
      limit: Number(limit),
    });
  }
  return await Contact.find({ owner: _id, favorite }, "", {
    skip,
    limit: Number(limit),
  });
};

const getContactById = (contactId) => {
  if (mongoose.Types.ObjectId.isValid(contactId)) {
    return Contact.findOne({ _id: contactId });
  }
  return null;
};

const addContact = ({ name, email, phone, _id }) => {
  return Contact.create({ name, email, phone, owner: _id });
};

const updateContact = (contactId, fields) => {
  return Contact.findByIdAndUpdate({ _id: contactId }, fields, { new: true });
};

const removeContact = (contactId) => {
  if (mongoose.Types.ObjectId.isValid(contactId)) {
    return Contact.findByIdAndRemove({ _id: contactId });
  }
  return null;
};

module.exports = {
  getContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
};
