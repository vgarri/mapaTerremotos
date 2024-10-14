// navigator.geolocation.getCurrentPosition();
//creamos vbles globales
let titulo;
let fecha;
let ubicacion;
let codigo;
let magnitud;
let resultados;
let fechaConv;

if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(position => {
         console.log(`Latitud: ${position.coords.latitude}\nLongitud: ${position.coords.longitude}`);
    });
} else {
  console.warn("Tu navegador no soporta Geolocalización!! ");
}





//obtenemos datos
async function obtainData(){
let response = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson");
    let data = await response.json();
    resultados = data.features;
    titulo = resultados.map(feature => feature.properties.title);
    fecha = resultados.map(feature => feature.properties.time);
    fechaConv = new Date(fecha).toString();

    
    ubicacion = resultados.map(feature => feature.geometry.coordinates);
    codigo = resultados.map(feature => feature.properties.code);
    magnitud  = resultados.map(feature => feature.properties.mag);

    return {resultados, titulo, fecha, ubicacion, codigo, magnitud}

}
async function injectMap(){
await obtainData();
console.log(fechaConv);
for (let i = 0; i < ubicacion.length; i++) {
    const marcadores = L.marker([ubicacion[i][1], ubicacion[i][0]]).addTo(map)
    let popupContent = `<p>Título<br />${titulo[i]}</p>
                        <p>Ubicación<br />${[ubicacion[i]]}</p>
                        <p>Código<br />${codigo[i]}</p>
                        <p>Fecha<br />${fecha[i]}</p>
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
//marcadores para terremotos
//const marker = L.marker([28.666666666667, -17.866666666667]).addTo(map);

//const terremoto = L.marker(ubicacion[i]).addTo(map)
//Agregar popup
// const popup = L.popup()
// .setLatLng([28.666666666667, -17.866666666667])
// .setContent("Isla de La Palma")
// .openOn(map);
