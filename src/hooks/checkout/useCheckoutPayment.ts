
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { MockStripePaymentIntent } from '@/types/checkout';
import { createMockPaymentIntent, confirmMockPaymentIntent, mockConnectedAccounts } from '@/data/checkoutMockData';

/**
 * Hook for handling payment intent creation and confirmation during checkout
 */
export const useCheckoutPayment = (
  checkoutState: any,
  setCheckoutState: React.Dispatch<React.SetStateAction<any>>
) => {
  const { toast } = useToast();

  const createPaymentIntent = useCallback(async (amount: number, cartItems: any[]) => {
    try {
      // Get the caterer ID from the cart items
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
  }, [checkoutState.selectedPaymentMethodId, setCheckoutState, toast]);

  const confirmPaymentIntent = useCallback(async (paymentIntentId: string, paymentMethodId: string) => {
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
  }, [setCheckoutState, toast]);

  const completePayment = useCallback(async () => {
    try {
      console.log('Processing payment with:', checkoutState);
      
      if (!checkoutState.selectedPaymentMethodId) {
        throw new Error('No payment method selected');
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (checkoutState.paymentIntent?.id) {
        await confirmPaymentIntent(
          checkoutState.paymentIntent.id,
          checkoutState.selectedPaymentMethodId
        );
      }
      
      return true;
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }, [checkoutState, confirmPaymentIntent, toast]);

  return {
    createPaymentIntent,
    confirmPaymentIntent,
    completePayment,
  };
};
