
import { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Address } from '@/types/checkout';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { mockAddresses } from '@/data/checkoutMockData';

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
  const [addresses] = useState<Address[]>(mockAddresses);
  const [selected, setSelected] = useState<string>(selectedAddressId || '');
  const [instructions, setInstructions] = useState<string>('');

  // Set default address if none is selected
  useEffect(() => {
    if (!selected && addresses.length > 0) {
      const defaultAddress = addresses.find(a => a.isDefault)?.id || addresses[0].id;
      setSelected(defaultAddress);
      onAddressSelect(defaultAddress);
    }
  }, [addresses, selected, onAddressSelect]);

  const handleAddressChange = (value: string) => {
    setSelected(value);
    onAddressSelect(value);
  };

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

      <RadioGroup
        value={selected}
        onValueChange={handleAddressChange}
        className="space-y-3"
      >
        {addresses.map((address) => (
          <div
            key={address.id}
            className={cn(
              "flex items-start space-x-3 border rounded-lg p-4 transition-colors",
              selected === address.id
                ? "border-primary bg-primary/5"
                : "border-halaeats-200"
            )}
          >
            <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
            <div className="flex-1">
              <Label
                htmlFor={address.id}
                className="font-medium flex items-center cursor-pointer"
              >
                {address.name}
                {address.isDefault && (
                  <span className="ml-2 bg-halaeats-100 text-halaeats-700 text-xs px-2 py-0.5 rounded-full">
                    Default
                  </span>
                )}
              </Label>
              <p className="text-sm text-halaeats-600 mt-1">
                {address.street}{address.apt ? `, ${address.apt}` : ''}
              </p>
              <p className="text-sm text-halaeats-600">
                {address.city}, {address.state} {address.zipCode}
              </p>
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          className="flex items-center w-full py-6 border-dashed"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Address
        </Button>
      </RadioGroup>

      <div className="mt-4">
        <h3 className="font-medium mb-2">Delivery Instructions (Optional)</h3>
        <Textarea
          placeholder="Add any special instructions for delivery..."
          value={instructions}
          onChange={handleInstructionsChange}
        />
      </div>
    </div>
  );
};

export default DeliveryForm;
