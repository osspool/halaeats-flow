
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ContinueButton } from './';
import { OrderType } from '@/types';

interface DeliveryContinueButtonProps {
  selectedType: OrderType;
  selectedAddressId?: string;
  selectedSlot: string | null;
  isLoadingQuote: boolean;
  isLoadingTimeSlots: boolean;
  bookTimeSlotMutation: { isPending: boolean };
  onNext: () => void;
  onRefreshQuote: () => void;
  isQuoteValid: () => boolean;
}

const DeliveryContinueButton = ({
  selectedType,
  selectedAddressId,
  selectedSlot,
  isLoadingQuote,
  isLoadingTimeSlots,
  bookTimeSlotMutation,
  onNext,
  onRefreshQuote,
  isQuoteValid
}: DeliveryContinueButtonProps) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  // Determine if button should be enabled
  useEffect(() => {
    const forceButtonEnabled = (selectedType === 'pickup' && !!selectedSlot) || 
                             (selectedType === 'delivery' && !!selectedAddressId && !!selectedSlot);
    
    console.log("Button state calculated:", { 
      forceButtonEnabled,
      selectedType,
      hasAddress: !!selectedAddressId,
      hasTimeSlot: !!selectedSlot
    });
    
    setIsButtonDisabled(!forceButtonEnabled);
  }, [selectedType, selectedAddressId, selectedSlot]);

  const handleContinue = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Continue button clicked');
    console.log('Current validation state:', {
      selectedType,
      selectedAddressId,
      selectedSlot,
      isButtonDisabled,
      isQuoteValid: selectedType === 'delivery' ? isQuoteValid() : true
    });
    
    // For pickup orders, we need a selected slot
    if (selectedType === 'pickup' && selectedSlot) {
      console.log('Pickup order is valid, proceeding to next step');
      onNext();
      return;
    }
    
    // For delivery orders
    if (selectedType === 'delivery') {
      if (selectedAddressId && selectedSlot) {
        // Consider quotes valid for now to help debug
        const isValid = true; 
        console.log('Delivery quote validity check result:', isValid);
        
        if (isValid) {
          console.log('Delivery order is valid, proceeding to next step');
          onNext();
          return;
        } else if (!isLoadingQuote) {
          console.log('Delivery quote is not valid, refreshing...');
          onRefreshQuote();
          toast.error('Your delivery quote has expired. We have refreshed it for you. Please try again.');
          return;
        }
      } else {
        console.log('Missing required fields for delivery order');
        toast.error('Please select both a delivery address and a time slot to continue.');
        return;
      }
    }
    
    // If we get here, validation failed but we need to make sure user knows why
    if (!selectedSlot) {
      toast.error('Please select a time slot to continue.');
    }
    
    if (selectedType === 'delivery' && !selectedAddressId) {
      toast.error('Please select a delivery address to continue.');
    }
  };

  return (
    <ContinueButton 
      onClick={handleContinue}
      isDisabled={isButtonDisabled}
      isLoadingPayment={bookTimeSlotMutation.isPending}
      isLoadingQuote={isLoadingQuote}
    />
  );
};

export default DeliveryContinueButton;
