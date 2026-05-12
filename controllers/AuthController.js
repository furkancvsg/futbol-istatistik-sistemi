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
const jwt = require("jsonwebtoken");

// Giriş Yapma Fonksiyonu
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Kullanıcıyı bul
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı." });
    }

    // 2. Şifreyi karşılaştır
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Hatalı şifre." });
    }

    // 3. Giriş başarılı, bir Token oluştur (Kimlik kartı gibi)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      "OZEL_ANAHTAR_BURAYA", // Bu senin gizli anahtarın
      { expiresIn: "1h" }, // 1 saat geçerli
    );

    res.status(200).json({
      message: "Giriş başarılı!",
      token,
      role: user.role, // Frontend'de butonları gizlemek için lazım olacak
    });
  } catch (err) {
    res.status(500).json({ error: "Giriş sırasında bir hata oluştu." });
  }
};
