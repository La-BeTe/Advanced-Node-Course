const { Schema, model } = require("mongoose");

const logSchema = new Schema({
  type: String,
  key: String,
  value: String
});

module.exports = model("Log", logSchema);