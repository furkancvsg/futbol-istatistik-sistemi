const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Kullanıcı kayıt adresi: /api/auth/register
router.post("/register", authController.register);

module.exports = router;
