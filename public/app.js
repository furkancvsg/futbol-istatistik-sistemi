let allPlayers = []; // Tüm futbolcuları hafızada tutmak için
const appDiv = document.getElementById("app");

// Sayfa yüklendiğinde kullanıcı zaten giriş yapmışsa direkt içeri al
window.onload = () => {
  if (localStorage.getItem("token")) {
    showDashboard();
  }
};

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

function showDashboard() {
  document.getElementById("auth-section").style.display = "none";
  document.getElementById("main-content").style.display = "block";

  const role = localStorage.getItem("role");
  if (role === "Admin" || role === "Kurucu Admin") {
    document.getElementById("admin-actions").style.display = "block";
  }
  fetchPlayers();
}

async function addPlayer() {
  const player = {
    name: document.getElementById("p-name").value,
    team: document.getElementById("p-team").value,
    goals: document.getElementById("p-goals").value,
    assists: document.getElementById("p-assists").value,
  };

  const res = await fetch("/api/players", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: JSON.stringify(player),
  });

  if (res.ok) {
    alert("Futbolcu eklendi!");
    // Formu temizle
    document.getElementById("p-name").value = "";
    document.getElementById("p-team").value = "";
    document.getElementById("p-goals").value = "";
    document.getElementById("p-assists").value = "";
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

async function fetchPlayers() {
  try {
    const res = await fetch("/api/players");
    allPlayers = await res.json(); // Veriyi global değişkene kaydet
    renderPlayerList(allPlayers); // Ekrana bas
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
                        ${isAdmin ? `<td><button class="btn btn-danger btn-sm" onclick="deletePlayer('${p._id}')">Sil</button></td>` : ""}
                    </tr>
                `,
                  )
                  .join("")}
            </tbody>
        </table>
    `;

  // Arama ve Filtreleme Özelliği (Ekstra Özellik Puanı İçin)
  function filterPlayers() {
    const searchText = document
      .getElementById("search-input")
      .value.toLowerCase();

    // İsme veya takıma göre filtrele
    const filtered = allPlayers.filter(
      (p) =>
        p.name.toLowerCase().includes(searchText) ||
        p.team.toLowerCase().includes(searchText),
    );

    // Sadece filtrelenmiş olanları ekrana bas
    renderPlayerList(filtered);
  }
  // appDiv yerine sadece liste alanına basıyoruz
  const listContainer = document.getElementById("player-list-container");
  if (listContainer) {
    listContainer.innerHTML = html;
  } else {
    // Eğer container yoksa (ilk yükleme gibi) appDiv'e basabilirsin ama yukarıdaki yapı daha güvenli
    appDiv.innerHTML = html;
  }
}
