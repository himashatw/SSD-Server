const { Schema, model } = require("mongoose");

const FileSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  file: {
    type: Buffer,
    require: true,
  },
});

module.exports = model("File", FileSchema);
