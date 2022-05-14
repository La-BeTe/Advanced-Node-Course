const { Schema, model } = require("mongoose");

const blogSchema = new Schema({
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
  _user: { type: Schema.Types.ObjectId, ref: "User" }
});

module.exports = model("Blog", blogSchema);
