
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Address } from '@/types/checkout';
import { useAddressManager } from '@/hooks/useAddressManager';
import DeliveryAddressForm from './delivery/DeliveryAddressForm';
import AddressList from './delivery/AddressList';
import PickupDetails from './address/PickupDetails';
import AddressNavigationButtons from './address/AddressNavigationButtons';

interface AddressStepProps {
  selectedAddressId?: string;
  orderType: 'delivery' | 'pickup';
  onAddressSelect: (addressId: string) => void;
  onDeliveryInstructionsChange: (instructions: string) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const AddressStep = ({
  selectedAddressId,
  orderType,
  onAddressSelect,
  onDeliveryInstructionsChange,
  onNext,
  onPrevious,
}: AddressStepProps) => {
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

  const handleContinue = () => {
    if (!selected && orderType === 'delivery') return;
    onNext();
  };

  if (orderType === 'pickup') {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-medium">Pickup Details</h2>
        <PickupDetails />
        
        <AddressNavigationButtons
          orderType={orderType}
          onPrevious={onPrevious}
          onContinue={handleContinue}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium">Delivery Address</h2>
      <p className="text-halaeats-600 mb-6">
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

      <div className="pt-4">
        <h3 className="font-medium mb-2">Delivery Instructions (Optional)</h3>
        <Textarea
          placeholder="Add any special instructions for delivery..."
          className="mb-4"
          value={instructions}
          onChange={handleInstructionsChange}
        />

        <AddressNavigationButtons
          selectedAddressId={selected}
          orderType={orderType}
          onPrevious={onPrevious}
          onContinue={handleContinue}
        />
      </div>
    </div>
  );
};

export default AddressStep;
