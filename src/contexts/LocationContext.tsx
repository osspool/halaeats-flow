
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { LatLngTuple } from 'leaflet';
import { useMap } from '@/components/map/MapContext';
import { toast } from 'sonner';

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
  buildSearchParams: () => URLSearchParams;
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

  // Function to open location modal
  const openLocationModal = () => setIsLocationModalOpen(true);
  
  // Function to close location modal
  const closeLocationModal = () => setIsLocationModalOpen(false);

  // Function to build search params from current state
  const buildSearchParams = () => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCuisine !== 'All cuisines') params.set('cuisine', selectedCuisine);
    
    if (selectedLocation?.coordinates) {
      params.set('lat', selectedLocation.coordinates[0].toString());
      params.set('lng', selectedLocation.coordinates[1].toString());
      if (selectedLocation.radius) {
        params.set('radius', selectedLocation.radius.toString());
      }
    }
    
    return params;
  };

  // Handle location changes with notification
  const handleSetSelectedLocation = (location: LocationData | null) => {
    setSelectedLocation(location);
    if (location) {
      toast.success(`Location updated to ${location.name}`);
    }
  };

  return (
    <LocationContext.Provider
      value={{
        selectedLocation,
        setSelectedLocation: handleSetSelectedLocation,
        isLocationModalOpen,
        openLocationModal,
        closeLocationModal,
        searchQuery,
        setSearchQuery,
        selectedCuisine,
        setSelectedCuisine,
        buildSearchParams
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
