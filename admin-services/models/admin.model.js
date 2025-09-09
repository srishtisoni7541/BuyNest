const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    select:false,
  },
   resetPasswordToken: String,
  resetPasswordExpires: Date,
  role: {
    type: String,
    default: "admin",
  },
  refreshToken: {
    type: String,
    select:false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Admin", adminSchema);
