
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Address } from '@/types/checkout';
import { cn } from '@/lib/utils';
import { ArrowLeft, Check, Plus, MapPin } from 'lucide-react';
import { mockAddresses } from '@/data/checkoutMockData';

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
  const [addresses] = useState<Address[]>(mockAddresses);
  const [selected, setSelected] = useState<string>(selectedAddressId || addresses.find(a => a.isDefault)?.id || '');
  const [instructions, setInstructions] = useState<string>('');

  const handleAddressChange = (value: string) => {
    setSelected(value);
    onAddressSelect(value);
  };

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
        <div className="bg-halaeats-50 p-4 rounded-lg">
          <h3 className="font-medium text-halaeats-800 mb-2">Spice Delight</h3>
          <p className="text-sm text-halaeats-600 mb-1">123 Food Street, San Francisco, CA 94105</p>
          <p className="text-sm text-halaeats-600">Open: 11:00 AM - 9:00 PM</p>
        </div>
        
        <div className="pt-4">
          <Button
            variant="outline"
            className="mb-4"
            onClick={onPrevious}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <Button 
            onClick={handleContinue}
            className="w-full bg-primary hover:bg-cuisine-600"
          >
            Continue to Payment
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium">Delivery Address</h2>
      <p className="text-halaeats-600 mb-6">
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

      <div className="pt-4">
        <h3 className="font-medium mb-2">Delivery Instructions (Optional)</h3>
        <Textarea
          placeholder="Add any special instructions for delivery..."
          className="mb-4"
          value={instructions}
          onChange={handleInstructionsChange}
        />

        <Button
          variant="outline"
          className="mb-4"
          onClick={onPrevious}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <Button 
          onClick={handleContinue}
          className="w-full bg-primary hover:bg-cuisine-600"
          disabled={!selected}
        >
          Continue to Payment
        </Button>
      </div>
    </div>
  );
};

export default AddressStep;
