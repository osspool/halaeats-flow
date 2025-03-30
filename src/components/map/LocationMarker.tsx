
import React, { useEffect } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useMap as useMapContext } from './MapContext';

interface LocationMarkerProps {
  draggable?: boolean;
  onDragEnd?: (latlng: L.LatLng) => void;
}

const LocationMarker: React.FC<LocationMarkerProps> = ({ 
  draggable = true,
  onDragEnd
}) => {
  const { currentLocation } = useMapContext();
  const map = useMap();

  // Create a custom icon for the marker
  const markerIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // Center map on marker when location changes
  useEffect(() => {
    if (currentLocation) {
      map.flyTo(currentLocation.coordinates, map.getZoom());
    }
  }, [currentLocation, map]);

  if (!currentLocation) return null;

  return (
    <Marker
      position={currentLocation.coordinates}
      icon={markerIcon}
      draggable={draggable}
      eventHandlers={{
        dragend: (e) => {
          if (onDragEnd) {
            const marker = e.target;
            onDragEnd(marker.getLatLng());
          }
        },
      }}
    >
      <Popup>
        <div className="text-sm">
          {currentLocation.address || 'Selected Location'}
        </div>
      </Popup>
    </Marker>
  );
};

export default LocationMarker;
