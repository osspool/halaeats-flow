
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useMap as useMapContext } from './MapContext';
import LocationMarker from './LocationMarker';

// Fix Leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapEventsProps {
  onMapClick?: (latlng: L.LatLng) => void;
}

// Component to handle map events
const MapEvents: React.FC<MapEventsProps> = ({ onMapClick }) => {
  const { setZoomLevel } = useMapContext();
  
  const map = useMapEvents({
    click: (e) => {
      if (onMapClick) {
        onMapClick(e.latlng);
      }
    },
    zoom: () => {
      setZoomLevel(map.getZoom());
    }
  });
  
  return null;
};

interface LeafletMapProps {
  height?: string;
  className?: string;
  onLocationSelect?: (lat: number, lng: number) => void;
  interactive?: boolean;
}

const LeafletMap: React.FC<LeafletMapProps> = ({
  height = '400px',
  className = '',
  onLocationSelect,
  interactive = true
}) => {
  const { 
    defaultLocation, 
    isLoadingLocation, 
    zoomLevel,
    setCurrentLocation
  } = useMapContext();

  const handleMapClick = (latlng: L.LatLng) => {
    if (!interactive) return;
    
    // Update current location in context
    setCurrentLocation({
      coordinates: [latlng.lat, latlng.lng],
      address: 'Selected Location',
    });
    
    // Callback for parent components
    if (onLocationSelect) {
      onLocationSelect(latlng.lat, latlng.lng);
    }
  };

  const handleMarkerDragEnd = (latlng: L.LatLng) => {
    if (!interactive) return;
    
    setCurrentLocation({
      coordinates: [latlng.lat, latlng.lng],
      address: 'Moved Location',
    });
    
    if (onLocationSelect) {
      onLocationSelect(latlng.lat, latlng.lng);
    }
  };

  if (isLoadingLocation) {
    return <div className="flex justify-center items-center" style={{ height }}>Loading map...</div>;
  }

  return (
    <div className={className} style={{ height }}>
      <MapContainer
        center={defaultLocation}
        zoom={zoomLevel}
        style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
        scrollWheelZoom={interactive}
        dragging={interactive}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {interactive && <MapEvents onMapClick={handleMapClick} />}
        <LocationMarker draggable={interactive} onDragEnd={handleMarkerDragEnd} />
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
