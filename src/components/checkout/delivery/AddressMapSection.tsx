
import React from 'react';
import { Address } from '@/types/checkout';
import AddressMap from '@/components/map/AddressMap';

interface AddressMapSectionProps {
  initialAddress?: Partial<Address>;
  onLocationSelect: (location: { lat: number; lng: number; address?: string }) => void;
}

const AddressMapSection: React.FC<AddressMapSectionProps> = ({ initialAddress, onLocationSelect }) => {
  return (
    <div className="mb-6">
      <AddressMap 
        onLocationSelect={onLocationSelect}
        initialAddress={initialAddress}
        height="300px"
      />
    </div>
  );
};

export default AddressMapSection;
