
import { useState, useCallback, useEffect } from 'react';
import { DeliveryQuote } from '@/types/delivery';
import { Address } from '@/types/checkout';
import { createDeliveryQuote, isDeliveryQuoteValid } from '@/services/mockDeliveryService';
import { useToast } from '@/hooks/use-toast';

export const useDeliveryQuote = (selectedAddressId?: string) => {
  const [deliveryQuote, setDeliveryQuote] = useState<DeliveryQuote | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const { toast } = useToast();

  // Function to fetch a delivery quote
  const fetchDeliveryQuote = useCallback(async (address: Address) => {
    setIsLoadingQuote(true);
    setQuoteError(null);
    
    try {
      const quote = await createDeliveryQuote(address);
      setDeliveryQuote(quote);
      
      // Setup expiration handling
      const expiresAt = new Date(quote.expires_at);
      const timeUntilExpiration = expiresAt.getTime() - new Date().getTime();
      
      // Set a timer to show a warning when the quote is about to expire
      if (timeUntilExpiration > 0) {
        const warningTime = Math.max(timeUntilExpiration - 60000, 0); // 1 minute before expiration
        
        setTimeout(() => {
          toast({
            title: "Delivery quote expiring soon",
            description: "Your delivery quote will expire in 1 minute. Please complete your order soon.",
            variant: "default", // Fixed from "warning" to "default"
          });
        }, warningTime);
        
        // Set a timer to mark the quote as expired
        setTimeout(() => {
          setDeliveryQuote(prev => 
            prev ? { ...prev, status: 'expired' } : null
          );
          
          toast({
            title: "Delivery quote expired",
            description: "Your delivery quote has expired. Please request a new quote to continue.",
            variant: "destructive",
          });
        }, timeUntilExpiration);
      }
      
      return quote;
    } catch (error) {
      console.error('Error fetching delivery quote:', error);
      setQuoteError('Failed to get delivery quote. Please try again.');
      toast({
        title: "Delivery quote error",
        description: "Could not get a delivery quote. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoadingQuote(false);
    }
  }, [toast]);

  // Check if the current quote is valid
  const isQuoteValid = useCallback(() => {
    return isDeliveryQuoteValid(deliveryQuote);
  }, [deliveryQuote]);

  // Function to refresh an expired quote
  const refreshQuote = useCallback(async (address: Address) => {
    if (isLoadingQuote) return;
    
    if (isQuoteValid()) {
      toast({
        title: "Quote still valid",
        description: "Your current delivery quote is still valid.",
      });
      return deliveryQuote;
    }
    
    return fetchDeliveryQuote(address);
  }, [deliveryQuote, fetchDeliveryQuote, isLoadingQuote, isQuoteValid, toast]);

  return {
    deliveryQuote,
    isLoadingQuote,
    quoteError,
    fetchDeliveryQuote,
    isQuoteValid,
    refreshQuote,
  };
};
