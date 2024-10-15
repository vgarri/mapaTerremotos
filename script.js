// navigator.geolocation.getCurrentPosition();
//creamos vbles globales
let titulo;
let fecha;
let ubicacion;
let codigo;
let magnitud;
let resultados;
let fechaConv;
//Ejercicio 1
if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(position => {
         console.log(`Latitud: ${position.coords.latitude}\nLongitud: ${position.coords.longitude}`);
        let datos = `<h1>Aquí estás!</h1>
        <p>Lat: ${position.coords.latitude.toFixed(4)}</p>
        <p>Long: ${position.coords.longitude.toFixed(4)}</p>`
        document.querySelector("map2");
    });
} else {
  console.warn("Tu navegador no soporta Geolocalización!! ");
}

const mapId = 'map2';
const initialCoordinates = [40.4169473, -3.7057172]; // Plaza Sol en Madrid [lat, lng]
const map2 = L.map(mapId).setView(initialCoordinates, 13);





let LeafIcon = L.Icon.extend({
    options: {
        iconUrl: '/assets/0.png',
        iconSize: [18, 18],
        shadowSize: [50, 64],
        iconAnchor: [22, 94],
        shadowAnchor: [4, 62],
        popupAnchor: [-3, -76]
    }
});
let icon0 = new LeafIcon({ iconUrl: '/assets/0.png' });
let icon1 = new LeafIcon({ iconUrl: '/assets/1.png' });
let icon2 = new LeafIcon({ iconUrl: '/assets/2.png' });
let icon3 = new LeafIcon({ iconUrl: '/assets/3.png' });
let icon4 = new LeafIcon({ iconUrl: '/assets/4.png' });
let icon5 = new LeafIcon({ iconUrl: '/assets/5.png' });
let icon6 = new LeafIcon({ iconUrl: '/assets/6.png' });
let icon7 = new LeafIcon({ iconUrl: '/assets/7.png' });

let varIcon;



//obtenemos datos
async function obtainData() {
    let response = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson");
    let data = await response.json();
    resultados = data.features;//se puede hacer con forEach solo iterando una vez features. Refactorizar.
    titulo = resultados.map(feature => feature.properties.title);
    fecha = resultados.map(feature => feature.properties.time);
    fechaConv = fecha.map(fech => Date(fech * 1000).toString());
    ubicacion = resultados.map(feature => feature.geometry.coordinates);
    codigo = resultados.map(feature => feature.properties.code);
    magnitud = resultados.map(feature => feature.properties.mag);

    //return { resultados, titulo, fecha, ubicacion, codigo, magnitud,fechaConv }

}
async function injectMap() {
    await obtainData();
    

    for (let i = 0; i < ubicacion.length; i++) {
        magnitud[i] > 0 && magnitud[i] < 1 ? varIcon = icon0 : "";
        magnitud[i] > 1 && magnitud[i] < 2 ? varIcon = icon1 : "";
        magnitud[i] > 2 && magnitud[i] < 3 ? varIcon = icon2 : "";
        magnitud[i] > 3 && magnitud[i] < 4 ? varIcon = icon3 : "";
        magnitud[i] > 4 && magnitud[i] < 5 ? varIcon = icon4 : "";
        magnitud[i] > 5 && magnitud[i] < 6 ? varIcon = icon5 : "";
        magnitud[i] > 6 && magnitud[i] < 7 ? varIcon = icon6 : "";
        magnitud[i] > 7 && magnitud[i] < 8 ? varIcon = icon7 : "";

        const marcadores = new L.Marker([ubicacion[i][1], ubicacion[i][0]],{icon: varIcon}).addTo(map)
        let popupContent = `<p>Título<br />${titulo[i]}</p>
                        <p>Ubicación<br />${[ubicacion[i]]}</p>
                        <p>Código<br />${codigo[i]}</p>
                        <p>Fecha<br />${fechaConv[i]}</p>
                        <p>Magnitud en escala Richter:<br />${magnitud[i]}</p>`
        marcadores.bindPopup(popupContent).openPopup() 
    }

}
injectMap();

//mapa

var map = L.map('map').setView([28.666666666667, -17.866666666667], 1);

L.tileLayer.provider('Stadia.AlidadeSmoothDark').addTo(map);
var Stadia_AlidadeSmoothDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
    minZoom: 100,
    maxZoom: 100,
    attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    ext: 'png'
});

