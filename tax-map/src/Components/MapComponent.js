import React from 'react';
import { useChloroplethMap } from '../Hooks/useChloroplethMap';


import geoJsonData from './data.json'; // Make sure this file exists

const colorScale = value => {
  if (value > 90) return '#800026';
  if (value > 70) return '#BD0026';
  if (value > 50) return '#E31A1C';
  if (value > 30) return '#FC4E2A';
  return '#FFEDA0';
};

export default function MapComponent() {
  useChloroplethMap(geoJsonData, {}, colorScale);
  return <div id="map" style={{ height: '500px', width: '100%' }} />;
}
