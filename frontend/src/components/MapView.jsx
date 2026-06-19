import React, { useEffect, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  useMap,
  CircleMarker,
} from 'react-leaflet';
import L from 'leaflet';

// Fix default icon issue with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom colored markers
function createColoredIcon(color, label) {
  return L.divIcon({
    className: '',
    html: `
      <div style="
        width:36px;height:36px;border-radius:50% 50% 50% 0;
        background:${color};border:3px solid #0f1e35;
        transform:rotate(-45deg);
        box-shadow:0 0 16px ${color}80;
        display:flex;align-items:center;justify-content:center;
      ">
        <span style="
          transform:rotate(45deg);
          font-size:10px;font-weight:700;
          color:#050a14;font-family:'Exo 2',sans-serif;
        ">${label}</span>
      </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -40],
  });
}

const startIcon = createColoredIcon('#00e5ff', 'S');
const endIcon   = createColoredIcon('#00ff94', 'E');

// Component that auto-fits the map bounds to the route
function FitBounds({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [48, 48], maxZoom: 13 });
    }
  }, [bounds, map]);
  return null;
}

const MAIN_COLOR = '#00e5ff';
const ALT_COLOR  = '#00ff94';
const MAIN_OPTIONS = { color: MAIN_COLOR, weight: 5, opacity: 0.85, dashArray: null };
const ALT_OPTIONS  = { color: ALT_COLOR,  weight: 4, opacity: 0.75, dashArray: '8 6' };

export default function MapView({ data, activeRoute }) {
  const defaultCenter = [20.5937, 78.9629]; // India center
  const defaultZoom   = 5;

  if (!data) {
    return (
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Welcome overlay */}
        <div
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 999, pointerEvents: 'none',
          }}
        >
          <div style={{
            background: 'rgba(5,10,20,0.85)',
            border: '1px solid #1a2f4a',
            borderRadius: 16,
            padding: '24px 36px',
            textAlign: 'center',
          }}>
            <p style={{ color: '#00e5ff', fontFamily: "'Exo 2',sans-serif", fontWeight: 700, fontSize: 18, margin: 0 }}>
              NexusRoute AI
            </p>
            <p style={{ color: '#3a5270', fontFamily: "'DM Sans',sans-serif", fontSize: 13, marginTop: 6 }}>
              Enter two cities to visualize routes
            </p>
          </div>
        </div>
      </MapContainer>
    );
  }

  const { origin, destination, main_route, alternative_route } = data;

  const mainPolyline = main_route.polyline.map(p => [p.lat, p.lng]);
  const altPolyline  = alternative_route.polyline.map(p => [p.lat, p.lng]);

  // Bounds from main route
  const allPoints = [...mainPolyline, ...altPolyline];
  const bounds = L.latLngBounds(allPoints);

  // Highlight active route
  const mainOpts = { ...MAIN_OPTIONS, weight: activeRoute === 'main' ? 7 : 4, opacity: activeRoute === 'alternative' ? 0.35 : 0.85 };
  const altOpts  = { ...ALT_OPTIONS,  weight: activeRoute === 'alternative' ? 7 : 3, opacity: activeRoute === 'main' ? 0.35 : 0.75 };

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      style={{ height: '100%', width: '100%' }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitBounds bounds={allPoints} />

      {/* Alternative route (drawn first, below) */}
      <Polyline positions={altPolyline} pathOptions={altOpts}>
        <Popup>
          <div className="text-sm">
            <strong style={{ color: ALT_COLOR }}>Alternative Route</strong><br />
            {alternative_route.distance_km} km · {alternative_route.duration_min} min
          </div>
        </Popup>
      </Polyline>

      {/* Main route */}
      <Polyline positions={mainPolyline} pathOptions={mainOpts}>
        <Popup>
          <div className="text-sm">
            <strong style={{ color: MAIN_COLOR }}>Main Route</strong><br />
            {main_route.distance_km} km · {main_route.duration_min} min
          </div>
        </Popup>
      </Polyline>

      {/* Start marker */}
      <Marker position={[origin.lat, origin.lng]} icon={startIcon}>
        <Popup>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>
            <strong style={{ color: '#00e5ff' }}>Start</strong><br />
            {origin.label}
          </div>
        </Popup>
      </Marker>

      {/* End marker */}
      <Marker position={[destination.lat, destination.lng]} icon={endIcon}>
        <Popup>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>
            <strong style={{ color: '#00ff94' }}>Destination</strong><br />
            {destination.label}
          </div>
        </Popup>
      </Marker>

      {/* Midpoint pulse */}
      {main_route.polyline[Math.floor(main_route.polyline.length / 2)] && (
        <CircleMarker
          center={[
            main_route.polyline[Math.floor(main_route.polyline.length / 2)].lat,
            main_route.polyline[Math.floor(main_route.polyline.length / 2)].lng,
          ]}
          radius={6}
          pathOptions={{ color: '#ffb800', fillColor: '#ffb800', fillOpacity: 0.8, weight: 2 }}
        >
          <Popup>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>
              <strong style={{ color: '#ffb800' }}>Route Midpoint</strong><br />
              Weather monitored here
            </div>
          </Popup>
        </CircleMarker>
      )}
    </MapContainer>
  );
}
