let sammlung;
let request = new XMLHttpRequest();

request.open("GET", "Dartsspieler.json", true);
request.responseType = "json";
request.send();
request.onload = function () {

    sammlung = request.response;

    sammlung.players.sort((a, b) => {
        const aOrder = parseInt(a.generalStats.find(stat => stat.label === "Order of Merit")?.value) || 0;
        const bOrder = parseInt(b.generalStats.find(stat => stat.label === "Order of Merit")?.value) || 0;
        return aOrder - bOrder;
    });

    function displayallPlayers() {
        const output = document.querySelector(".output");
        output.innerHTML = "";

        const table = document.createElement("table");
        table.className = "players-table";

        let row;
        for (let i = 0; i < sammlung.players.length; i++) {
            if (i % 4 === 0) {
                row = document.createElement("tr");
                row.className = "players-row";
                table.appendChild(row);
            }
            const generalStats = sammlung.players[i].generalStats;
            const detailedStats = sammlung.players[i].detailedStats;
            const info = sammlung.players[i].personalInfo;
            const orderOfMerit = generalStats.find(stat => stat.label === "Order of Merit");
            const siegquote = generalStats.find(stat => stat.label === "Siegquote")?.value;
            const neunDarter = generalStats.find(stat => stat.label === "9-Darter")?.value;
            const fdiRating = generalStats.find(stat => stat.label === "FDI Rating")?.value;


            console.log(orderOfMerit ? orderOfMerit.value : "Nicht gefunden");
            const cell = document.createElement("td");
            cell.className = "players-cell";
            if (orderOfMerit.value <= 16) {
                cell.style.backgroundImage = "url('assets/Tots.png')";
            } else if (orderOfMerit.value <= 32) {
                cell.style.backgroundImage = "url('assets/Mittel.png')";
            } else {
                cell.style.backgroundImage = "url('assets/Bronze.png')";
            }


            const player = document.createElement("div");
            player.className = "player";


                player.innerHTML = `
            <h2>${sammlung.players[i].name}</h2>
            <p>OrderOfMerit: ${orderOfMerit.value}</p>
            <p>Land: ${info.country}</p>
            <p>Stadt: ${info.city}</p>
            <p>Alter: ${info.age}</p>
            <p>Average: ${detailedStats[0].value}</p>
            <p>180er: ${detailedStats[1].value}</p>
            <p>Doppelquote: ${detailedStats[2].value}</p>
            <p>Siegquote: ${siegquote}</p>
            <p>9-Darter: ${neunDarter}</p>
            <p>T20-Trefferquote: ${detailedStats[24].value}</p>
            <p>T19-Trefferquote: ${detailedStats[26].value}</p>
            <p>FDI Rating: ${fdiRating}</p>
        `;

                cell.appendChild(player);
                row.appendChild(cell);

        }

        output.appendChild(table);
    }

    displayallPlayers()

};