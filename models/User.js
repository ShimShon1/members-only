const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  isMember: { type: Boolean, required: true, default: false },
  isAdmin: { type: Boolean, required: true, default: false },
});

module.exports = mongoose.model("User", UserSchema);
