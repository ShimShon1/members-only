const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, minLength: 2 },
  password: { type: String, required: true, minLength: 2 },
  fullName: { type: String, required: true, minLength: 2 },
  isMember: { type: Boolean, required: true, default: false },
  isAdmin: { type: Boolean, required: true, default: false },
});

module.exports = mongoose.model("User", UserSchema);
