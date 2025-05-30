
// Code übernommen aus dem Beispiel des Kurses -> File: 250625Start_8
let sammlung;
let request = new XMLHttpRequest();

request.open("GET", "Dartsspieler.json", true);
request.responseType = "json";
request.send();
request.onload = function () {

    sammlung = request.response;

    // Sortiere die Spieler nach "Order of Merit" -> generiert von Github Copilot
    sammlung.players.sort((a, b) => {
        const aOrder = parseInt(a.generalStats.find(stat => stat.label === "Order of Merit")?.value) || 0;
        const bOrder = parseInt(b.generalStats.find(stat => stat.label === "Order of Merit")?.value) || 0;
        return aOrder - bOrder;
    });

    // Methode zum Anzeigen aller Spieler
    function displayallPlayers() {
        const output = document.querySelector(".output");
        output.innerHTML = "";

        // Erstelle eine Tabelle für die Spieler um die Struktur des Stylings zu vereinfachen
        const table = document.createElement("table");
        table.className = "players-table";

        let row;
        for (let i = 0; i < sammlung.players.length; i++) {

            // Erstelle eine neue Zeile alle 4 Spieler
            if (i % 4 === 0) {
                row = document.createElement("tr");
                row.className = "players-row";
                table.appendChild(row);
            }

            // Sammeln der Informationen für jeden Spieler aus der Datenbank des JSON-Files
            const generalStats = sammlung.players[i].generalStats;
            const detailedStats = sammlung.players[i].detailedStats;
            const info = sammlung.players[i].personalInfo;
            const orderOfMerit = generalStats.find(stat => stat.label === "Order of Merit");
            const siegquote = generalStats.find(stat => stat.label === "Siegquote")?.value;
            const neunDarter = generalStats.find(stat => stat.label === "9-Darter")?.value;
            const fdiRating = generalStats.find(stat => stat.label === "FDI Rating")?.value;

            const cell = document.createElement("td");

            // Unterschiedliche Karten für die Spieler je nach "Order of Merit"
            cell.className = "players-cell";
            if (orderOfMerit.value <= 16) {
                cell.style.backgroundImage = "url('assets/Cards/Top16.png')";
                // Farbe Golden für die Top 16 Spieler -> sonst nicht sichtbar
                cell.style.color = "#b19e00";
            } else if (orderOfMerit.value <= 32) {
                cell.style.backgroundImage = "url('assets/Cards/Top32.png')";
            } else {
                cell.style.backgroundImage = "url('assets/Cards/Top64.png')";
            }

            const player = document.createElement("div");
            player.className = "player";

            // Generierung der HTML-Struktur der Karten -> Hilfe von ChatGPT
            // encodeURIComponent wird verwendet, um URL Parameter an Leaflet weiterzugeben
            // WICHTIG: Auf den Marker klicken, um die Karte und die Website zu öffnen
            player.innerHTML = `
  <div class="player-info">
    <div class="oom">${orderOfMerit?.value || "N/A"}</div>
    <img class="flag" src="assets/Flags/${info?.country || "default"}.png" alt="Flagge">
<div class="age-city">
  <span class="age">Alter: ${info?.age || "Unbekannt"}</span>
  <span class="city">${info?.city || "Unbekannt"}</span>
</div>
<a href="map.html?city=${encodeURIComponent(sammlung.players[i].personalInfo.city)}">
  <img class="marker" src="assets/Pictures/marker.png" alt="Marker">
</a>
          
  </div>
  <img class="player-picture" src="assets/PlayerPictures/${sammlung.players[i].name}.png" alt="Spielerbild">
  <div class="player-name">${sammlung.players[i].name}</div>
  <div class="stats">
    <div class="stat-block">
      <span class="stat-label">Average</span>
      <span class="stat-value">${detailedStats[0]?.value || "0"}</span>
    </div>
    <div class="stat-block">
      <span class="stat-label">180er</span>
      <span class="stat-value">${detailedStats[1]?.value || "0"}</span>
    </div>
    <div class="stat-block">
      <span class="stat-label">Doppelquote</span>
      <span class="stat-value">${detailedStats[2]?.value || "0"}</span>
    </div>
    <div class="stat-block">
      <span class="stat-label">Siegquote</span>
      <span class="stat-value">${siegquote?.replace(/^%/, "")}%</span>
    </div>
    <div class="stat-block">
      <span class="stat-label">9-Darter</span>
      <span class="stat-value">${neunDarter || "0"}</span>
    </div>
    <div class="stat-block">
      <span class="stat-label">FDI Rating</span>
      <span class="stat-value">${fdiRating || "0"}</span>
    </div>
  </div>
`;

            // Anpassung der Schriftgröße für Raymond van Barneveld da Name zu lang ist
            if (sammlung.players[i].name === "Raymond van Barneveld") {
                player.querySelector(".player-name").style.fontSize = "1.6em";
            }

            cell.appendChild(player);
            row.appendChild(cell);
        }

        output.appendChild(table);
    }

    // Anbindung der Select-Box für die Nationen -> Filter Methode zum Übergeben der jeweiligen Spieler nach Nation an die Methode displayFilteredPlayers
    function displayNationPlayers(nation) {
        if (nation === "all") {
            displayallPlayers();
        } else if (nation === "eng") {
            const filteredPlayers = sammlung.players.filter(player => player.personalInfo.country === "ENG");
            displayFilteredPlayers(filteredPlayers);
        } else if (nation === "ger") {
            const filteredPlayers = sammlung.players.filter(player => player.personalInfo.country === "GER");
            displayFilteredPlayers(filteredPlayers);
        } else if (nation === "ned") {
            const filteredPlayers = sammlung.players.filter(player => player.personalInfo.country === "NED");
            displayFilteredPlayers(filteredPlayers);
        } else if (nation === "sco") {
            const filteredPlayers = sammlung.players.filter(player => player.personalInfo.country === "SCO");
            displayFilteredPlayers(filteredPlayers);
        } else if (nation === "wal") {
            const filteredPlayers = sammlung.players.filter(player => player.personalInfo.country === "WAL");
            displayFilteredPlayers(filteredPlayers);
        } else if (nation === "irl") {
            const filteredPlayers = sammlung.players.filter(player => player.personalInfo.country === "IRL");
            displayFilteredPlayers(filteredPlayers);
        } else if (nation === "aus") {
            const filteredPlayers = sammlung.players.filter(player => player.personalInfo.country === "AUS");
            displayFilteredPlayers(filteredPlayers);
        } else if (nation === "bel") {
            const filteredPlayers = sammlung.players.filter(player => player.personalInfo.country === "BEL");
            displayFilteredPlayers(filteredPlayers);
        } else if (nation === "can") {
            const filteredPlayers = sammlung.players.filter(player => player.personalInfo.country === "CAN");
            displayFilteredPlayers(filteredPlayers);
        } else if (nation === "nir") {
            const filteredPlayers = sammlung.players.filter(player => player.personalInfo.country === "NIR");
            displayFilteredPlayers(filteredPlayers);
        } else if (nation === "swe") {
            const filteredPlayers = sammlung.players.filter(player => player.personalInfo.country === "SWE");
            displayFilteredPlayers(filteredPlayers);
        } else if (nation === "pol") {
            const filteredPlayers = sammlung.players.filter(player => player.personalInfo.country === "POL");
            displayFilteredPlayers(filteredPlayers);
        } else if (nation === "por") {
            const filteredPlayers = sammlung.players.filter(player => player.personalInfo.country === "POR");
            displayFilteredPlayers(filteredPlayers);
        } else if (nation === "ltv") {
            const filteredPlayers = sammlung.players.filter(player => player.personalInfo.country === "LTV");
            displayFilteredPlayers(filteredPlayers);
        } else if (nation === "aut") {
            const filteredPlayers = sammlung.players.filter(player => player.personalInfo.country === "AUT");
            displayFilteredPlayers(filteredPlayers);
        }
    }

    // Funktion zum Anzeigen der Spieler nach Nation -> vermutlich hätte man dies auch einfacher lösen können und die Funktion nicht komplett kopieren müssen
    function displayFilteredPlayers(filteredPlayers) {
        const output = document.querySelector(".output");
        output.innerHTML = "";

        const table = document.createElement("table");
        table.className = "players-table";

        let row;
        for (let i = 0; i < filteredPlayers.length; i++) {
            if (i % 4 === 0) {
                row = document.createElement("tr");
                row.className = "players-row";
                table.appendChild(row);
            }
            // Hier Extraktion der Informationen für jeden gefilterten Spieler
            const generalStats = filteredPlayers[i].generalStats;
            const detailedStats = filteredPlayers[i].detailedStats;
            const info = filteredPlayers[i].personalInfo;
            const orderOfMerit = generalStats.find(stat => stat.label === "Order of Merit");
            const siegquote = generalStats.find(stat => stat.label === "Siegquote")?.value;
            const neunDarter = generalStats.find(stat => stat.label === "9-Darter")?.value;
            const fdiRating = generalStats.find(stat => stat.label === "FDI Rating")?.value;

            const cell = document.createElement("td");
            cell.className = "players-cell";
            if (orderOfMerit.value <= 16) {
                cell.style.backgroundImage = "url('assets/Cards/Top16.png')";
                cell.style.color = "#b19e00";
            } else if (orderOfMerit.value <= 32) {
                cell.style.backgroundImage = "url('assets/Cards/Top32.png')";
            } else {
                cell.style.backgroundImage = "url('assets/Cards/Top64.png')";
            }

            const player = document.createElement("div");
            player.className = "player";

            player.innerHTML = `
  <div class="player-info">
    <div class="oom">${orderOfMerit?.value || "N/A"}</div>
    <img class="flag" src="assets/Flags/${info?.country || "default"}.png" alt="Flagge">
<div class="age-city">
  <span class="age">Alter: ${info?.age || "Unbekannt"}</span>
  <span class="city">${info?.city || "Unbekannt"}</span>
</div>
<a href="map.html?city=${encodeURIComponent(sammlung.players[i].personalInfo.city)}">
  <img class="marker" src="assets/Pictures/marker.png" alt="Marker">
</a>
  </div>
  <img class="player-picture" src="assets/PlayerPictures/${filteredPlayers[i].name}.png" alt="Spielerbild">
  <div class="player-name">${filteredPlayers[i].name}</div>
  <div class="stats">
    <div class="stat-block">
      <span class="stat-label">Average</span>
      <span class="stat-value">${detailedStats[0]?.value || "0"}</span>
    </div>
    <div class="stat-block">
      <span class="stat-label">180er</span>
      <span class="stat-value">${detailedStats[1]?.value || "0"}</span>
    </div>
    <div class="stat-block">
      <span class="stat-label">Doppelquote</span>
      <span class="stat-value">${detailedStats[2]?.value || "0"}</span>
    </div>
    <div class="stat-block">
      <span class="stat-label">Siegquote</span>
      <span class="stat-value">${siegquote?.replace(/^%/, "")}%</span>
    </div>
    <div class="stat-block">
      <span class="stat-label">9-Darter</span>
      <span class="stat-value">${neunDarter || "0"}</span>
    </div>
    <div class="stat-block">
      <span class="stat-label">FDI Rating</span>
      <span class="stat-value">${fdiRating || "0"}</span>
    </div>
  </div>
`;

            if (filteredPlayers[i].name === "Raymond van Barneveld") {
                player.querySelector(".player-name").style.fontSize = "1.6em";
            }

            cell.appendChild(player);
            row.appendChild(cell);

        }

        output.appendChild(table);
    }

    displayallPlayers()

    window.displayNationPlayers = displayNationPlayers;

    // Methode zum Anzeigen der Spieler nach Suchbegriff -> generiert von GitHub Copilot und angepasst
    window.searchPlayers = function () {
        const input = document.getElementById("search-input");
        const filter = input.value.toLowerCase();
        const filteredPlayers = sammlung.players.filter(player =>
            player.name.toLowerCase().includes(filter)
        );
        displayFilteredPlayers(filteredPlayers);
        if (filteredPlayers.length === 0) {
            const output = document.querySelector(".output");
            output.innerHTML = "<p>Keine Spieler gefunden.</p><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>";
        }
    };
};

