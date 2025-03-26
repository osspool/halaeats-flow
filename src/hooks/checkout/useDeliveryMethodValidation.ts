
import { useState, useEffect } from 'react';
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

  // Validation logic for continue button
  useEffect(() => {
    // If we're loading data, disable the button
    if (bookTimeSlotMutation.isPending || isLoadingTimeSlots) {
      setIsButtonDisabled(true);
      return;
    }

    // For pickup orders, we just need a time slot
    if (selectedType === 'pickup') {
      setIsButtonDisabled(!selectedSlot);
      return;
    }

    // For delivery orders
    if (selectedType === 'delivery') {
      // We need an address, a time slot, and either a valid quote or loading quote
      const hasAddress = !!selectedAddressId;
      const hasTimeSlot = !!selectedSlot;
      const quoteValid = isQuoteValid();
      
      console.log('Delivery validation:', {
        addressSelected: hasAddress,
        timeSlotSelected: hasTimeSlot,
        quoteValid
      });
      
      // If we have an address and a time slot, we can enable the button even if we're still loading the quote
      if (hasAddress && hasTimeSlot && isLoadingQuote) {
        setIsButtonDisabled(false);
        return;
      }
      
      setIsButtonDisabled(!hasAddress || !hasTimeSlot || !quoteValid);
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

  // Helper function to get selected address object
  const getSelectedAddress = (): Address | undefined => {
    if (selectedAddressId) {
      return mockAddresses.find(addr => addr.id === selectedAddressId);
    }
    return undefined;
  };

  return {
    isButtonDisabled,
    getSelectedAddress
  };
};
