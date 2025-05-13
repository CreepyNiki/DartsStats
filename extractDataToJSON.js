const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

// Pfad zur JSON-Datei
const filePath = path.join(__dirname, "Dartsspieler.json");

// Datei einlesen
const rawData = fs.readFileSync(filePath, "utf-8");
const jsonData = JSON.parse(rawData);

// Spielerdaten werden
const spieler = jsonData.players;

function findPlayer(playerName) {
    return spieler.find(p => p.name === playerName);
}

async function extractPlayerData(playerName) {
    const player = findPlayer(playerName);
    const playerID = player?.dartsorakel_id;

    if (!playerID) {
        console.error("Spieler-ID nicht gefunden!");
        return; // Kein Rückgabewert nötig
    }

    const targetPage = "https://app.dartsorakel.com/player/stats/" + playerID;

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(targetPage, { waitUntil: "networkidle0" });
    await page.waitForSelector('.fs-2.fw-bolder');

    const scrapedData = await page.evaluate(() => {
        const statBoxes = document.querySelectorAll('.border.border-gray-300.border-dashed.rounded.min-w-125px.py-3.px-4.me-6.mb-3');
        const generalStats = Array.from(statBoxes).map((el, i) => {
            const labels = [
                "Einnahmen", "Preisgeld", "FDI Rating", "Order of Merit",
                "9-Darter", "Tour Card Jahre", "Höchster Average", "Höchster TV-Average"
            ];
            const value = el.querySelector(".fs-2.fw-bolder")?.textContent.trim() ||
                el.querySelector(".fs-2.w-bolder")?.textContent.trim() || "";
            return {
                label: labels[i] || `Unknown ${i + 1}`,
                value: value
            };
        });

        const table = document.getElementById("playerStatsTable");
        let detailedStats = [];

        const labels = [
            "Average", "180er", "Checkoutquote", "Legs gewonnen in %",
            "Höchstes Finish", "First 9 Average", "First 3 Average",
            "Average bei Anwurf", "Average gegen Anwurf", "Wins",
            "12 Darter Prozent", "15 Darter Prozent", "18 Darter Prozent",
            "Leggewinnquote bei Anwurf", "Leggewinnquote gegen Anwurf",
            "Checkoutquote 1-Dart", "Checkoutquote 2-Dart", "Checkoutquote 3-Dart",
            "180er pro Leg", "171-180er pro Leg", "140er pro Leg", "131-140er pro Leg",
            "Average Entscheidungsleg", "Entscheidungsleggewinnquote",
            "T20 Trefferquote", "T20 Streuung", "T19 Trefferquote", "T19 Streuung",
            "Checkoutquote dritter Dart", "Checkoutquote Bullseye",
            "Doppelstart Average", "Startdoppel Trefferquote",
            "Startdoppel Treffer erster Dart", "Startdoppel Treffer zweiter Dart"
        ];

        if (table) {
            const rows = table.querySelectorAll("tr");
            detailedStats = Array.from(rows).map((row, i) => {
                const cells = row.querySelectorAll("td[style]");
                const cellData = Array.from(cells).map(cell => cell.textContent.trim());
                return {
                    label: labels[i] || `label${i + 1}`,
                    value: cellData[0] || ""
                };
            }).filter(row => row.value !== "");
        }

        return {
            generalStats,
            detailedStats
        };
    });

    await browser.close();

    const index = spieler.findIndex(p => p.name === playerName);
    if (index !== -1) {
        spieler[index].generalStats = scrapedData.generalStats;
        spieler[index].detailedStats = scrapedData.detailedStats;
    } else {
        console.error("Spieler nicht gefunden für Update!");
    }

    fs.writeFileSync(filePath, JSON.stringify({ players: spieler }, null, 2), "utf-8");

    console.log(`Daten für "${playerName}" erfolgreich aktualisiert und gespeichert.`);
}

async function updateWholeJSON() {
    for (let i = 0; i < spieler.length; i++) {
            await extractPlayerData(spieler[i].name);
    }
}
updateWholeJSON();

