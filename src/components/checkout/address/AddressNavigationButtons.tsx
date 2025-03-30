
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface AddressNavigationButtonsProps {
  selectedAddressId?: string;
  orderType: 'delivery' | 'pickup';
  onPrevious: () => void;
  onContinue: () => void;
}

const AddressNavigationButtons: React.FC<AddressNavigationButtonsProps> = ({
  selectedAddressId,
  orderType,
  onPrevious,
  onContinue,
}) => {
  return (
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
        onClick={onContinue}
        className="w-full bg-primary hover:bg-cuisine-600"
        disabled={orderType === 'delivery' && !selectedAddressId}
      >
        Continue to Payment
      </Button>
    </div>
  );
};

export default AddressNavigationButtons;
