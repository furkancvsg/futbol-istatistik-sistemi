const express = require("express");
const router = express.Router();
const playerController = require("../controllers/playerController");

// Futbolcu Listeleme
router.get("/", playerController.getAllPlayers);

// Futbolcu Ekleme
router.post("/", playerController.createPlayer);

// Futbolcu Güncelleme
router.put("/:id", playerController.updatePlayer);

// Futbolcu Silme
router.delete("/:id", playerController.deletePlayer);

module.exports = router;
