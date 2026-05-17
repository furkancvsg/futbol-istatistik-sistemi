let allPlayers = [];
let editingPlayerId = null;

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

  if (!name || !email || !password) return alert("Lütfen tüm alanları doldur!");

  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });
    const data = await res.json();
    if (res.ok) {
      alert("Kayıt başarılı! Şimdi giriş yapabilirsin.");
      showLogin();
    } else alert(data.error || "Kayıt başarısız oldu!");
  } catch (err) {
    console.error(err);
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
    } else alert(data.error || "Giriş başarısız!");
  } catch (err) {
    console.error(err);
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

// FBREF MAKYAJI: Tablo class'larına table-sm ve table-hover eklendi. xG sütunu açıldı.
function renderPlayerList(players) {
  const role = localStorage.getItem("role");
  const isAdmin = role === "Admin" || role === "Kurucu Admin";

  let html = `
        <h3 class="mt-4 mb-3" style="font-weight: 600;">Takım İstatistikleri</h3>
        <div class="table-responsive shadow-sm">
          <table class="table table-sm table-hover table-striped align-middle bg-white m-0">
              <thead class="table-dark">
                  <tr>
                      <th>Oyuncu Adı</th>
                      <th>Takım</th>
                      <th class="text-center">Gol</th>
                      <th class="text-center">Asist</th>
                      <th class="text-center">xG</th>
                      ${isAdmin ? "<th class='text-end pe-3'>İşlemler</th>" : ""}
                  </tr>
              </thead>
              <tbody>
                  ${players
                    .map(
                      (p) => `
                      <tr>
                          <td class="fw-bold">${p.name}</td>
                          <td>${p.team}</td>
                          <td class="text-center">${p.goals}</td>
                          <td class="text-center">${p.assists}</td>
                          <td class="text-center fw-semibold text-primary">${p.xG || "0.00"}</td>
                          ${
                            isAdmin
                              ? `
                              <td class="text-end pe-2">
                                  <button class="btn btn-outline-warning btn-sm me-1" onclick="editPlayer('${p._id}')">Düzenle</button>
                                  <button class="btn btn-outline-danger btn-sm" onclick="deletePlayer('${p._id}')">Sil</button>
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
        </div>
    `;
  const listContainer = document.getElementById("player-list-container");
  if (listContainer) listContainer.innerHTML = html;
}

function editPlayer(id) {
  const player = allPlayers.find((p) => p._id === id);
  if (!player) return;

  document.getElementById("p-name").value = player.name;
  document.getElementById("p-team").value = player.team;
  document.getElementById("p-goals").value = player.goals;
  document.getElementById("p-assists").value = player.assists;
  document.getElementById("p-xg").value = player.xG || ""; // xG'yi forma çek

  editingPlayerId = id;
  const btn = document.querySelector("#admin-actions button");
  btn.textContent = "Güncelle";
  btn.className = "btn btn-warning btn-sm w-100";
}

async function addPlayer() {
  const name = document.getElementById("p-name").value.trim();
  const team = document.getElementById("p-team").value.trim();
  const goals = document.getElementById("p-goals").value;
  const assists = document.getElementById("p-assists").value;
  const xG = document.getElementById("p-xg").value; // xG'yi formdan al

  if (!name || !team || goals === "" || assists === "") {
    return alert("Lütfen tüm alanları eksiksiz doldur!");
  }

  // Veritabanına xG'yi de gönderiyoruz
  const playerData = { name, team, goals, assists, xG };
  let res;

  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
  };

  if (editingPlayerId) {
    res = await fetch(`/api/players/${editingPlayerId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(playerData),
    });
  } else {
    res = await fetch("/api/players", {
      method: "POST",
      headers,
      body: JSON.stringify(playerData),
    });
  }

  if (res.ok) {
    document.getElementById("p-name").value = "";
    document.getElementById("p-team").value = "";
    document.getElementById("p-goals").value = "";
    document.getElementById("p-assists").value = "";
    document.getElementById("p-xg").value = ""; // xG alanını temizle

    editingPlayerId = null;
    const btn = document.querySelector("#admin-actions button");
    btn.textContent = "Ekle";
    btn.className = "btn btn-success btn-sm w-100";

    fetchPlayers();
  }
}

async function deletePlayer(id) {
  if (!confirm("Bu oyuncuyu istatistiklerden silmek istediğine emin misin?"))
    return;
  const res = await fetch(`/api/players/${id}`, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + localStorage.getItem("token") },
  });
  if (res.ok) fetchPlayers();
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
