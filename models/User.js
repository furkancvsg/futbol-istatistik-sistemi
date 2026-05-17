const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Enum değerlerini hem Türkçe hem İngilizceyi kapsayacak şekilde genişletiyoruz ki hiçbir şey patlayamasın!
  role: {
    type: String,
    enum: ["Kullanıcı", "Admin", "Kurucu Admin", "User", "user", "admin"],
    default: "Kullanıcı",
  },
});

module.exports = mongoose.model("User", userSchema);
