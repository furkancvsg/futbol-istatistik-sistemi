const appDiv = document.getElementById("app");

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
  fetchPlayers();
}

// Sayfa yüklendiğinde futbolcuları getir
async function fetchPlayers() {
  try {
    const res = await fetch("/api/players");
    const players = await res.json();

    renderPlayerList(players);
  } catch (err) {
    appDiv.innerHTML =
      '<div class="alert alert-danger">Veriler yüklenemedi!</div>';
  }
}

function renderPlayerList(players) {
  let html = `
        <h3>Futbolcu Listesi</h3>
        <table class="table table-striped mt-3">
            <thead>
                <tr>
                    <th>Ad</th>
                    <th>Takım</th>
                    <th>Gol</th>
                    <th>Asist</th>
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
                    </tr>
                `,
                  )
                  .join("")}
            </tbody>
        </table>
    `;
  appDiv.innerHTML = html;
}

fetchPlayers();
