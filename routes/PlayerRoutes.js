const express = require("express");
const router = express.Router();
const playerController = require("../controllers/playerController");

// Herkes görebilir
router.get("/", playerController.getAllPlayers);

// Şimdilik sadece yolu açıyoruz, birazdan "Admin mi?" kontrolü ekleyeceğiz
router.post("/", playerController.createPlayer);

router.put("/:id", playerController.updatePlayer); // Güncelleme için PUT

router.delete("/:id", playerController.deletePlayer); // Silme için DELETE

module.exports = router;
