
import { useState, useCallback, useEffect, useRef } from 'react';
import { DeliveryQuote } from '@/types/delivery';
import { Address } from '@/types/checkout';
import { createDeliveryQuote, isDeliveryQuoteValid } from '@/services/mockDeliveryService';
import { toast } from 'sonner';

export const useDeliveryQuote = (defaultAddressId?: string) => {
  const [deliveryQuote, setDeliveryQuote] = useState<DeliveryQuote | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const quoteRequestInProgress = useRef(false);
  const lastFetchTime = useRef<number>(0);
  
  // Fetch a delivery quote when address changes
  const fetchDeliveryQuote = useCallback(async (address: Address, timeSlot?: string): Promise<DeliveryQuote | null> => {
    try {
      // Prevent duplicate requests
      if (quoteRequestInProgress.current) {
        console.log('Quote request already in progress, skipping duplicate');
        return null;
      }
      
      // Less aggressive throttling - 500ms instead of 2000ms to prevent blocking legitimate refreshes
      const now = Date.now();
      if (now - lastFetchTime.current < 500) { 
        console.log('Throttling quote request, too soon after last request');
        return deliveryQuote;
      }
      
      quoteRequestInProgress.current = true;
      setIsLoadingQuote(true);
      lastFetchTime.current = now;
      
      console.log('Fetching delivery quote for address:', address, 'time slot:', timeSlot || 'not specified');
      
      // Pass the selected time slot to the quote creation if available
      const quote = await createDeliveryQuote(address, timeSlot);
      
      console.log('Received delivery quote:', quote);
      setDeliveryQuote(quote);
      return quote;
    } catch (error) {
      console.error('Error fetching delivery quote:', error);
      setDeliveryQuote(null);
      toast.error('Failed to fetch delivery quote. Please try again.');
      return null;
    } finally {
      setIsLoadingQuote(false);
      quoteRequestInProgress.current = false;
    }
  }, [deliveryQuote]);

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
      lastFetchTime.current = Date.now();
      
      console.log('Refreshing quote for address:', address, 'time slot:', selectedSlot || 'not specified');
      const quote = await createDeliveryQuote(address, selectedSlot || undefined);
      
      if (quote) {
        console.log('Successfully refreshed delivery quote:', quote);
        setDeliveryQuote(quote);
        return quote;
      } else {
        console.error('Failed to get delivery quote from service');
        setDeliveryQuote(null);
        return null;
      }
    } catch (error) {
      console.error('Error refreshing delivery quote:', error);
      setDeliveryQuote(null);
      return null;
    } finally {
      setIsLoadingQuote(false);
      quoteRequestInProgress.current = false;
    }
  }, [selectedSlot]);

  // Check if the quote is still valid
  const isQuoteValid = useCallback(() => {
    const valid = isDeliveryQuoteValid(deliveryQuote);
    console.log(`Checking if quote is valid: ${valid}`, deliveryQuote);
    return valid;
  }, [deliveryQuote]);

  // Update selectedSlot and selectedDate
  const updateTimeSelection = useCallback((slot: string | null, date: Date | null) => {
    console.log('Updating time selection:', slot, date);
    setSelectedSlot(slot);
    setSelectedDate(date);
  }, []);

  return {
    deliveryQuote,
    isLoadingQuote,
    fetchDeliveryQuote,
    refreshQuote,
    isQuoteValid,
    updateTimeSelection,
    selectedSlot,
    selectedDate
  };
};
