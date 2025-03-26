
import { useState, useCallback } from 'react';
import { DeliveryQuote } from '@/types/delivery';
import { Address } from '@/types/checkout';
import { getDeliveryQuote } from '@/services/mockDeliveryService';

export const useDeliveryQuote = (defaultAddressId?: string) => {
  const [deliveryQuote, setDeliveryQuote] = useState<DeliveryQuote | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);

  const fetchDeliveryQuote = useCallback(async (address: Address): Promise<DeliveryQuote | null> => {
    try {
      setIsLoadingQuote(true);
      console.log('Fetching delivery quote for address:', address);
      const quote = await getDeliveryQuote(address);
      setDeliveryQuote(quote);
      console.log('Received delivery quote:', quote);
      return quote;
    } catch (error) {
      console.error('Error fetching delivery quote:', error);
      return null;
    } finally {
      setIsLoadingQuote(false);
    }
  }, []);

  const refreshQuote = useCallback(async (address: Address): Promise<DeliveryQuote | null> => {
    try {
      setIsLoadingQuote(true);
      const quote = await getDeliveryQuote(address);
      setDeliveryQuote(quote);
      return quote;
    } catch (error) {
      console.error('Error refreshing delivery quote:', error);
      return null;
    } finally {
      setIsLoadingQuote(false);
    }
  }, []);

  // Check if the quote is still valid
  const isQuoteValid = useCallback(() => {
    if (!deliveryQuote) return false;
    
    // Check if the quote is active
    if (deliveryQuote.status !== 'active') return false;
    
    // Check if the quote has expired (created more than 5 minutes ago)
    const createdAt = new Date(deliveryQuote.created_at);
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    
    return createdAt > fiveMinutesAgo;
  }, [deliveryQuote]);

  return {
    deliveryQuote,
    isLoadingQuote,
    fetchDeliveryQuote,
    refreshQuote,
    isQuoteValid
  };
};
