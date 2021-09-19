import { map, tileLayer, marker, control, divIcon, Util, featureGroup } from "leaflet/dist/leaflet-src.esm";

const MAPS = [...document.querySelectorAll(".map")];

const defaultOptions = {
    scrollWheelZoom: false,
};

const ICON_SETTINGS = {
    mapIconUrl:
        '<svg version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 149 178"><path fill="{mapIconColor}" stroke="#FFF" stroke-width="6" stroke-miterlimit="10" d="M126 23l-6-6A69 69 0 0 0 74 1a69 69 0 0 0-51 22A70 70 0 0 0 1 74c0 21 7 38 22 52l43 47c6 6 11 6 16 0l48-51c12-13 18-29 18-48 0-20-8-37-22-51z"/><circle fill="{mapIconColorInnerCircle}" cx="74" cy="75" r="61"/><circle fill="#FFF" cx="74" cy="75" r="{pinInnerCircleRadius}"/></svg>',
    mapIconColor: "#d91a39",
    mapIconColorInnerCircle: "#d91a39",
    pinInnerCircleRadius: 30,
};

const DIV_ICON = divIcon({
    className: "leaflet-data-marker",
    html: Util.template(ICON_SETTINGS.mapIconUrl, ICON_SETTINGS),
    iconAnchor: [12, 32],
    iconSize: [25, 30],
    popupAnchor: [0, -28],
});

const STYLE = tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
});

MAPS.forEach((element) => {
    const settings = { ...defaultOptions, ...JSON.parse(element.dataset?.map || null) };
    const canvas = element.querySelector(".map__canvas");
    const markerGroup = [];
    const addresses = [...canvas.querySelectorAll(".map-address")].map((element) => {
        const coordinate = element.dataset.coordinate.split(",");
        return {
            html: element.innerHTML,
            coordinate: [parseFloat(coordinate[0]), parseFloat(coordinate[1])],
        };
    });
    canvas.innerHTML = "";

    const MAP = map(canvas, settings);
    control
        .scale({
            imperial: false,
        })
        .addTo(MAP);
    STYLE.addTo(MAP);

    addresses.forEach((address) => {
        const MARKER = marker(address.coordinate, { icon: DIV_ICON }).addTo(MAP);
        markerGroup.push(MARKER);
        if (address.html) {
            MARKER.bindPopup(address.html, {
                maxWidth: 500,
            });
        }
    });

    MAP.fitBounds(new featureGroup(markerGroup).getBounds());

    element.style.visibility = "visible";
});
