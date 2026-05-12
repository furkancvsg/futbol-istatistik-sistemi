const Player = require("../models/Player");

// 1. Tüm Futbolcuları Listele (READ)
exports.getAllPlayers = async (req, res) => {
  try {
    const players = await Player.find();
    res.status(200).json(players);
  } catch (err) {
    res.status(500).json({ error: "Veriler alınamadı." });
  }
};

// 2. Yeni Futbolcu Ekle (CREATE) - Sadece Admin/Kurucu
exports.createPlayer = async (req, res) => {
  try {
    const { name, team, goals, assists, xG } = req.body;
    const newPlayer = new Player({ name, team, goals, assists, xG });
    await newPlayer.save();
    res.status(201).json({ message: "Futbolcu başarıyla eklendi!" });
  } catch (err) {
    res.status(400).json({ error: "Ekleme başarısız. Verileri kontrol et." });
  }
};
