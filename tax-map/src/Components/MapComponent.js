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

    const STATE_NAME_MAP = {
      'Alabama': 'Ala.', 'Alaska': 'Alaska', 'Arizona': 'Ariz.', 'Arkansas': 'Ark.', 'California': 'Calif.',
      'Colorado': 'Colo.', 'Connecticut': 'Conn.', 'Delaware': 'Del.', 'Florida': 'Fla.', 'Georgia': 'Ga.',
      'Hawaii': 'Hawaii', 'Idaho': 'Idaho', 'Illinois': 'Ill.', 'Indiana': 'Ind.', 'Iowa': 'Iowa',
      'Kansas': 'Kans.', 'Kentucky': 'Ky.', 'Louisiana': 'La.', 'Maine': 'Maine', 'Maryland': 'Md.',
      'Massachusetts': 'Mass.', 'Michigan': 'Mich.', 'Minnesota': 'Minn.', 'Mississippi': 'Miss.',
      'Missouri': 'Mo.', 'Montana': 'Mont.', 'Nebraska': 'Nebr.', 'Nevada': 'Nev.', 'New Hampshire': 'N.H.',
      'New Jersey': 'N.J.', 'New Mexico': 'N.M.', 'New York': 'N.Y.', 'North Carolina': 'N.C.',
      'North Dakota': 'N.D.', 'Ohio': 'Ohio', 'Oklahoma': 'Okla.', 'Oregon': 'Ore.', 'Pennsylvania': 'Pa.',
      'Rhode Island': 'R.I.', 'South Carolina': 'S.C.', 'South Dakota': 'S.D.', 'Tennessee': 'Tenn.',
      'Texas': 'Tex.', 'Utah': 'Utah', 'Vermont': 'Vt.', 'Virginia': 'Va.', 'Washington': 'Wash.',
      'West Virginia': 'W.Va.', 'Wisconsin': 'Wis.', 'Wyoming': 'Wyo.', 'District of Columbia': 'D.C.'
    };

    const reverseMap = Object.fromEntries(
      Object.entries(STATE_NAME_MAP).map(([full, abbr]) => [abbr, full])
    );

    const taxMap = {};
    taxData.forEach(entry => {
      const fullName = reverseMap[entry.state];
      if (fullName) {
        taxMap[fullName] = entry["Single Filer"];
      }
    });

    const enriched = {
      ...statesData,
      features: statesData.features.map(feature => {
        const stateName = feature.properties.name;
        const taxValue = taxMap[stateName] || null;

        // Debug log for missing values
        if (taxValue === null) {
          console.warn(`Missing tax value for: ${stateName}`);
        }

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

