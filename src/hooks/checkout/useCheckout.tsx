
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { OrderType } from '@/types';
import { initialCheckoutState, UseCheckoutReturn } from './types';
import { usePaymentIntents } from './usePaymentIntents';
import { useCheckoutSteps } from './useCheckoutSteps';

export const useCheckout = (): UseCheckoutReturn => {
  const [checkoutState, setCheckoutState] = useState(initialCheckoutState);
  const { toast } = useToast();

  // Form field setters
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

  // Payment processing
  const { createPaymentIntent, confirmPaymentIntent } = usePaymentIntents(
    checkoutState,
    setCheckoutState
  );

  // Checkout completion
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

  // Step navigation
  const { nextStep, previousStep } = useCheckoutSteps({
    checkoutState,
    setCheckoutState,
    completeCheckout
  });

  // Reset checkout state
  const resetCheckout = useCallback(() => {
    setCheckoutState(initialCheckoutState);
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
