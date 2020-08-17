import React from 'react';
import { Map as LeafletMap, TileLayer, Circle, Popup } from "react-leaflet";
import numeral from 'numeral';
import './Map.css';

const casesTypeColors = {
  cases: {
    multiplier: 800,
  },
  recovered: {
    multiplier: 1200,
  },
  deaths: {
    multiplier: 2000,
  },
};

const Map = ({ data, caseType, color, center, zoom }) => {
  console.log('map')
  return (
    <div className="map">
      <LeafletMap center={center} zoom={zoom}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {
          data.map((country) => (
            <Circle
              center={[country.countryInfo.lat, country.countryInfo.long]}
              color={color}
              fillColor={color}
              fillOpacity={0.4}
              radius={Math.sqrt(country[caseType]) * casesTypeColors[caseType].multiplier}
            >
              <Popup>
                <div className="info-container">
                  <div
                    className="info-flag"
                    style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
                  ></div>
                  <div className="info-name">{country.country}</div>
                  <div className="info-confirmed">
                    Cases: {numeral(country.cases).format("0,0")}
                  </div>
                  <div className="info-recovered">
                    Recovered: {numeral(country.recovered).format("0,0")}
                  </div>
                  <div className="info-deaths">
                    Deaths: {numeral(country.deaths).format("0,0")}
                  </div>
                </div>
              </Popup>
            </Circle>)
          )
        }
      </LeafletMap>
    </div>
  );
}

export default Map;