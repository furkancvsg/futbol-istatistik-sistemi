const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  team: { type: String, required: true },
  goals: { type: Number, default: 0 },
  assists: { type: Number, default: 0 },
  xG: { type: Number, default: 0 }, 
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Player", PlayerSchema);
