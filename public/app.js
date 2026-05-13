const appDiv = document.getElementById("app");

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
