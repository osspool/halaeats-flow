
import React, { useState, useEffect } from 'react';
import LeafletMap from './LeafletMap';
import LocationSearch from './LocationSearch';
import { Address } from '@/types/checkout';
import { useMap } from './MapContext';

interface AddressMapProps {
  onLocationSelect?: (location: {
    lat: number;
    lng: number;
    address?: string;
  }) => void;
  height?: string;
  className?: string;
  initialAddress?: Partial<Address>;
}

const AddressMap: React.FC<AddressMapProps> = ({
  onLocationSelect,
  height = '350px',
  className = '',
  initialAddress
}) => {
  const { currentLocation, setCurrentLocation } = useMap();
  const [selectedAddress, setSelectedAddress] = useState<string | undefined>(
    initialAddress?.street ? 
    `${initialAddress.street}, ${initialAddress.city}, ${initialAddress.state} ${initialAddress.zipCode}` : 
    undefined
  );

  // Set initial address from props if available
  useEffect(() => {
    if (initialAddress?.street && initialAddress?.city) {
      const addressStr = `${initialAddress.street}, ${initialAddress.city}, ${initialAddress.state} ${initialAddress.zipCode}`;
      setSelectedAddress(addressStr);
      
      // Check if initialAddress has latitude and longitude coordinates
      if (initialAddress.latitude && initialAddress.longitude) {
        const lat = Number(initialAddress.latitude);
        const lng = Number(initialAddress.longitude);
        
        if (!isNaN(lat) && !isNaN(lng)) {
          setCurrentLocation({
            coordinates: [lat, lng],
            address: addressStr,
            name: initialAddress.name || 'Selected Address'
          });
        }
      }
    }
  }, [initialAddress, setCurrentLocation]);

  const handleLocationSelect = (lat: number, lng: number) => {
    if (onLocationSelect) {
      onLocationSelect({
        lat,
        lng,
        address: selectedAddress
      });
    }
  };

  const handleAddressSelect = (address: string) => {
    setSelectedAddress(address);
    
    // If the parent component needs the address too
    if (onLocationSelect && currentLocation) {
      onLocationSelect({
        lat: currentLocation.coordinates[0],
        lng: currentLocation.coordinates[1],
        address
      });
    }
  };

  return (
    <div className={`${className} space-y-3`}>
      <div className="relative">
        <LocationSearch 
          onSelectAddress={handleAddressSelect}
          placeholder="Enter delivery address..."
          className="mb-3"
        />
      </div>
      <LeafletMap 
        height={height} 
        onLocationSelect={handleLocationSelect}
        className="rounded-lg overflow-hidden border border-halaeats-200"
      />
      {selectedAddress && (
        <div className="text-sm text-halaeats-600 mt-2">
          <p className="font-medium">Selected Address:</p>
          <p>{selectedAddress}</p>
        </div>
      )}
    </div>
  );
};

export default AddressMap;
