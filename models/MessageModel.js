const { Schema, model } = require("mongoose");

const MessageSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
});

module.exports = model("Message", MessageSchema);
