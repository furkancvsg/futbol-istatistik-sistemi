const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 1. GERÇEK KULLANICI KAYDI (REGISTER)
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // E-posta daha önce sisteme kayıt edilmiş mi kontrol et
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ error: "Bu e-posta adresi zaten kayıtlı!" });
    }

    // Şifreyi veritabanına açık halde yazmamak için hash'liyoruz
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Yeni kullanıcıyı oluştur ve MongoDB'ye kaydet
    user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: "Kullanıcı başarıyla oluşturuldu!" });
  } catch (error) {
    res.status(500).json({ error: "Kayıt sırasında bir hata oluştu." });
  }
};

// 2. GERÇEK KULLANICI GİRİŞİ (LOGIN)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kullanıcıyı e-posta adresinden veritabanında ara
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "E-posta veya şifre hatalı!" });
    }

    // Girilen şifre ile veritabanındaki hash'lenmiş şifreyi karşılaştır
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "E-posta veya şifre hatalı!" });
    }

    // Kullanıcıya sistemde dolaşabilmesi için 1 gün geçerli gerçek bir JWT Token üret
    const token = jwt.sign(
      { id: user._id, role: user.role },
      "futbol_istatistik_gizli_anahtar_jwt",
      { expiresIn: "1d" },
    );

    // Token ve kullanıcının gerçek rolünü (Kullanıcı/Admin) frontend'e gönder
    res.status(200).json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ error: "Giriş yapılırken bir hata oluştu." });
  }
};
