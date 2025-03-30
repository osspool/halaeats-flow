
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LatLngTuple } from 'leaflet';
import { getAddressFromCoordinates } from '@/services/addressService';

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
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Get address from coordinates
          try {
            const addressData = await getAddressFromCoordinates(latitude, longitude);
            const formattedAddress = `${addressData.street}, ${addressData.city}, ${addressData.state} ${addressData.zipCode}`;
            
            setDefaultLocation([latitude, longitude]);
            setCurrentLocation({
              coordinates: [latitude, longitude],
              address: formattedAddress,
              name: 'Current Location'
            });
          } catch (error) {
            // If reverse geocoding fails, just use coordinates
            setDefaultLocation([latitude, longitude]);
            setCurrentLocation({
              coordinates: [latitude, longitude],
              address: 'Current Location',
            });
          }
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

  // Real function to search for addresses using OpenStreetMap Nominatim API
  const searchAddress = async (query: string): Promise<MapLocation[]> => {
    if (!query.trim()) {
      return [];
    }
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
        {
          headers: {
            "User-Agent": "HalaEatsApp/1.0"
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        return [];
      }
      
      // Transform the results to our MapLocation format
      return data.map(item => ({
        coordinates: [parseFloat(item.lat), parseFloat(item.lon)] as LatLngTuple,
        address: item.display_name,
        name: item.display_name.split(',')[0]
      }));
    } catch (error) {
      console.error('Error searching for location:', error);
      return [];
    }
  };

  const selectLocation = (location: MapLocation) => {
    setCurrentLocation(location);
  };

  const value: MapContextType = {
    currentLocation,
    setCurrentLocation,
    defaultLocation,
    isLoadingLocation,
    zoomLevel,
    setZoomLevel,
    searchAddress,
    selectLocation
  };

  return (
    <MapContext.Provider value={value}>
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
