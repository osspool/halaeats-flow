
import { useState, useCallback, useEffect, useRef } from 'react';
import { DeliveryQuote } from '@/types/delivery';
import { Address } from '@/types/checkout';
import { createDeliveryQuote, isDeliveryQuoteValid } from '@/services/mockDeliveryService';

export const useDeliveryQuote = (defaultAddressId?: string) => {
  const [deliveryQuote, setDeliveryQuote] = useState<DeliveryQuote | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const quoteRequestInProgress = useRef(false);

  // Fetch a delivery quote when address changes
  const fetchDeliveryQuote = useCallback(async (address: Address, timeSlot?: string): Promise<DeliveryQuote | null> => {
    try {
      // Prevent duplicate requests
      if (quoteRequestInProgress.current) {
        console.log('Quote request already in progress, skipping duplicate');
        return null;
      }
      
      quoteRequestInProgress.current = true;
      setIsLoadingQuote(true);
      console.log('Fetching delivery quote for address:', address, 'time slot:', timeSlot || 'not specified');
      
      // Pass the selected time slot to the quote creation if available
      const quote = await createDeliveryQuote(address, timeSlot);
      setDeliveryQuote(quote);
      console.log('Received delivery quote:', quote);
      return quote;
    } catch (error) {
      console.error('Error fetching delivery quote:', error);
      return null;
    } finally {
      setIsLoadingQuote(false);
      quoteRequestInProgress.current = false;
    }
  }, []);

  // Refresh the quote (typically when it's expired)
  const refreshQuote = useCallback(async (address: Address): Promise<DeliveryQuote | null> => {
    // Prevent duplicate refresh requests
    if (quoteRequestInProgress.current) {
      console.log('Quote refresh already in progress, skipping duplicate');
      return null;
    }
    
    try {
      quoteRequestInProgress.current = true;
      setIsLoadingQuote(true);
      const quote = await createDeliveryQuote(address, selectedSlot || undefined);
      setDeliveryQuote(quote);
      return quote;
    } catch (error) {
      console.error('Error refreshing delivery quote:', error);
      return null;
    } finally {
      setIsLoadingQuote(false);
      quoteRequestInProgress.current = false;
    }
  }, [selectedSlot]);

  // Check if the quote is still valid
  const isQuoteValid = useCallback(() => {
    return isDeliveryQuoteValid(deliveryQuote);
  }, [deliveryQuote]);

  // Update selectedSlot and selectedDate
  const updateTimeSelection = useCallback((slot: string | null, date: Date | null) => {
    setSelectedSlot(slot);
    setSelectedDate(date);
  }, []);

  return {
    deliveryQuote,
    isLoadingQuote,
    fetchDeliveryQuote,
    refreshQuote,
    isQuoteValid,
    updateTimeSelection
  };
};
