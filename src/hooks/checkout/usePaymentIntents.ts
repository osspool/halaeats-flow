
import { useState } from 'react';
import { CheckoutState, MockStripePaymentIntent } from '@/types/checkout';
import { createMockPaymentIntent, confirmMockPaymentIntent, mockConnectedAccounts } from '@/data/checkoutMockData';
import { useToast } from '@/hooks/use-toast';

export const usePaymentIntents = (checkoutState: CheckoutState, setCheckoutState: React.Dispatch<React.SetStateAction<CheckoutState>>) => {
  const { toast } = useToast();

  const createPaymentIntent = async (amount: number, cartItems: any[]) => {
    try {
      // Get the caterer ID from the cart items
      // Since we've filtered the cart items by caterer at this point,
      // all items should belong to the same caterer
      if (!cartItems.length) {
        throw new Error('No items in cart');
      }
      
      const catererId = cartItems[0].caterer.id;
      const connectedAccountId = mockConnectedAccounts[catererId];
      
      if (!connectedAccountId) {
        throw new Error('Caterer not found in connected accounts');
      }
      
      const paymentIntent = await createMockPaymentIntent(
        Math.round(amount * 100),
        'usd',
        checkoutState.selectedPaymentMethodId,
        { 
          order_id: `order_${Math.random().toString(36).substring(2, 10)}`,
          caterer_id: catererId
        },
        connectedAccountId
      );
      
      setCheckoutState(prev => ({
        ...prev,
        paymentIntent,
      }));
      
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
  };

  const confirmPaymentIntent = async (paymentIntentId: string, paymentMethodId: string) => {
    try {
      const confirmedIntent = await confirmMockPaymentIntent(paymentIntentId, paymentMethodId);
      
      setCheckoutState(prev => ({
        ...prev,
        paymentIntent: confirmedIntent,
      }));
      
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
  };

  return {
    createPaymentIntent,
    confirmPaymentIntent,
  };
};
