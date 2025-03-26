
import { useState, useEffect, useCallback } from 'react';
import { OrderType } from '@/types';
import { useDeliveryQuote } from '@/hooks/checkout/useDeliveryQuote';
import { Address } from '@/types/checkout';
import { mockAddresses } from '@/data/checkoutMockData';

interface ValidationProps {
  selectedType: OrderType;
  selectedAddressId?: string;
  selectedSlot: string | null;
  isLoadingTimeSlots: boolean;
  isLoadingQuote: boolean;
  bookTimeSlotMutation: { isPending: boolean };
}

export const useDeliveryMethodValidation = ({
  selectedType,
  selectedAddressId,
  selectedSlot,
  isLoadingTimeSlots,
  isLoadingQuote,
  bookTimeSlotMutation
}: ValidationProps) => {
  const { isQuoteValid } = useDeliveryQuote();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const validateForm = useCallback(() => {
    // If we're loading data, disable the button unless we have what we need
    if (bookTimeSlotMutation.isPending) {
      setIsButtonDisabled(true);
      return;
    }

    // For pickup orders, we just need a time slot
    if (selectedType === 'pickup') {
      const valid = !!selectedSlot && !isLoadingTimeSlots;
      console.log('Pickup validation:', { timeSlotSelected: !!selectedSlot, valid });
      setIsButtonDisabled(!valid);
      return;
    }

    // For delivery orders
    if (selectedType === 'delivery') {
      // We need an address, a time slot, and either a valid quote or loading quote
      const hasAddress = !!selectedAddressId;
      const hasTimeSlot = !!selectedSlot && !isLoadingTimeSlots;
      
      console.log('Delivery validation:', {
        addressSelected: hasAddress,
        timeSlotSelected: hasTimeSlot,
        quoteValid: isQuoteValid(),
        isLoadingQuote
      });
      
      // If we have both address and time slot, we can enable the button
      // We'll check the quote validity in the click handler
      if (hasAddress && hasTimeSlot) {
        setIsButtonDisabled(false);
        return;
      }
      
      setIsButtonDisabled(true);
      return;
    }

    setIsButtonDisabled(true);
  }, [
    selectedType, 
    selectedAddressId, 
    selectedSlot, 
    isLoadingTimeSlots, 
    bookTimeSlotMutation.isPending, 
    isLoadingQuote, 
    isQuoteValid
  ]);

  // Validation logic for continue button
  useEffect(() => {
    validateForm();
  }, [validateForm]);

  // Helper function to get selected address object
  const getSelectedAddress = (): Address | undefined => {
    if (selectedAddressId) {
      return mockAddresses.find(addr => addr.id === selectedAddressId);
    }
    return undefined;
  };

  return {
    isButtonDisabled,
    getSelectedAddress,
    validateForm
  };
};
