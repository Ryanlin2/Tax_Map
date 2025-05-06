import { useEffect, useRef } from 'react';
import L from 'leaflet';


export function useChloroplethMap(geoJsonData, mapOptions = {}, colorScaleFunc) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map('map', mapOptions).setView([37.8, -96], 4);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      L.geoJson(geoJsonData, {
        style: feature => ({
          fillColor: colorScaleFunc(feature.properties.value),
          weight: 2,
          opacity: 1,
          color: 'white',
          fillOpacity: 0.7
        }),
        onEachFeature: (feature, layer) => {
          layer.bindPopup(`Value: ${feature.properties.value}`);
        }
      }).addTo(map);

      mapRef.current = map;
    }
  }, [geoJsonData, mapOptions, colorScaleFunc]);

  return mapRef;
}
