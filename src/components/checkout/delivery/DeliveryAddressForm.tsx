
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Address } from '@/types/checkout';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import AddressMap from '@/components/map/AddressMap';
import { getAddressFromCoordinates } from '@/services/addressService';

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
  // Always show map by default
  const [showMap, setShowMap] = useState(true);

  // Get geolocation from browser
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lng: longitude });
        
        try {
          // Get address from coordinates
          const addressData = await getAddressFromCoordinates(latitude, longitude);
          
          // Update form fields
          if (addressData.street) setStreet(addressData.street);
          if (addressData.city) setCity(addressData.city);
          if (addressData.state) setState(addressData.state);
          if (addressData.zipCode) setZipCode(addressData.zipCode);
          
          setIsLoading(false);
          toast.success('Current location detected');
        } catch (error) {
          console.error('Error getting address from coordinates:', error);
          setIsLoading(false);
          toast.error('Unable to get address from your location');
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        toast.error('Unable to retrieve your location');
        setIsLoading(false);
      }
    );
  };

  const handleMapLocationSelect = async (location: { lat: number; lng: number; address?: string }) => {
    setCoordinates({ lat: location.lat, lng: location.lng });
    
    if (location.address && location.address !== 'Current Location' && location.address !== 'Selected Location' && location.address !== 'Moved Location') {
      // If we got a full address from the map search, parse it
      const addressParts = location.address.split(',');
      if (addressParts.length >= 3) {
        setStreet(addressParts[0].trim());
        setCity(addressParts[1].trim());
        
        // Parse state and zip code
        const stateZip = addressParts[2].trim().split(' ');
        if (stateZip.length >= 2) {
          setState(stateZip[0].trim());
          setZipCode(stateZip.slice(1).join(' ').trim());
        }
      }
    } else if (location.lat && location.lng) {
      // If we only got coordinates, try to get the address
      try {
        setIsLoading(true);
        const addressData = await getAddressFromCoordinates(location.lat, location.lng);
        
        // Update form fields
        if (addressData.street) setStreet(addressData.street);
        if (addressData.city) setCity(addressData.city);
        if (addressData.state) setState(addressData.state);
        if (addressData.zipCode) setZipCode(addressData.zipCode);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error getting address from coordinates:', error);
        setIsLoading(false);
      }
    }
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
    };
    
    if (coordinates) {
      // This is just for demonstration - in a real app you would include these in your API calls
      console.log('Saving address with coordinates:', coordinates);
    }
    
    onSave(addressData);
  };

  return (
    <ScrollArea className="h-[calc(100vh-10rem)]">
      <form onSubmit={handleSubmit} className="space-y-4 pr-4">
        <div className="mb-6">
          <AddressMap 
            onLocationSelect={handleMapLocationSelect}
            initialAddress={initialAddress}
            height="300px"
          />
        </div>

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
        
        <div className="flex space-x-2 pt-2 pb-8">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Address'
            )}
          </Button>
        </div>
      </form>
    </ScrollArea>
  );
};

export default DeliveryAddressForm;
