const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Kullanıcı kayıt adresi: /api/auth/register
router.post("/register", authController.register);

// Giriş adresi: /api/auth/login
router.post("/login", authController.login);
// Kepengi en son kapatıyoruz!
module.exports = router;
