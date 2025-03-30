
import { useState } from 'react';
import { useAddressManager } from '@/hooks/useAddressManager';
import AddressList from './AddressList';
import DeliveryInstructions from './DeliveryInstructions';

interface DeliveryFormProps {
  selectedAddressId?: string;
  onAddressSelect: (addressId: string) => void;
  onDeliveryInstructionsChange: (instructions: string) => void;
}

const DeliveryForm = ({
  selectedAddressId,
  onAddressSelect,
  onDeliveryInstructionsChange,
}: DeliveryFormProps) => {
  const [instructions, setInstructions] = useState<string>('');
  
  const {
    addresses,
    selected,
    showAddressForm,
    addressToEdit,
    handleAddressChange,
    handleEditAddress,
    handleAddNewAddress,
    handleSaveAddress,
    setShowAddressForm
  } = useAddressManager({
    initialSelectedId: selectedAddressId,
    onAddressSelect
  });

  const handleInstructionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInstructions(e.target.value);
    onDeliveryInstructionsChange(e.target.value);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium mb-2">Delivery Address</h3>
      <p className="text-sm text-halaeats-600 mb-4">
        Select where you'd like your order delivered
      </p>

      <AddressList 
        addresses={addresses}
        selected={selected}
        showAddressForm={showAddressForm}
        addressToEdit={addressToEdit}
        onAddressChange={handleAddressChange}
        onEditAddress={handleEditAddress}
        onAddNewAddress={handleAddNewAddress}
        onSaveAddress={handleSaveAddress}
        onFormOpenChange={setShowAddressForm}
      />

      <DeliveryInstructions 
        value={instructions}
        onChange={handleInstructionsChange}
      />
    </div>
  );
};

export default DeliveryForm;
