
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

  // Determine if button should be enabled based on selections
  useEffect(() => {
    // Basic validation for pickup: just need a time slot
    if (selectedType === 'pickup') {
      setIsButtonDisabled(!selectedSlot);
      return;
    }
    
    // For delivery: need both address and time slot
    const hasRequiredFields = !!selectedAddressId && !!selectedSlot;
    
    console.log("Button state calculated:", { 
      selectedType,
      hasAddress: !!selectedAddressId,
      hasTimeSlot: !!selectedSlot,
      isButtonDisabled: !hasRequiredFields
    });
    
    setIsButtonDisabled(!hasRequiredFields);
  }, [selectedType, selectedAddressId, selectedSlot]);

  const handleContinue = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Continue button clicked');
    
    // For pickup orders, we need a selected slot
    if (selectedType === 'pickup' && selectedSlot) {
      console.log('Pickup order is valid, proceeding to next step');
      onNext();
      return;
    }
    
    // For delivery orders
    if (selectedType === 'delivery') {
      if (selectedAddressId && selectedSlot) {
        // Check if the delivery quote is valid
        const quoteValid = isQuoteValid();
        console.log('Delivery quote validity check result:', quoteValid);
        
        if (quoteValid) {
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
        if (!selectedAddressId) {
          toast.error('Please select a delivery address to continue.');
        } else if (!selectedSlot) {
          toast.error('Please select a time slot to continue.');
        }
        return;
      }
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
