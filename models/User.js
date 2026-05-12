const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Kurucu, Admin veya normal kullanıcı rolleri
  role: {
    type: String,
    enum: ["kurucu", "admin", "user"],
    default: "user",
  },
});

module.exports = mongoose.model("User", UserSchema);
