
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Address } from '@/types/checkout';
import { cn } from '@/lib/utils';
import { Plus, Edit } from 'lucide-react';
import DeliveryAddressForm from './DeliveryAddressForm';

interface AddressListProps {
  addresses: Address[];
  selected: string;
  showAddressForm: boolean;
  addressToEdit: Address | null;
  onAddressChange: (value: string) => void;
  onEditAddress: (address: Address) => void;
  onAddNewAddress: () => void;
  onSaveAddress: (address: Partial<Address>) => void;
  onFormOpenChange: (open: boolean) => void;
}

const AddressList: React.FC<AddressListProps> = ({
  addresses,
  selected,
  showAddressForm,
  addressToEdit,
  onAddressChange,
  onEditAddress,
  onAddNewAddress,
  onSaveAddress,
  onFormOpenChange,
}) => {
  return (
    <div className="space-y-3">
      <RadioGroup
        value={selected}
        onValueChange={onAddressChange}
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
              onClick={() => onEditAddress(address)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </RadioGroup>

      <Sheet open={showAddressForm} onOpenChange={onFormOpenChange}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center w-full py-6 border-dashed"
            onClick={onAddNewAddress}
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
            onSave={onSaveAddress}
            onCancel={() => onFormOpenChange(false)}
            initialAddress={addressToEdit || undefined}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AddressList;
