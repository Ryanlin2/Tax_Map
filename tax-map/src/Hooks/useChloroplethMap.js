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
      const taxValue = feature.properties.value;
      const formattedTax = taxValue && !isNaN(parseFloat(taxValue))
        ? `${(parseFloat(taxValue) * 100).toFixed(1)}%`
        : 'N/A';

      layer.on('add', () => {
        const center = layer.getBounds().getCenter();

        const label = L.divIcon({
          className: 'state-label',
          html: `
            <div class="label-wrapper">
              <strong>${name}</strong><br />
              <span class="tax-rate">${formattedTax}</span>
            </div>
          `,
          iconSize: [120, 30],
          iconAnchor: [60, 15]
        });

        const marker = L.marker(center, {
          icon: label,
          interactive: false,
          opacity: 0.1
        }).addTo(layer._map);

        layer.on('mouseover', () => marker.setOpacity(1));
        layer.on('mouseout', () => marker.setOpacity(0.1));
      });
    }


    }).addTo(map);

    mapRef.current = map;
    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'info legend');

      const grades = [0, 0.005, 0.015, 0.025, 0.035, 0.045, 0.055];
      const labels = [];

      for (let i = 0; i < grades.length; i++) {
        const from = (grades[i] * 100).toFixed(1);
        const to = grades[i + 1] ? (grades[i + 1] * 100).toFixed(1) : '+';

        labels.push(
          `<i style="background:${colorScaleFunc(grades[i])}"></i> ${from}${to !== '+' ? `&ndash;${to}` : '+'}%`
        );
      }

      div.innerHTML = `
        <h4>Tax Rate</h4>
        ${labels.join('<br>')}
      `;

      return div;
    };

    legend.addTo(map);

  }, [geoJsonData, mapOptions, colorScaleFunc]);

  return mapRef;
}

