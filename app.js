const express = require("express");
const app = express();
const mongoose = require("mongoose"); // Veritabanı motorumuz
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
require("dotenv").config();

app.use(express.json());
app.use(express.static("public"));

// --- MONGODB BULUT (ATLAS) VERİTABANI BAĞLANTISI ---
const mongoURI = process.env.MONGO_URI;
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB bulut bağlantısı başarıyla kuruldu! 🚀🔥"))
  .catch((err) => console.error("MongoDB bağlantı hatası:", err));

// --- SWAGGER API DOKÜMANTASYON AYARLARI ---
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Futbol İstatistik Sistemi API",
      version: "1.0.0",
      description:
        "Sistem Analizi dersi için hazırlanan futbolcu takip API dokümantasyonu",
    },
    servers: [{ url: "http://localhost:3000" }],
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// --- ROTALARI BAĞLAMA ---
const authRoutes = require("./routes/authRoutes");
const playerRoutes = require("./routes/playerRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/players", playerRoutes); // Gerçek Controller rotamız bağlı

// --- SUNUCUYU AYAĞA KALDIRMA ---
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
  console.log(`Swagger dokümantasyonu: http://localhost:3000/api-docs`);
});
