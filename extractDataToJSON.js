const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

// Pfad zur JSON-Datei
const filePath = path.join(__dirname, "Dartsspieler.json");

// Datei einlesen
const rawData = fs.readFileSync(filePath, "utf-8");
const jsonData = JSON.parse(rawData);

// Spielerdaten werden aus der JSON-Datei extrahiert
const spieler = jsonData.players;

// Funktion, um einen Spieler anhand des Namens zu finden
function findPlayer(playerName) {
    return spieler.find(p => p.name === playerName);
}

// Funktion, um die Spieler-ID zu extrahieren und die Daten von der Webseite zu extrahieren
async function extractPlayerData(playerName) {
    const player = findPlayer(playerName);
    const playerID = player?.dartsorakel_id;

    if (!playerID) {
        console.error("Spieler-ID nicht gefunden!");
        return; // Kein Rückgabewert nötig
    }

    // URL der Webseite, die die Spielerstatistiken enthält -> PlayerID wird an die URL rangehangen, um die passende Page abzufragen
    const targetPage = "https://app.dartsorakel.com/player/stats/" + playerID;

    // Nutzung von Puppeteer, um Hochzählung der Daten abzuwarten und erst dann die Seite zu laden
    // DeepSeek Nutzung an dieser Stelle -> Nutzung von Puppeteer
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Hier warten auf die Seite, bis sie vollständig geladen ist
    await page.goto(targetPage, { waitUntil: "networkidle0" });
    await page.waitForSelector('.fs-2.fw-bolder');

    const scrapedData = await page.evaluate(() => {
        // Nutzung von ChatGPT nach Eingabe der Klasse des Elements -> Extraktion der genauen Klasse durch ChatGPT
        const statBoxes = document.querySelectorAll('.border.border-gray-300.border-dashed.rounded.min-w-125px.py-3.px-4.me-6.mb-3');
        const generalStats = Array.from(statBoxes).map((el, i) => {
            const labels = [
                "Einnahmen", "Siegquote", "FDI Rating", "Order of Merit",
                "9-Darter", "Tour Card Jahre", "Höchster Average", "Höchster TV-Average"
            ];
            // Ausgehend vom Ursprungselement werden die Kinder-Elemente extrahiert mit den nötigen Daten
            const value = el.querySelector(".fs-2.fw-bolder")?.textContent.trim() ||
                el.querySelector(".fs-2.w-bolder")?.textContent.trim() || "";
            return {
                label: labels[i] || `label${i + 1}`,
                value: value
            };
        });

        // Extraktion der detaillierten Statistiken von Tableelement auf der Seite
        const table = document.getElementById("playerStatsTable");
        let detailedStats = [];

        // Labeling der nötigen Statistiken
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

        // Extraktion der Daten aus der Tabelle
        if (table) {
            const rows = table.querySelectorAll("tr");
            detailedStats = Array.from(rows).map((row, i) => {
                // Extraktion der genauen Zellen mit ChatGPT
                const cells = row.querySelectorAll("td[style]");
                const cellData = Array.from(cells).map(cell => cell.textContent.trim());
                return {
                    label: labels[i-1] || `label${i + 1}`,
                    value: cellData[0] || ""
                };
            }).filter(row => row.value !== "");
        }

        // Extraktion der persönlichen Informationen -> Nationalität, Geburtsstadt und Alter
        const personalInfo = (() => {
            const infoDiv = document.querySelector('.d-flex.flex-wrap.fw-bold.fs-6.mb-4.pe-2');
            if (!infoDiv) return null;

            const items = Array.from(infoDiv.querySelectorAll('a')).map(a => a.textContent.trim());

            let country = null;
            let city = null;
            let age = null;

            // REGEX für 3 Großbuchstaben -> z.B. "ENG" für England -> generiert von DeepSeek
            if (items.length > 0 && /^[A-Z]{3}$/.test(items[0])) {
                country = items[0];
            }

            // REGEX für Zahl, die in einer runden Klammer steht -> z.B. "(18)" für 18 Jahre -> generiert von DeepSeek
            const ageItem = items.find(text => /\(\d+\)/.test(text));
            if (ageItem) {
                // Extraktion der Zahl aus der Klammer
                const match = ageItem.match(/\((\d+)\)/);
                age = match ? match[1] : null;
            }

            // REGEX für finden eines Textes mit Datum -> z.B. "London, 18/12/2000" -> generiert von DeepSeek
            const cityItem = items.find(text => /,/.test(text) && /\d{1,2}\/\d{1,2}\/\d{2,4}/.test(text));
            if (cityItem) {
                // Extraktion der Stadt aus dem Text
                city = cityItem.split(",")[0].trim();
            }

            return { country, city, age };
        })();

        return {
            generalStats,
            detailedStats,
            personalInfo
        };
    });
    await browser.close();

    // Hier wird die JSON-Datei in Bezug auf einen Spieler aktualisiert
    const index = spieler.findIndex(p => p.name === playerName);
    if (index !== -1) {
        spieler[index].personalInfo = scrapedData.personalInfo;
        spieler[index].generalStats = scrapedData.generalStats;
        spieler[index].detailedStats = scrapedData.detailedStats;
    } else {
        console.error("Spieler nicht gefunden für Update!");
    }

    // Schreiben in die JSON-Datei
    fs.writeFileSync(filePath, JSON.stringify({ players: spieler }, null, 2), "utf-8");

    console.log(`Daten für "${playerName}" erfolgreich aktualisiert und gespeichert.`);
}

// Funktion, um die Daten für alle Spieler zu extrahieren
async function updateWholeJSON() {
    for (let i = 0; i < spieler.length; i++) {
            await extractPlayerData(spieler[i].name);
    }
}
updateWholeJSON();
// extractPlayerData("Luke Littler");

