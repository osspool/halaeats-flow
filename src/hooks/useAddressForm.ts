
import { useState } from 'react';
import { Address } from '@/types/checkout';
import { getAddressFromCoordinates } from '@/services/addressService';
import { toast } from 'sonner';

interface UseAddressFormProps {
  initialAddress?: Partial<Address>;
  onSave: (address: Partial<Address>) => void;
  onCancel: () => void;
}

export const useAddressForm = ({ initialAddress, onSave, onCancel }: UseAddressFormProps) => {
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

  return {
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
    onCancel
  };
};
