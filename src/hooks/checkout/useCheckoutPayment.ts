
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { MockStripePaymentIntent } from '@/types/checkout';
import { createMockPaymentIntent, confirmMockPaymentIntent, mockConnectedAccounts } from '@/data/checkoutMockData';
import { createDeliveryOrder, calculatePaymentSplit } from '@/services/mockDeliveryService';
import { mockAddresses } from '@/data/checkoutMockData';

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
      
      // If we have a delivery quote, we need to split the payment
      let paymentIntent;
      if (checkoutState.orderType === 'delivery' && checkoutState.deliveryQuote) {
        const subtotal = cartItems.reduce((total, item) => total + item.subtotal, 0);
        const deliveryFee = checkoutState.deliveryQuote.fee;
        
        // Calculate payment split between restaurant and delivery service
        const paymentSplit = calculatePaymentSplit(subtotal, deliveryFee);
        
        console.log('Payment split:', paymentSplit);
        
        // For the mock, we'll create a simple payment intent for the total amount
        // In a real implementation, this would involve creating a Stripe payment intent
        // with instructions to split the payment between the restaurant and DoorDash
        paymentIntent = await createMockPaymentIntent(
          Math.round(paymentSplit.total_amount * 100),
          'usd',
          checkoutState.selectedPaymentMethodId,
          { 
            order_id: `order_${Math.random().toString(36).substring(2, 10)}`,
            caterer_id: catererId,
            delivery_fee: deliveryFee.toString(),
            restaurant_amount: paymentSplit.restaurant_amount.toString(),
          },
          connectedAccountId
        );
      } else {
        // Regular payment flow for pickup
        paymentIntent = await createMockPaymentIntent(
          Math.round(amount * 100),
          'usd',
          checkoutState.selectedPaymentMethodId,
          { 
            order_id: `order_${Math.random().toString(36).substring(2, 10)}`,
            caterer_id: catererId
          },
          connectedAccountId
        );
      }
      
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
  }, [checkoutState, setCheckoutState, toast]);

  const confirmPaymentIntent = useCallback(async (paymentIntentId: string, paymentMethodId: string) => {
    try {
      const confirmedIntent = await confirmMockPaymentIntent(paymentIntentId, paymentMethodId);
      
      setCheckoutState(prev => ({
        ...prev,
        paymentIntent: confirmedIntent,
      }));
      
      // If this is a delivery order, create the delivery order after confirming payment
      if (checkoutState.orderType === 'delivery' && 
          checkoutState.selectedAddressId && 
          checkoutState.deliveryQuote) {
        
        const selectedAddress = mockAddresses.find(addr => addr.id === checkoutState.selectedAddressId);
        
        if (selectedAddress) {
          // Create delivery order (DoorDash equivalent)
          const deliveryOrder = await createDeliveryOrder(
            checkoutState.deliveryQuote.id,
            selectedAddress,
            confirmedIntent.id
          );
          
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
  }, [checkoutState.deliveryQuote, checkoutState.orderType, checkoutState.selectedAddressId, setCheckoutState, toast]);

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
