
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { LatLngTuple } from 'leaflet';
import { useMap } from '@/components/map/MapContext';

export interface LocationData {
  name: string;
  address?: string;
  coordinates: LatLngTuple;
  radius?: number;
}

interface LocationContextType {
  selectedLocation: LocationData | null;
  setSelectedLocation: (location: LocationData | null) => void;
  isLocationModalOpen: boolean;
  openLocationModal: () => void;
  closeLocationModal: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCuisine: string;
  setSelectedCuisine: (cuisine: string) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const { currentLocation } = useMap();
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All cuisines');

  // Update selectedLocation when currentLocation changes
  useEffect(() => {
    if (currentLocation && !selectedLocation) {
      setSelectedLocation({
        name: currentLocation.name || 'Current Location',
        address: currentLocation.address,
        coordinates: currentLocation.coordinates,
        radius: 5, // Default radius in km
      });
    }
  }, [currentLocation, selectedLocation]);

  const openLocationModal = () => setIsLocationModalOpen(true);
  const closeLocationModal = () => setIsLocationModalOpen(false);

  return (
    <LocationContext.Provider
      value={{
        selectedLocation,
        setSelectedLocation,
        isLocationModalOpen,
        openLocationModal,
        closeLocationModal,
        searchQuery,
        setSearchQuery,
        selectedCuisine,
        setSelectedCuisine
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
