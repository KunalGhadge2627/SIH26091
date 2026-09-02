import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default Leaflet marker icon path in React/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to dynamically pan/zoom map when coordinates change
const MapRecenter = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 12);
    }
  }, [lat, lng, map]);
  return null;
};

export const LocationMap = ({ 
  lat = 18.6984, 
  lng = 74.1236, 
  villageName = "Shikrapur",
  radiusKm = 10.0,
  competitors = []
}) => {
  const position = [lat, lng];

  return (
    <div className="space-y-2">
      <div className="h-72 w-full border border-gray-200 rounded-xl overflow-hidden shadow-xs relative">
        <MapContainer center={position} zoom={12} scrollWheelZoom={false} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapRecenter lat={lat} lng={lng} />

          {/* Village Center Marker */}
          <Marker position={position}>
            <Popup>
              <div className="text-xs font-semibold">
                <strong>{villageName}</strong> (Selected Village Center)
              </div>
            </Popup>
          </Marker>

          {/* 10km Radius Catchment Circle */}
          <Circle
            center={position}
            radius={radiusKm * 1000}
            pathOptions={{ color: '#2563eb', fillColor: '#3b82f6', fillOpacity: 0.15, weight: 2 }}
          />

          {/* Render Competitor Points */}
          {competitors.map((comp, idx) => (
            <Marker key={idx} position={[comp.latitude, comp.longitude]}>
              <Popup>
                <div className="text-xs">
                  <strong>{comp.name}</strong>
                  <br />
                  Distance: {comp.distance_km || 2.0} km
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Map Legend Overlay */}
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur border border-gray-200 rounded-lg p-2.5 shadow-md text-[10.5px] z-[1000] space-y-1">
          <div className="font-bold text-gray-800 uppercase tracking-wider text-[9px] mb-1">CATCHMENT LEGEND</div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
            <span>10 km Radius Circle</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
            <span>Competitor Shops</span>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-gray-500 leading-snug">
        We analyse nearby villages, local population, business density, and infrastructure within approximately 10 km for the selected business only. Location choices are a limited demo directory for now; full Census and LGD coverage can be connected later.
      </p>
    </div>
  );
};

export default LocationMap;
