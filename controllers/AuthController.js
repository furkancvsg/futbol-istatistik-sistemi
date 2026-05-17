const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 1. GERÇEK KULLANICI KAYDI (REGISTER)
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Lütfen tüm alanları doldurun!" });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ error: "Bu e-posta adresi zaten kayıtlı!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Formdan gelen rolü direkt şemaya paslıyoruz, şemayı genişlettiğimiz için artık patlamayacak
    user = new User({
      username: name,
      email: email,
      password: hashedPassword,
      role: role || "Kullanıcı",
    });

    await user.save();
    res.status(201).json({ message: "Kullanıcı başarıyla oluşturuldu!" });
  } catch (error) {
    console.error("Kayıt Hatası Detayı:", error);
    res.status(500).json({ error: "Kayıt sırasında sunucu hatası oluştu." });
  }
};

// 2. GERÇEK KULLANICI GİRİŞİ (LOGIN)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "E-posta ve şifre zorunludur!" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "E-posta veya şifre hatalı!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "E-posta veya şifre hatalı!" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      "futbol_istatistik_gizli_anahtar_jwt",
      { expiresIn: "1d" },
    );

    res.status(200).json({ token, role: user.role });
  } catch (error) {
    console.error("Giriş Hatası Detayı:", error);
    res.status(500).json({ error: "Giriş yapılırken sunucu hatası oluştu." });
  }
};
