const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

app.use(express.json());
app.use(express.static("public"));

// Swagger Ayarları
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

// Rotaları Bağlama
const authRoutes = require("./routes/authRoutes");
const playerRoutes = require("./routes/playerRoutes");

app.use("/api/auth", authRoutes);
app.get("/api/players", (req, res) => {
  res.json([
    { name: "Mauro Icardi", team: "Galatasaray", goals: 25, assists: 8 },
    { name: "Edin Dzeko", team: "Fenerbahçe", goals: 20, assists: 5 },
  ]);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
  console.log(`Swagger dokümantasyonu: http://localhost:3000/api-docs`);
});
