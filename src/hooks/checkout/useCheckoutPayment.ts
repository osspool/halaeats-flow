
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { usePaymentIntents } from './usePaymentIntents';
import { useDeliveryOrder } from './useDeliveryOrder';
import { usePaymentSplit } from './usePaymentSplit';

/**
 * Hook for handling payment processing during checkout
 */
export const useCheckoutPayment = (
  checkoutState: any,
  setCheckoutState: React.Dispatch<React.SetStateAction<any>>
) => {
  const { toast } = useToast();
  const { createPaymentIntent, confirmPaymentIntent } = usePaymentIntents();
  const { createOrder } = useDeliveryOrder();
  const { calculateSplit } = usePaymentSplit();

  const createIntentWithState = useCallback(async (amount: number, cartItems: any[]) => {
    try {
      // If we have a delivery quote, we need to split the payment
      let paymentIntent;
      if (checkoutState.orderType === 'delivery' && checkoutState.deliveryQuote) {
        const subtotal = cartItems.reduce((total, item) => total + item.subtotal, 0);
        const deliveryFee = checkoutState.deliveryQuote.fee;
        
        // Calculate payment split between restaurant and delivery service
        const paymentSplit = calculateSplit(subtotal, deliveryFee);
        
        console.log('Payment split:', paymentSplit);
        
        // Get caterer ID from cart items
        const catererId = cartItems.length > 0 ? cartItems[0].caterer.id : 'cat_default';
        
        // Create payment intent with split payment details
        paymentIntent = await createPaymentIntent(
          paymentSplit.total_amount, 
          cartItems, 
          checkoutState
        );
      } else {
        // Regular payment flow for pickup
        paymentIntent = await createPaymentIntent(
          amount, 
          cartItems, 
          checkoutState
        );
      }
      
      // Update checkout state with the payment intent
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
  }, [checkoutState, setCheckoutState, createPaymentIntent, calculateSplit, toast]);

  const confirmIntentWithState = useCallback(async (paymentIntentId: string, paymentMethodId: string) => {
    try {
      const confirmedIntent = await confirmPaymentIntent(paymentIntentId, paymentMethodId);
      
      setCheckoutState(prev => ({
        ...prev,
        paymentIntent: confirmedIntent,
      }));
      
      // If this is a delivery order, create the delivery order after confirming payment
      if (checkoutState.orderType === 'delivery' && 
          checkoutState.selectedAddressId && 
          checkoutState.deliveryQuote) {
        
        const deliveryOrder = await createOrder(
          checkoutState.selectedAddressId,
          checkoutState.deliveryQuote,
          confirmedIntent.id
        );
        
        if (deliveryOrder) {
          console.log('Delivery order created:', deliveryOrder);
          
          // Update checkout state with delivery order
          setCheckoutState(prev => ({
            ...prev,
            deliveryOrder,
          }));
        }
      }
      
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
  }, [checkoutState, setCheckoutState, confirmPaymentIntent, createOrder, toast]);

  const completePayment = useCallback(async () => {
    try {
      console.log('Processing payment with:', checkoutState);
      
      if (!checkoutState.selectedPaymentMethodId) {
        throw new Error('No payment method selected');
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (checkoutState.paymentIntent?.id) {
        await confirmIntentWithState(
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
  }, [checkoutState, confirmIntentWithState, toast]);

  return {
    createPaymentIntent: createIntentWithState,
    confirmPaymentIntent: confirmIntentWithState,
    completePayment,
  };
};
