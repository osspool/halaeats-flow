
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CheckoutState } from '@/types/checkout';

/**
 * Hook for handling checkout completion logic
 */
export const useCheckoutCompletion = (
  checkoutState: CheckoutState,
  setCheckoutState: React.Dispatch<React.SetStateAction<CheckoutState>>,
  completePayment: () => Promise<boolean>
) => {
  const { toast } = useToast();

  const completeCheckout = useCallback(async (): Promise<void> => {
    try {
      console.log('Processing order with:', checkoutState);
      
      // Process payment
      const paymentSuccessful = await completePayment();
      console.log('Payment result:', paymentSuccessful);
      
      if (!paymentSuccessful) {
        throw new Error('Payment processing failed');
      }
      
      // Update checkout state to confirmation
      setCheckoutState(prev => ({
        ...prev,
        step: 'confirmation',
      }));
      
      toast({
        title: "Order placed successfully!",
        description: "Your order has been processed. Thank you for your purchase.",
      });
      
    } catch (error) {
      console.error('Error processing order:', error);
      toast({
        title: "Order processing failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    }
  }, [checkoutState, completePayment, setCheckoutState, toast]);

  return { completeCheckout };
};
