
import { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Address } from '@/types/checkout';
import { cn } from '@/lib/utils';
import { Plus, MapPin, Edit } from 'lucide-react';
import { mockAddresses } from '@/data/checkoutMockData';
import DeliveryAddressForm from './DeliveryAddressForm';

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
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [selected, setSelected] = useState<string>(selectedAddressId || '');
  const [instructions, setInstructions] = useState<string>('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState<Address | null>(null);

  // Set default address if none is selected
  useEffect(() => {
    if (!selected && addresses.length > 0) {
      const defaultAddress = addresses.find(a => a.isDefault)?.id || addresses[0].id;
      console.log('Setting default address:', defaultAddress);
      setSelected(defaultAddress);
      onAddressSelect(defaultAddress);
    }
  }, [addresses, selected, onAddressSelect]);

  const handleAddressChange = (value: string) => {
    console.log('Address changed to:', value);
    setSelected(value);
    onAddressSelect(value);
  };

  const handleInstructionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInstructions(e.target.value);
    onDeliveryInstructionsChange(e.target.value);
  };

  const handleEditAddress = (address: Address) => {
    setAddressToEdit(address);
    setShowAddressForm(true);
  };

  const handleSaveAddress = (addressData: Partial<Address>) => {
    if (addressToEdit) {
      // Edit existing address
      const updatedAddresses = addresses.map(addr => 
        addr.id === addressToEdit.id 
          ? { ...addr, ...addressData } 
          : addressData.isDefault ? { ...addr, isDefault: false } : addr
      );
      setAddresses(updatedAddresses);
    } else {
      // Add new address
      const newAddress: Address = {
        id: `addr_${Math.random().toString(36).substring(2, 10)}`,
        name: addressData.name || 'New Address',
        street: addressData.street || '',
        apt: addressData.apt,
        city: addressData.city || '',
        state: addressData.state || '',
        zipCode: addressData.zipCode || '',
        isDefault: addressData.isDefault || false,
      };
      
      // If this is set as default, remove default from others
      const updatedAddresses = addressData.isDefault 
        ? addresses.map(addr => ({ ...addr, isDefault: false }))
        : [...addresses];
      
      setAddresses([...updatedAddresses, newAddress]);
      setSelected(newAddress.id);
      onAddressSelect(newAddress.id);
    }
    
    setShowAddressForm(false);
    setAddressToEdit(null);
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
              "flex items-start space-x-3 border rounded-lg p-4 transition-colors relative",
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
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute top-2 right-2 h-8 w-8 p-0"
              onClick={() => handleEditAddress(address)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        ))}

        <Sheet open={showAddressForm} onOpenChange={setShowAddressForm}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center w-full py-6 border-dashed"
              onClick={() => {
                setAddressToEdit(null);
                setShowAddressForm(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Address
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md">
            <SheetTitle className="text-lg font-medium mb-4">
              {addressToEdit ? 'Edit Address' : 'Add New Address'}
            </SheetTitle>
            <SheetDescription className="sr-only">
              Enter the address details
            </SheetDescription>
            <DeliveryAddressForm
              onSave={handleSaveAddress}
              onCancel={() => {
                setShowAddressForm(false);
                setAddressToEdit(null);
              }}
              initialAddress={addressToEdit || undefined}
            />
          </SheetContent>
        </Sheet>
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
