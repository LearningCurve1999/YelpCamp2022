// <!--Mapbox Script-->
// const parsedCampground = JSON.parse(campground);

mapboxgl.accessToken = 'pk.eyJ1IjoiYWtvYXltYXlsb2JvIiwiYSI6ImNsYXF0c2RicDBqdDYzcm5zMGhldW4xYjQifQ.8sLqcrLt4INaJ4MxmhT7Mw';
const map = new mapboxgl.Map({
    container: 'map',
    style:'mapbox://styles/mapbox/streets-v12', // stylesheet location
    center: campground.geometry.coordinates, // starting position [lng, lat]
//Will parsed the location entered in form, then the coordinates will be at that
// after creating a campgrounds.
    zoom: 9 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
//Set the marker on that specific location
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campground.geometry.coordinates}</h3><p>${campground.geometry.coordinates}</p>`
            )
    )
    .addTo(map)


