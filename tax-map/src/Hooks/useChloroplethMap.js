import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export function useChloroplethMap(geoJsonData, mapOptions = {}, colorScaleFunc) {
  const mapRef = useRef(null);

  useEffect(() => {
    const container = document.getElementById('map');
    if (mapRef.current || !container || !geoJsonData) return;

    const map = L.map(container, {
      center: mapOptions.center || [37.8, -96],
      zoom: mapOptions.zoom || 5,
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

      layer.on('add', () => {
        const center = layer.getBounds().getCenter();

        const label = L.divIcon({
          className: 'state-label',
          html: `<strong>${name}</strong>`,
          iconSize: [100, 20],
          iconAnchor: [50, 10]
        });

        const marker = L.marker(center, {
          icon: label,
          interactive: false,
          opacity: 0.1 // start faded
        }).addTo(layer._map);

        // Change opacity on hover
        layer.on('mouseover', () => marker.setOpacity(1));
        layer.on('mouseout', () => marker.setOpacity(0.1));
      });
    }


    }).addTo(map);

    mapRef.current = map;
  }, [geoJsonData, mapOptions, colorScaleFunc]);

  return mapRef;
}

