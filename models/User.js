const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  googleId: String,
  displayName: String
});

module.exports = model("User", userSchema);
