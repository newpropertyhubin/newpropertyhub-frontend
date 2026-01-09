import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default icon not appearing
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Component to update map view when center/zoom changes
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const PropertyMap = ({ properties = [], userCenter, center = [20.5937, 78.9629], zoom = 5 }) => { // Default center to India
  // --- Centering Logic Priority ---
  // 1. Prioritize the user's current location if provided.
  // 2. If no user location, but there's only one property, focus on that.
  // 3. Otherwise, fall back to the default center (India).
  let activeCenter = center;
  let activeZoom = zoom;

  if (userCenter) {
    activeCenter = userCenter;
    activeZoom = 13; // Zoom to a city-level view
  } else if (properties.length === 1) {
    const p = properties[0];
    const lat = p.latitude || (p.mapLocation?.coordinates?.[1]);
    const lng = p.longitude || (p.mapLocation?.coordinates?.[0]);
    if (lat && lng) {
      activeCenter = [lat, lng];
      activeZoom = 15; // Zoom closer for a single property
    }
  }

  return (
    <MapContainer center={activeCenter} zoom={activeZoom} style={{ height: '100%', width: '100%', borderRadius: 'inherit', zIndex: 1 }}>
      <ChangeView center={activeCenter} zoom={activeZoom} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {properties.map((property) => {
        let lat = property.latitude;
        let lng = property.longitude;
        if (!lat && !lng && property.mapLocation?.coordinates?.length === 2) {
           lng = property.mapLocation.coordinates[0];
           lat = property.mapLocation.coordinates[1];
        }

        if (lat && lng) {
          return (
            <Marker key={property._id || property.id} position={[lat, lng]}>
              <Popup>
                <strong>{property.title}</strong> <br /> 
                Price: ₹{property.price?.toLocaleString()}
              </Popup>
            </Marker>
          );
        }
        return null;
      })}
    </MapContainer>
  );
};

export default PropertyMap;
