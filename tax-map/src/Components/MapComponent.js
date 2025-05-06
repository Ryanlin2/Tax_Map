import React from 'react';
import { useChloroplethMap } from '../Hooks/useChloroplethMap';
import statesData from './us-states.json';

const randomizedGeoJson = {
  ...statesData,
  features: statesData.features.map(feature => {
    const randomValue = Math.floor(Math.random() * 101);
    return {
      ...feature,
      properties: {
        ...feature.properties,
        value: randomValue
      }
    };
  })
};

const colorScale = value => {
  if (value > 90) return '#800026';
  if (value > 75) return '#BD0026';
  if (value > 60) return '#E31A1C';
  if (value > 45) return '#FC4E2A';
  if (value > 30) return '#FD8D3C';
  if (value > 15) return '#FEB24C';
  return '#FFEDA0';
};

export default function MapComponent() {
  useChloroplethMap(randomizedGeoJson, {}, colorScale);
  return <div id="map" />;
}
