const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, required: true },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

PostSchema.virtual("formattedDate").get(function () {
  return this.date.toLocaleString();
});

module.exports = mongoose.model("Post", PostSchema);
