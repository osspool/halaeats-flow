
import React from 'react';
import { useMapEvents } from 'react-leaflet';
import { LatLng } from 'leaflet';
import { useMap } from './MapContext';

interface MapEventsProps {
  onMapClick?: (latlng: LatLng) => void;
  interactive?: boolean;
}

const MapEvents: React.FC<MapEventsProps> = ({ onMapClick, interactive = true }) => {
  const { setZoomLevel } = useMap();
  
  const map = useMapEvents({
    click: (e) => {
      if (!interactive) return;
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

export default MapEvents;
