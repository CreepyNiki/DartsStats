import {NominatimJS} from "@owsas/nominatim-js";

// https://www.sitepoint.com/get-url-parameters-with-javascript/#:~:text=The%20URLSearchParams%20interface%20in%20modern,values%20associated%20with%20a%20particular
// URL Parameter wird ausgelesen
let urlParams = new URLSearchParams(window.location.search);
// Wenn Parameter city vorhanden ist, wird dieser in die Variable city gespeichert
let city = urlParams.get('city');

// Mit der City nach Nominatim API suchen -> https://www.npmjs.com/package/nominatim-js
let lat;
let lon;

let result = NominatimJS.search({ q: city, format: 'json' })

console.log(result);



let map = L.map('map').setView([50.9265, 6.9280], 17);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// https://gis.stackexchange.com/questions/168687/fly-to-location-in-leaflet
map.flyTo([lat, lon], 14);

let marker = L.marker([lat, lon]).addTo(map);



