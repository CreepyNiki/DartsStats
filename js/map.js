// https://www.sitepoint.com/get-url-parameters-with-javascript/#:~:text=The%20URLSearchParams%20interface%20in%20modern,values%20associated%20with%20a%20particular
// URL Parameter wird ausgelesen
let urlParams = new URLSearchParams(window.location.search);
// Wenn URL-Parameter city vorhanden ist, wird dieser in die Variable city gespeichert
let city = urlParams.get('city');

// Mit der City nach Nominatim API suchen -> https://www.npmjs.com/package/nominatim-js
let lat;
let lon;


//https://stackoverflow.com/questions/75426598/fetching-json-data-from-nominatim-api-is-not-working
// Fetch Request an Nominatim API senden, um die Koordinaten der Stadt zu erhalten
let result = fetch(`https://nominatim.openstreetmap.org/search?city=${city}&format=json&addressdetails=1&limit=1`)
    .then(response => response.json())
    .then(data => {
        lat = data[0].lat;
        lon = data[0].lon;
        // Start an der Uni Köln
        let map = L.map('map').setView([50.9265, 6.9280], 17);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // https://gis.stackexchange.com/questions/168687/fly-to-location-in-leaflet
        // Karte auf die Koordinaten der Stadt zentrieren und hineinzoomen
        map.flyTo([lat, lon], 14);

        // Marker an der Position der Stadt hinzufügen
        let marker = L.marker([lat, lon]).addTo(map);
    })









