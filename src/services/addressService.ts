
import { Address } from '@/types/checkout';

// Mock API functions for address management
export const saveAddress = async (address: Partial<Address>): Promise<Address> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real app, this would save to your backend
  // Here we just return a mock response
  const newAddress: Address = {
    id: `addr_${Math.random().toString(36).substring(2, 10)}`,
    name: address.name || 'New Address',
    street: address.street || '',
    apt: address.apt,
    city: address.city || '',
    state: address.state || '',
    zipCode: address.zipCode || '',
    isDefault: address.isDefault || false,
  };
  
  // Store in localStorage for persistence (just for demo)
  const existingAddresses: Address[] = JSON.parse(localStorage.getItem('userAddresses') || '[]');
  
  // If this is set as default, remove default from others
  const updatedAddresses = address.isDefault 
    ? existingAddresses.map(addr => ({ ...addr, isDefault: false }))
    : [...existingAddresses];
    
  localStorage.setItem('userAddresses', JSON.stringify([...updatedAddresses, newAddress]));
  
  return newAddress;
};

export const getUserAddresses = async (): Promise<Address[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real app, this would fetch from your backend
  // Here we just return from localStorage
  return JSON.parse(localStorage.getItem('userAddresses') || '[]');
};

export const updateAddress = async (address: Address): Promise<Address> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Update address in localStorage
  const existingAddresses: Address[] = JSON.parse(localStorage.getItem('userAddresses') || '[]');
  
  // If this is set as default, remove default from others
  const updatedAddresses = existingAddresses.map(addr => 
    addr.id === address.id 
      ? address 
      : address.isDefault ? { ...addr, isDefault: false } : addr
  );
  
  localStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
  
  return address;
};

export const deleteAddress = async (addressId: string): Promise<boolean> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Delete address from localStorage
  const existingAddresses: Address[] = JSON.parse(localStorage.getItem('userAddresses') || '[]');
  const filteredAddresses = existingAddresses.filter(addr => addr.id !== addressId);
  
  localStorage.setItem('userAddresses', JSON.stringify(filteredAddresses));
  
  return true;
};

// Function to get address from coordinates (reverse geocoding)
// In a real app, this would use a geocoding service like Google Maps, Mapbox, etc.
export const getAddressFromCoordinates = async (
  lat: number, 
  lng: number
): Promise<Partial<Address>> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock response - in a real app, you'd call a geocoding API here
  return {
    street: `${Math.floor(Math.random() * 999)} Sample St`,
    city: 'Toronto',
    state: 'ON',
    zipCode: 'M5V 2L7',
  };
};
