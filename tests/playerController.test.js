const playerController = require("../controllers/playerController");
const Player = require("../models/Player");
const httpMocks = require("node-mocks-http");

// Gerçek veritabanına bağlanmadan test yapmak için Player modelini taklit ediyoruz (Mocking)
jest.mock("../models/Player");

describe("Player Controller Testleri", () => {
  it("getAllPlayers - Tüm futbolcuları başarıyla getirmeli ve 200 dönmeli", async () => {
    // 1. Hazırlık: Veritabanından geliyormuş gibi yapacak sahte futbolcu listesi
    const mockPlayers = [
      { name: "Mauro Icardi", team: "Galatasaray", goals: 25, assists: 8 },
      { name: "Edin Dzeko", team: "Fenerbahçe", goals: 20, assists: 5 },
    ];

    // Modelin find metodunu, bizim sahte listemizi döndürecek şekilde ayarlıyoruz
    Player.find.mockResolvedValue(mockPlayers);

    // Sahte İstek (req) ve Cevap (res) nesneleri oluşturuyoruz
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    // 2. Aksiyon: Test edeceğimiz fonksiyonu çalıştırıyoruz
    await playerController.getAllPlayers(req, res);

    // 3. Kontrol (Assertion): Sonuçlar beklediğimiz gibi mi?
    expect(res.statusCode).toBe(200); // Durum kodu 200 (Başarılı) olmalı
    expect(res._getJSONData()).toStrictEqual(mockPlayers); // Dönen veri bizim sahte listeyle aynı olmalı
    expect(Player.find).toHaveBeenCalledTimes(1); // find metodu sadece 1 kere çağrılmış olmalı
  });
});
