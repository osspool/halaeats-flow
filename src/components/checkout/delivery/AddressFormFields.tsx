
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Loader2 } from 'lucide-react';

interface AddressFormFieldsProps {
  name: string;
  street: string;
  apt: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
  isLoading: boolean;
  coordinates: { lat: number; lng: number } | null;
  onNameChange: (value: string) => void;
  onStreetChange: (value: string) => void;
  onAptChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onZipCodeChange: (value: string) => void;
  onIsDefaultChange: (value: boolean) => void;
  onGetCurrentLocation: () => void;
}

const AddressFormFields: React.FC<AddressFormFieldsProps> = ({
  name,
  street,
  apt,
  city,
  state,
  zipCode,
  isDefault,
  isLoading,
  coordinates,
  onNameChange,
  onStreetChange,
  onAptChange,
  onCityChange,
  onStateChange,
  onZipCodeChange,
  onIsDefaultChange,
  onGetCurrentLocation,
}) => {
  return (
    <>
      <div>
        <Label htmlFor="name">Address Name (e.g., Home, Work)</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          required
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="flex-1">
          <Label htmlFor="street">Street Address</Label>
          <Input
            id="street"
            value={street}
            onChange={(e) => onStreetChange(e.target.value)}
            required
          />
        </div>
        
        <Button 
          type="button" 
          variant="outline" 
          size="icon" 
          onClick={onGetCurrentLocation}
          disabled={isLoading}
          className="mt-7"
          aria-label="Get current location"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MapPin className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      <div>
        <Label htmlFor="apt">Apartment, Suite, etc. (optional)</Label>
        <Input
          id="apt"
          value={apt}
          onChange={(e) => onAptChange(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            required
          />
        </div>
        
        <div className="col-span-1">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            value={state}
            onChange={(e) => onStateChange(e.target.value)}
            required
          />
        </div>
        
        <div className="col-span-1">
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input
            id="zipCode"
            value={zipCode}
            onChange={(e) => onZipCodeChange(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isDefault"
          checked={isDefault}
          onChange={(e) => onIsDefaultChange(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <Label htmlFor="isDefault" className="text-sm font-normal">
          Set as default address
        </Label>
      </div>
      
      {coordinates && (
        <div className="bg-muted p-2 rounded text-sm">
          <p>Coordinates: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}</p>
          <p className="text-xs text-muted-foreground">These coordinates will be sent to the delivery service</p>
        </div>
      )}
    </>
  );
};

export default AddressFormFields;
