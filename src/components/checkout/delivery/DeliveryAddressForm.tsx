
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Address } from '@/types/checkout';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [name, setName] = useState(initialAddress?.name || '');
  const [street, setStreet] = useState(initialAddress?.street || '');
  const [apt, setApt] = useState(initialAddress?.apt || '');
  const [city, setCity] = useState(initialAddress?.city || '');
  const [state, setState] = useState(initialAddress?.state || '');
  const [zipCode, setZipCode] = useState(initialAddress?.zipCode || '');
  const [isDefault, setIsDefault] = useState(initialAddress?.isDefault || false);
  const [isLoading, setIsLoading] = useState(false);
  const [coordinates, setCoordinates] = useState<{lat: number, lng: number} | null>(null);

  // Get geolocation from browser
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lng: longitude });
        
        // In a real app, you would use a geocoding service to get the address from coordinates
        // For this mock, we'll just set some demo values
        setStreet('Current Location St');
        setCity('San Francisco');
        setState('CA');
        setZipCode('94105');
        
        setIsLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to retrieve your location');
        setIsLoading(false);
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create the address object with coordinates if available
    const addressData: Partial<Address> = {
      name,
      street,
      apt: apt || undefined,
      city,
      state,
      zipCode,
      isDefault,
      // In a real implementation, you would include these coordinates in your address type
      // and they would be sent to DoorDash
    };
    
    if (coordinates) {
      // This is just for demonstration - in a real app you would include these in your API calls
      console.log('Saving address with coordinates:', coordinates);
    }
    
    onSave(addressData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Address Name (e.g., Home, Work)</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="flex-1">
          <Label htmlFor="street">Street Address</Label>
          <Input
            id="street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            required
          />
        </div>
        
        <Button 
          type="button" 
          variant="outline" 
          size="icon" 
          onClick={getCurrentLocation}
          disabled={isLoading}
          className="mt-7"
        >
          <MapPin className="h-4 w-4" />
        </Button>
      </div>
      
      <div>
        <Label htmlFor="apt">Apartment, Suite, etc. (optional)</Label>
        <Input
          id="apt"
          value={apt}
          onChange={(e) => setApt(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        
        <div className="col-span-1">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
        </div>
        
        <div className="col-span-1">
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input
            id="zipCode"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isDefault"
          checked={isDefault}
          onChange={(e) => setIsDefault(e.target.checked)}
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
      
      <div className="flex space-x-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Address</Button>
      </div>
    </form>
  );
};

export default DeliveryAddressForm;
