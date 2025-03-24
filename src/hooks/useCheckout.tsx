
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckoutState, CheckoutStep, MockStripePaymentIntent } from '@/types/checkout';
import { OrderType } from '@/types';
import { createMockPaymentIntent, confirmMockPaymentIntent, mockConnectedAccounts } from '@/data/checkoutMockData';
import { useToast } from '@/hooks/use-toast';

const initialState: CheckoutState = {
  step: 'delivery-method',
  orderType: 'delivery',
};

export const useCheckout = () => {
  const [checkoutState, setCheckoutState] = useState<CheckoutState>(initialState);
  const navigate = useNavigate();
  const { toast } = useToast();

  const nextStep = useCallback(() => {
    console.log('Current step:', checkoutState.step);
    
    switch (checkoutState.step) {
      case 'delivery-method':
        console.log('Moving to payment step');
        setCheckoutState(prev => ({
          ...prev,
          step: 'payment',
        }));
        break;
      case 'payment':
        console.log('Moving to review step');
        setCheckoutState(prev => ({
          ...prev,
          step: 'review',
        }));
        break;
      case 'review':
        console.log('Completing checkout');
        completeCheckout();
        break;
      default:
        console.log('Unknown step:', checkoutState.step);
        break;
    }
  }, [checkoutState.step]);

  const previousStep = useCallback(() => {
    switch (checkoutState.step) {
      case 'payment':
        setCheckoutState(prev => ({
          ...prev,
          step: 'delivery-method',
        }));
        break;
      case 'review':
        setCheckoutState(prev => ({
          ...prev,
          step: 'payment',
        }));
        break;
      default:
        break;
    }
  }, [checkoutState.step]);

  const setOrderType = useCallback((orderType: OrderType) => {
    setCheckoutState(prev => ({
      ...prev,
      orderType,
    }));
  }, []);

  const setSelectedAddressId = useCallback((addressId: string) => {
    setCheckoutState(prev => ({
      ...prev,
      selectedAddressId: addressId,
    }));
  }, []);

  const setSelectedPaymentMethodId = useCallback((paymentMethodId: string) => {
    setCheckoutState(prev => ({
      ...prev,
      selectedPaymentMethodId: paymentMethodId,
    }));
  }, []);

  const setDeliveryInstructions = useCallback((instructions: string) => {
    setCheckoutState(prev => ({
      ...prev,
      deliveryInstructions: instructions,
    }));
  }, []);

  const setPickupTime = useCallback((time: string) => {
    setCheckoutState(prev => ({
      ...prev,
      pickupTime: time,
    }));
  }, []);

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

  const completeCheckout = async () => {
    try {
      console.log('Processing payment and creating order with:', checkoutState);
      
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
  };

  const resetCheckout = useCallback(() => {
    setCheckoutState(initialState);
  }, []);

  return {
    checkoutState,
    nextStep,
    previousStep,
    setOrderType,
    setSelectedAddressId,
    setSelectedPaymentMethodId,
    setDeliveryInstructions,
    setPickupTime,
    createPaymentIntent,
    confirmPaymentIntent,
    resetCheckout,
  };
};
