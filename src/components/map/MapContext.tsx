
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LatLngTuple } from 'leaflet';

// Toronto coordinates as default
const DEFAULT_COORDINATES: LatLngTuple = [43.6532, -79.3832];
const DEFAULT_ZOOM = 13;

export interface MapLocation {
  coordinates: LatLngTuple;
  address?: string;
  name?: string;
}

interface MapContextType {
  currentLocation: MapLocation | null;
  setCurrentLocation: (location: MapLocation | null) => void;
  defaultLocation: LatLngTuple;
  isLoadingLocation: boolean;
  zoomLevel: number;
  setZoomLevel: (zoom: number) => void;
  searchAddress: (query: string) => Promise<MapLocation[]>;
  selectLocation: (location: MapLocation) => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider = ({ children }: { children: ReactNode }) => {
  const [currentLocation, setCurrentLocation] = useState<MapLocation | null>(null);
  const [defaultLocation, setDefaultLocation] = useState<LatLngTuple>(DEFAULT_COORDINATES);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(DEFAULT_ZOOM);

  // Try to get the user's current position on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setDefaultLocation([latitude, longitude]);
          setCurrentLocation({
            coordinates: [latitude, longitude],
            address: 'Current Location',
          });
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoadingLocation(false);
          // Fall back to Toronto if geolocation fails
        }
      );
    } else {
      setIsLoadingLocation(false);
    }
  }, []);

  // Mock function to search for addresses (would be replaced with a real geocoding API)
  const searchAddress = async (query: string): Promise<MapLocation[]> => {
    // In a real implementation, this would call a geocoding API
    // For now, just return a mock result
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!query.trim()) {
          resolve([]);
          return;
        }
        
        resolve([
          {
            coordinates: [defaultLocation[0] + 0.01, defaultLocation[1] + 0.01],
            address: `${query}, Toronto, ON`,
            name: query
          },
          {
            coordinates: [defaultLocation[0] - 0.01, defaultLocation[1] - 0.01],
            address: `${query} Avenue, Toronto, ON`,
            name: `${query} Avenue`
          }
        ]);
      }, 500);
    });
  };

  const selectLocation = (location: MapLocation) => {
    setCurrentLocation(location);
  };

  return (
    <MapContext.Provider
      value={{
        currentLocation,
        setCurrentLocation,
        defaultLocation,
        isLoadingLocation,
        zoomLevel,
        setZoomLevel,
        searchAddress,
        selectLocation
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export const useMap = (): MapContextType => {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
};
