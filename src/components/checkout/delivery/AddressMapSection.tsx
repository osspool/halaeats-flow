
import React from 'react';
import { Address } from '@/types/checkout';
import AddressMap from '@/components/map/AddressMap';

interface AddressMapSectionProps {
  initialAddress?: Partial<Address>;
  onLocationSelect: (location: { lat: number; lng: number; address?: string }) => void;
}

const AddressMapSection: React.FC<AddressMapSectionProps> = ({ initialAddress, onLocationSelect }) => {
  const handleMapLocationSelect = (location: { lat: number; lng: number; address?: string }) => {
    console.log('Location selected in map:', location);
    onLocationSelect(location);
  };

  return (
    <div className="mb-6">
      <h3 className="font-medium mb-2">Select Your Location</h3>
      <p className="text-sm text-halaeats-600 mb-3">
        Search for your address or select a location on the map
      </p>
      <AddressMap 
        onLocationSelect={handleMapLocationSelect}
        initialAddress={initialAddress}
        height="300px"
      />
    </div>
  );
};

export default AddressMapSection;
