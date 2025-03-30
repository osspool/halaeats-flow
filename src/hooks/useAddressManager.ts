
import { useState, useEffect } from 'react';
import { Address } from '@/types/checkout';
import { getUserAddresses, saveAddress, updateAddress } from '@/services/addressService';

interface UseAddressManagerProps {
  initialSelectedId?: string;
  onAddressSelect?: (addressId: string) => void;
}

export const useAddressManager = ({ initialSelectedId, onAddressSelect }: UseAddressManagerProps) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selected, setSelected] = useState<string>(initialSelectedId || '');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load addresses on mount
  useEffect(() => {
    const loadAddresses = async () => {
      setIsLoading(true);
      try {
        const loadedAddresses = await getUserAddresses();
        setAddresses(loadedAddresses);
        
        // Set default address if none is selected
        if (!selected && loadedAddresses.length > 0) {
          const defaultAddress = loadedAddresses.find(a => a.isDefault)?.id || loadedAddresses[0].id;
          setSelected(defaultAddress);
          if (onAddressSelect) {
            onAddressSelect(defaultAddress);
          }
        }
      } catch (error) {
        console.error('Error loading addresses:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAddresses();
  }, [selected, onAddressSelect]);

  const handleAddressChange = (value: string) => {
    setSelected(value);
    if (onAddressSelect) {
      onAddressSelect(value);
    }
  };

  const handleEditAddress = (address: Address) => {
    setAddressToEdit(address);
    setShowAddressForm(true);
  };

  const handleAddNewAddress = () => {
    setAddressToEdit(null);
    setShowAddressForm(true);
  };

  const handleSaveAddress = async (addressData: Partial<Address>) => {
    setIsLoading(true);
    try {
      if (addressToEdit) {
        // Update existing address
        const updatedAddress = await updateAddress({
          ...addressToEdit,
          ...addressData
        } as Address);
        
        // Update addresses in state
        setAddresses(prevAddresses => 
          prevAddresses.map(addr => 
            addr.id === updatedAddress.id ? updatedAddress : addr
          )
        );
      } else {
        // Add new address
        const newAddress = await saveAddress(addressData);
        setAddresses(prevAddresses => [...prevAddresses, newAddress]);
        setSelected(newAddress.id);
        if (onAddressSelect) {
          onAddressSelect(newAddress.id);
        }
      }
    } catch (error) {
      console.error('Error saving address:', error);
    } finally {
      setIsLoading(false);
      setShowAddressForm(false);
      setAddressToEdit(null);
    }
  };

  return {
    addresses,
    selected,
    showAddressForm,
    addressToEdit,
    isLoading,
    handleAddressChange,
    handleEditAddress,
    handleAddNewAddress,
    handleSaveAddress,
    setShowAddressForm
  };
};
