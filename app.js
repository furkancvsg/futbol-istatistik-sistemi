const express = require("express");
const app = express();
const path = require("path");

// JSON formatında veri alıp göndermek için [cite: 21]
app.use(express.json());

// Frontend dosyalarını (Vanilla JS) dışarıya açmak için [cite: 12]
app.use(express.static("public"));

// Basit bir test rotası
app.get("/api/test", (req, res) => {
  res.json({ message: "Futbol sistemi API hazır!" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
