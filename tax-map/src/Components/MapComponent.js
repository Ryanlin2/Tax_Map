import React, { useEffect, useState } from 'react';
import { useChloroplethMap } from '../Hooks/useChloroplethMap';
import { useTaxRates } from '../Hooks/useTaxRates';
import statesData from './us-states.json';

const colorScale = value => {
  const v = parseFloat(value);
  if (isNaN(v)) return '#ccc';
  if (v > .8) return '#800026';
  if (v >  .6) return '#BD0026';
  if (v > .4) return '#E31A1C';
  if (v > .3) return '#FC4E2A';
  if (v > .2) return '#FD8D3C';
  if (v > .1) return '#FEB24C';
  return '#FFEDA0';
};

export default function MapComponent() {
  const { data: taxData, loading } = useTaxRates();
  const [geoJsonWithTax, setGeoJsonWithTax] = useState(null);

  useEffect(() => {
    if (!taxData) return;

    const taxMap = {};
    taxData.forEach(entry => {
      taxMap[entry.state] = entry["Single Filer"];
    });

    const enriched = {
      ...statesData,
      features: statesData.features.map(feature => {
        const stateName = feature.properties.name;
        const taxValue = taxMap[stateName] || null;
        return {
          ...feature,
          properties: {
            ...feature.properties,
            value: taxValue
          }
        };
      })
    };

    setGeoJsonWithTax(enriched);
  }, [taxData]);

  useChloroplethMap(geoJsonWithTax, {}, colorScale);

  if (loading) return <div>Loading tax data...</div>;
  return <div id="map" style={{ height: "100vh", width: "100vw" }} />;

}

