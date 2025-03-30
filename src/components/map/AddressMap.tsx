
import React, { useState } from 'react';
import { MapProvider } from './MapContext';
import LeafletMap from './LeafletMap';
import LocationSearch from './LocationSearch';
import { Address } from '@/types/checkout';

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
  const [selectedAddress, setSelectedAddress] = useState<string | undefined>(
    initialAddress?.street ? 
    `${initialAddress.street}, ${initialAddress.city}, ${initialAddress.state} ${initialAddress.zipCode}` : 
    undefined
  );

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
    if (onLocationSelect) {
      // We don't have exact coordinates here, but the map component will update them
      // This is just to ensure the address gets passed along
      onLocationSelect({
        lat: 0,
        lng: 0,
        address
      });
    }
  };

  return (
    <MapProvider>
      <div className={`${className} space-y-3`}>
        <LocationSearch 
          onSelectAddress={handleAddressSelect}
          placeholder="Enter delivery address..."
        />
        <LeafletMap 
          height={height} 
          onLocationSelect={handleLocationSelect}
          className="rounded-lg overflow-hidden border border-halaeats-200"
        />
        {selectedAddress && (
          <div className="text-sm text-halaeats-600">
            <p className="font-medium">Selected Address:</p>
            <p>{selectedAddress}</p>
          </div>
        )}
      </div>
    </MapProvider>
  );
};

export default AddressMap;
