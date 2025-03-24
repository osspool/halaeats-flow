
import { useState } from 'react';
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

  const nextStep = () => {
    switch (checkoutState.step) {
      case 'delivery-method':
        setCheckoutState(prev => ({
          ...prev,
          step: 'payment',
        }));
        break;
      case 'payment':
        setCheckoutState(prev => ({
          ...prev,
          step: 'review',
        }));
        break;
      case 'review':
        completeCheckout();
        break;
      default:
        break;
    }
  };

  const previousStep = () => {
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
  };

  const setOrderType = (orderType: OrderType) => {
    setCheckoutState(prev => ({
      ...prev,
      orderType,
    }));
  };

  const setSelectedAddressId = (addressId: string) => {
    setCheckoutState(prev => ({
      ...prev,
      selectedAddressId: addressId,
    }));
  };

  const setSelectedPaymentMethodId = (paymentMethodId: string) => {
    setCheckoutState(prev => ({
      ...prev,
      selectedPaymentMethodId: paymentMethodId,
    }));
  };

  const setDeliveryInstructions = (instructions: string) => {
    setCheckoutState(prev => ({
      ...prev,
      deliveryInstructions: instructions,
    }));
  };

  const setPickupTime = (time: string) => {
    setCheckoutState(prev => ({
      ...prev,
      pickupTime: time,
    }));
  };

  // Create a payment intent (in a real app, this would be a server call)
  const createPaymentIntent = async (amount: number, cartItems: any[]) => {
    try {
      // Group items by caterer
      const itemsByCaterer: Record<string, { items: any[], subtotal: number }> = {};
      
      cartItems.forEach(item => {
        const catererId = item.caterer.id;
        if (!itemsByCaterer[catererId]) {
          itemsByCaterer[catererId] = { items: [], subtotal: 0 };
        }
        
        itemsByCaterer[catererId].items.push(item);
        itemsByCaterer[catererId].subtotal += item.subtotal;
      });
      
      // For demo purposes, we're creating just one payment intent
      // In a real Connect implementation, you might create multiple payment intents
      // or use transfers with your platform account

      // Get the first caterer (in a real app, you'd handle multiple)
      const firstCatererId = Object.keys(itemsByCaterer)[0];
      const connectedAccountId = mockConnectedAccounts[firstCatererId];
      
      // Create payment intent for the total amount
      const paymentIntent = await createMockPaymentIntent(
        Math.round(amount * 100), // Convert to cents
        'usd',
        checkoutState.selectedPaymentMethodId,
        { order_id: `order_${Math.random().toString(36).substring(2, 10)}` },
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

  // Confirm payment intent (in a real app, this would be a server call)
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
    // Mock API call to process payment and create order
    try {
      console.log('Processing payment and creating order with:', checkoutState);
      
      if (!checkoutState.selectedPaymentMethodId) {
        throw new Error('No payment method selected');
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, here you would call your backend
      // to handle the Stripe payment confirmation
      
      if (checkoutState.paymentIntent?.id) {
        // Confirm the payment intent if it exists
        await confirmPaymentIntent(
          checkoutState.paymentIntent.id,
          checkoutState.selectedPaymentMethodId
        );
      }
      
      // Move to confirmation step
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

  const resetCheckout = () => {
    setCheckoutState(initialState);
  };

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
