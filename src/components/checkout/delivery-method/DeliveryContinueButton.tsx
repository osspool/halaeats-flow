
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
  const [pendingNext, setPendingNext] = useState(false);
  const [refreshAttempts, setRefreshAttempts] = useState(0);

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

  // If we're waiting for a quote refresh to complete, go to next step once loading is done
  useEffect(() => {
    if (pendingNext && !isLoadingQuote) {
      setPendingNext(false);
      
      // Add a small delay to ensure the quote is set in state
      setTimeout(() => {
        // Verify the quote is now valid
        if (isQuoteValid()) {
          // Reset refresh attempts when successful
          setRefreshAttempts(0);
          onNext();
        } else {
          // If we've tried to refresh multiple times, show a more detailed error
          if (refreshAttempts >= 2) {
            toast.error('We\'re having trouble getting a delivery quote. Please try a different time slot or address.');
            setRefreshAttempts(0);
          } else {
            toast.error('Could not get a valid delivery quote. Please try again.');
            setRefreshAttempts(prev => prev + 1);
          }
        }
      }, 50);
    }
  }, [isLoadingQuote, pendingNext, isQuoteValid, onNext, refreshAttempts]);

  const handleContinue = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Continue button clicked');
    
    // For pickup orders, we just need a selected slot
    if (selectedType === 'pickup' && selectedSlot) {
      console.log('Pickup order is valid, proceeding to next step');
      onNext();
      return;
    }
    
    // For delivery orders
    if (selectedType === 'delivery') {
      if (!selectedAddressId) {
        console.log('Missing delivery address');
        toast.error('Please select a delivery address to continue.');
        return;
      }
      
      if (!selectedSlot) {
        console.log('Missing time slot');
        toast.error('Please select a time slot to continue.');
        return;
      }
      
      // Check if the delivery quote is valid
      const quoteValid = isQuoteValid();
      console.log('Delivery quote validity check result:', quoteValid);
      
      if (quoteValid) {
        console.log('Delivery order is valid, proceeding to next step');
        onNext();
      } else if (!isLoadingQuote) {
        console.log('Delivery quote is not valid, refreshing...');
        // Set flag to proceed once refresh is complete
        setPendingNext(true);
        onRefreshQuote();
        toast('Your delivery quote has expired. We are refreshing it for you.', {
          description: 'Please wait a moment...'
        });
      }
    }
  };

  return (
    <ContinueButton 
      onClick={handleContinue}
      isDisabled={isButtonDisabled}
      isLoadingPayment={bookTimeSlotMutation.isPending}
      isLoadingQuote={isLoadingQuote || pendingNext}
    />
  );
};

export default DeliveryContinueButton;
