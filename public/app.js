let allPlayers = [];
let editingPlayerId = null; // Hangi oyuncuyu güncellediğimizi tutacak değişken

window.onload = () => {
  if (localStorage.getItem("token")) {
    showDashboard();
  }
};

// --- EKRAN GEÇİŞ FONKSİYONLARI ---
function showRegister() {
  document.getElementById("auth-section").style.display = "none";
  document.getElementById("register-section").style.display = "flex";
}

function showLogin() {
  document.getElementById("register-section").style.display = "none";
  document.getElementById("auth-section").style.display = "flex";
}

function showDashboard() {
  document.getElementById("auth-section").style.display = "none";
  if (document.getElementById("register-section")) {
    document.getElementById("register-section").style.display = "none";
  }
  document.getElementById("main-content").style.display = "block";

  // Çıkış butonunu göster
  document.getElementById("logout-btn").style.display = "block";

  const role = localStorage.getItem("role");
  if (role === "Admin" || role === "Kurucu Admin") {
    document.getElementById("admin-actions").style.display = "block";
  }
  fetchPlayers();
}

// --- KAYIT OL VE GİRİŞ YAP ---
async function register() {
  const name = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-password").value;
  const role = document.getElementById("reg-role").value;

  if (!name || !email || !password) {
    alert("Lütfen tüm alanları doldur!");
    return;
  }

  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Kayıt başarılı! Şimdi giriş yapabilirsin.");
      document.getElementById("reg-name").value = "";
      document.getElementById("reg-email").value = "";
      document.getElementById("reg-password").value = "";
      showLogin();
    } else {
      alert(data.error || "Kayıt başarısız oldu!");
    }
  } catch (err) {
    console.error("Kayıt hatası:", err);
  }
}

async function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      showDashboard();
    } else {
      alert(data.error || "Giriş başarısız!");
    }
  } catch (err) {
    console.error("Giriş hatası:", err);
  }
}

// --- FUTBOLCU İŞLEMLERİ (CRUD VE ARAMA) ---
async function fetchPlayers() {
  try {
    const res = await fetch("/api/players");
    allPlayers = await res.json();
    renderPlayerList(allPlayers);
  } catch (err) {
    console.error("Veriler yüklenemedi!");
  }
}

function renderPlayerList(players) {
  const role = localStorage.getItem("role");
  const isAdmin = role === "Admin" || role === "Kurucu Admin";

  let html = `
        <h3>Futbolcu Listesi</h3>
        <table class="table table-striped mt-3">
            <thead>
                <tr>
                    <th>Ad</th>
                    <th>Takım</th>
                    <th>Gol</th>
                    <th>Asist</th>
                    ${isAdmin ? "<th>İşlem</th>" : ""}
                </tr>
            </thead>
            <tbody>
                ${players
                  .map(
                    (p) => `
                    <tr>
                        <td>${p.name}</td>
                        <td>${p.team}</td>
                        <td>${p.goals}</td>
                        <td>${p.assists}</td>
                        ${
                          isAdmin
                            ? `
                            <td>
                                <button class="btn btn-warning btn-sm me-1" onclick="editPlayer('${p._id}')">Düzenle</button>
                                <button class="btn btn-danger btn-sm" onclick="deletePlayer('${p._id}')">Sil</button>
                            </td>
                        `
                            : ""
                        }
                    </tr>
                `,
                  )
                  .join("")}
            </tbody>
        </table>
    `;
  const listContainer = document.getElementById("player-list-container");
  if (listContainer) {
    listContainer.innerHTML = html;
  }
}

// --- DÜZENLEME MODUNU AÇAN FONKSİYON ---
function editPlayer(id) {
  const player = allPlayers.find((p) => p._id === id);
  if (!player) return;

  document.getElementById("p-name").value = player.name;
  document.getElementById("p-team").value = player.team;
  document.getElementById("p-goals").value = player.goals;
  document.getElementById("p-assists").value = player.assists;

  editingPlayerId = id;
  const btn = document.querySelector("#admin-actions button");
  btn.textContent = "Güncelle";
  btn.className = "btn btn-warning w-100";
}

// --- EKLEME VE GÜNCELLEME İŞLEMİ (BİRLEŞTİRİLDİ) ---
async function addPlayer() {
  const name = document.getElementById("p-name").value.trim();
  const team = document.getElementById("p-team").value.trim();
  const goals = document.getElementById("p-goals").value;
  const assists = document.getElementById("p-assists").value;

  if (!name || !team || goals === "" || assists === "") {
    alert("Lütfen tüm alanları eksiksiz doldur!");
    return;
  }

  const playerData = { name, team, goals, assists };
  let res;

  if (editingPlayerId) {
    // GÜNCELLEME İŞLEMİ
    res = await fetch(`/api/players/${editingPlayerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(playerData),
    });
  } else {
    // YENİ EKLEME İŞLEMİ
    res = await fetch("/api/players", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(playerData),
    });
  }

  if (res.ok) {
    alert(editingPlayerId ? "Futbolcu güncellendi!" : "Futbolcu eklendi!");

    document.getElementById("p-name").value = "";
    document.getElementById("p-team").value = "";
    document.getElementById("p-goals").value = "";
    document.getElementById("p-assists").value = "";

    editingPlayerId = null;
    const btn = document.querySelector("#admin-actions button");
    btn.textContent = "Ekle";
    btn.className = "btn btn-success w-100";

    fetchPlayers();
  }
}

async function deletePlayer(id) {
  if (!confirm("Silmek istediğine emin misin?")) return;

  const res = await fetch(`/api/players/${id}`, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + localStorage.getItem("token") },
  });

  if (res.ok) {
    fetchPlayers();
  }
}

function filterPlayers() {
  const searchText = document
    .getElementById("search-input")
    .value.toLowerCase();
  const filtered = allPlayers.filter(
    (p) =>
      p.name.toLowerCase().includes(searchText) ||
      p.team.toLowerCase().includes(searchText),
  );
  renderPlayerList(filtered);
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  location.reload();
}
