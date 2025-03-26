
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { UseCheckoutReturn } from './types';
import { initialCheckoutState } from './types';
import { useCheckoutForm } from './useCheckoutForm';
import { useCheckoutPayment } from './useCheckoutPayment';
import { useCheckoutCompletion } from './useCheckoutCompletion';
import { useCheckoutSteps } from './useCheckoutSteps';

export const useCheckout = (): UseCheckoutReturn => {
  // Initialize state with the initial checkout state
  const [checkoutState, setCheckoutState] = useState(initialCheckoutState);
  
  // Use custom hooks for different parts of checkout functionality
  const {
    setOrderType,
    setSelectedAddressId,
    setSelectedPaymentMethodId,
    setDeliveryInstructions,
    setPickupTime,
    setDeliveryQuote,
  } = useCheckoutForm(checkoutState, setCheckoutState);
  
  // Hook for payment processing
  const {
    createPaymentIntent,
    confirmPaymentIntent,
    completePayment,
  } = useCheckoutPayment(checkoutState, setCheckoutState);
  
  // Hook for checkout completion
  const { completeCheckout } = useCheckoutCompletion(
    checkoutState,
    setCheckoutState,
    completePayment
  );
  
  // Step navigation logic
  const { nextStep, previousStep } = useCheckoutSteps({
    checkoutState,
    setCheckoutState,
    completeCheckout
  });
  
  // Reset checkout state
  const resetCheckout = useCallback(() => {
    setCheckoutState(initialCheckoutState);
  }, []);
  
  // Return the combined checkout hook API
  return {
    checkoutState,
    nextStep,
    previousStep,
    setOrderType,
    setSelectedAddressId,
    setSelectedPaymentMethodId,
    setDeliveryInstructions,
    setPickupTime,
    setDeliveryQuote,
    createPaymentIntent,
    confirmPaymentIntent,
    resetCheckout,
  };
};
