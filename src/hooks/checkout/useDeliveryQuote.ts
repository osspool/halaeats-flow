
import { useState, useCallback, useEffect } from 'react';
import { DeliveryQuote } from '@/types/delivery';
import { Address } from '@/types/checkout';
import { createDeliveryQuote, isDeliveryQuoteValid } from '@/services/mockDeliveryService';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';

export const useDeliveryQuote = (selectedAddressId?: string) => {
  const [deliveryQuote, setDeliveryQuote] = useState<DeliveryQuote | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const { toast: uiToast } = useToast();

  // Function to fetch a delivery quote
  const fetchDeliveryQuote = useCallback(async (address: Address) => {
    console.log('Fetching delivery quote for address:', address);
    setIsLoadingQuote(true);
    setQuoteError(null);
    
    try {
      const quote = await createDeliveryQuote(address);
      console.log('Received delivery quote:', quote);
      setDeliveryQuote(quote);
      
      // Setup expiration handling
      const expiresAt = new Date(quote.expires_at);
      const timeUntilExpiration = expiresAt.getTime() - new Date().getTime();
      
      // Set a timer to show a warning when the quote is about to expire
      if (timeUntilExpiration > 0) {
        const warningTime = Math.max(timeUntilExpiration - 60000, 0); // 1 minute before expiration
        
        setTimeout(() => {
          uiToast({
            title: "Delivery quote expiring soon",
            description: "Your delivery quote will expire in 1 minute. Please complete your order soon.",
            variant: "default",
          });
        }, warningTime);
        
        // Set a timer to mark the quote as expired
        setTimeout(() => {
          setDeliveryQuote(prev => 
            prev ? { ...prev, status: 'expired' } : null
          );
          
          toast("Delivery quote expired", {
            description: "Your delivery quote has expired. Please request a new quote to continue."
          });
        }, timeUntilExpiration);
      }
      
      return quote;
    } catch (error) {
      console.error('Error fetching delivery quote:', error);
      setQuoteError('Failed to get delivery quote. Please try again.');
      toast.error("Could not get a delivery quote. Please try again.");
      return null;
    } finally {
      setIsLoadingQuote(false);
    }
  }, [uiToast]);

  // Check if the current quote is valid
  const isQuoteValid = useCallback(() => {
    if (isLoadingQuote) {
      console.log('Quote is being loaded, considering valid for now');
      return true;
    }
    
    const result = isDeliveryQuoteValid(deliveryQuote);
    console.log('Quote validity check:', {
      quote: deliveryQuote ? {
        id: deliveryQuote.id,
        status: deliveryQuote.status,
        expires_at: deliveryQuote.expires_at
      } : null,
      isValid: result
    });
    
    return result;
  }, [deliveryQuote, isLoadingQuote]);

  // Function to refresh an expired quote
  const refreshQuote = useCallback(async (address: Address) => {
    if (isLoadingQuote) return null;
    
    if (isQuoteValid() && deliveryQuote?.status === 'active') {
      console.log('Quote is still valid, no need to refresh');
      return deliveryQuote;
    }
    
    console.log('Refreshing delivery quote for address:', address);
    return fetchDeliveryQuote(address);
  }, [deliveryQuote, fetchDeliveryQuote, isLoadingQuote, isQuoteValid]);

  return {
    deliveryQuote,
    isLoadingQuote,
    quoteError,
    fetchDeliveryQuote,
    isQuoteValid,
    refreshQuote,
  };
};
