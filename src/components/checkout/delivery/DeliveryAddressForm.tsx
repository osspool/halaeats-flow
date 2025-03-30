
import React from 'react';
import { Address } from '@/types/checkout';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAddressForm } from '@/hooks/useAddressForm';
import AddressMapSection from './AddressMapSection';
import AddressFormFields from './AddressFormFields';
import FormActions from './FormActions';

interface DeliveryAddressFormProps {
  onSave: (address: Partial<Address>) => void;
  onCancel: () => void;
  initialAddress?: Partial<Address>;
}

const DeliveryAddressForm = ({
  onSave,
  onCancel,
  initialAddress,
}: DeliveryAddressFormProps) => {
  const {
    formState: {
      name,
      street,
      apt,
      city,
      state,
      zipCode,
      isDefault,
      coordinates,
      isLoading
    },
    setName,
    setStreet,
    setApt,
    setCity,
    setState,
    setZipCode,
    setIsDefault,
    getCurrentLocation,
    handleMapLocationSelect,
    handleSubmit,
  } = useAddressForm({ initialAddress, onSave, onCancel });

  return (
    <ScrollArea className="h-[calc(100vh-10rem)]">
      <form onSubmit={handleSubmit} className="space-y-4 pr-4">
        <AddressMapSection 
          initialAddress={initialAddress}
          onLocationSelect={handleMapLocationSelect}
        />

        <AddressFormFields 
          name={name}
          street={street}
          apt={apt}
          city={city}
          state={state}
          zipCode={zipCode}
          isDefault={isDefault}
          isLoading={isLoading}
          coordinates={coordinates}
          onNameChange={setName}
          onStreetChange={setStreet}
          onAptChange={setApt}
          onCityChange={setCity}
          onStateChange={setState}
          onZipCodeChange={setZipCode}
          onIsDefaultChange={setIsDefault}
          onGetCurrentLocation={getCurrentLocation}
        />
        
        <FormActions 
          isLoading={isLoading}
          onCancel={onCancel}
        />
      </form>
    </ScrollArea>
  );
};

export default DeliveryAddressForm;
