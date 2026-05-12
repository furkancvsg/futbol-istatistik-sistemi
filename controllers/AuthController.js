const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Kayıt Olma Fonksiyonu
exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Şifreyi güvenli hale getiriyoruz (Hashing)
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user", // Eğer rol seçilmezse otomatik 'user' olur
    });

    await newUser.save();
    res.status(201).json({ message: "Kullanıcı başarıyla oluşturuldu!" });
  } catch (err) {
    res.status(500).json({ error: "Kayıt sırasında bir hata oluştu." });
  }
};
