
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { MockStripePaymentIntent, PaymentMethodType } from '@/types/checkout';
import { createMockPaymentIntent, confirmMockPaymentIntent, mockConnectedAccounts } from '@/data/checkoutMockData';

/**
 * Hook for handling payment intent creation and confirmation
 */
export const usePaymentIntents = () => {
  const { toast } = useToast();

  const createPaymentIntent = useCallback(async (
    amount: number, 
    cartItems: any[], 
    checkoutState: any, 
    connectedAccountId?: string,
    paymentMethodTypes?: PaymentMethodType[]
  ) => {
    try {
      // Get the caterer ID from the cart items
      if (!cartItems.length) {
        throw new Error('No items in cart');
      }
      
      const catererId = cartItems[0].caterer.id;
      // Set a default connected account if the specific caterer is not found
      const effectiveConnectedAccountId = connectedAccountId || 
        mockConnectedAccounts[catererId] || 
        'acct_default123456789';
      
      console.log('Using connected account:', effectiveConnectedAccountId, 'for caterer:', catererId);
      
      // Create payment intent with the provided details
      const paymentIntent = await createMockPaymentIntent(
        Math.round(amount * 100),
        'usd',
        checkoutState.selectedPaymentMethodId,
        { 
          order_id: `order_${Math.random().toString(36).substring(2, 10)}`,
          caterer_id: catererId
        },
        effectiveConnectedAccountId
      );
      
      return paymentIntent;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      toast({
        title: "Payment error",
        description: "Could not initialize payment process. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  const confirmPaymentIntent = useCallback(async (
    paymentIntentId: string, 
    paymentMethodId: string
  ) => {
    try {
      const confirmedIntent = await confirmMockPaymentIntent(
        paymentIntentId, 
        paymentMethodId
      );
      
      return confirmedIntent;
    } catch (error) {
      console.error('Error confirming payment intent:', error);
      toast({
        title: "Payment failed",
        description: "Your payment could not be processed. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  return {
    createPaymentIntent,
    confirmPaymentIntent,
  };
};
