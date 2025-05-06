import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export function useChloroplethMap(geoJsonData, mapOptions = {}, colorScaleFunc) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) return;

const map = L.map('map', {
  center: mapOptions.center || [37.8, -96],
  zoom: mapOptions.zoom || 4,
  ...mapOptions
});


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.geoJson(geoJsonData, {
      style: feature => ({
        fillColor: colorScaleFunc(feature.properties.value),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
      }),
      onEachFeature: (feature, layer) => {
        const name = feature.properties.name;
        const value = feature.properties.value;
        layer.bindPopup(`<b>${name}</b>: ${value}%`);
      }
    }).addTo(map);

    mapRef.current = map;
  }, [geoJsonData, mapOptions, colorScaleFunc]);

  return mapRef;
}
