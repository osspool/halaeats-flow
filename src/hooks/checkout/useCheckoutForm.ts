
import { useCallback } from 'react';
import { OrderType, CheckoutState } from '@/types/checkout';
import { DeliveryQuote } from '@/types/delivery';

/**
 * Hook for managing form-related functionality during checkout
 */
export const useCheckoutForm = (
  checkoutState: CheckoutState,
  setCheckoutState: React.Dispatch<React.SetStateAction<CheckoutState>>
) => {
  const setOrderType = useCallback((type: OrderType) => {
    setCheckoutState(prev => ({
      ...prev,
      orderType: type,
    }));
  }, [setCheckoutState]);

  const setSelectedAddressId = useCallback((addressId: string) => {
    console.log('Setting selected address ID:', addressId);
    setCheckoutState(prev => ({
      ...prev,
      selectedAddressId: addressId,
    }));
  }, [setCheckoutState]);

  const setSelectedPaymentMethodId = useCallback((paymentMethodId: string) => {
    console.log('Setting selected payment method ID:', paymentMethodId);
    setCheckoutState(prev => ({
      ...prev,
      selectedPaymentMethodId: paymentMethodId,
    }));
  }, [setCheckoutState]);

  const setDeliveryInstructions = useCallback((instructions: string) => {
    setCheckoutState(prev => ({
      ...prev,
      deliveryInstructions: instructions,
    }));
  }, [setCheckoutState]);

  const setPickupTime = useCallback((time: string) => {
    setCheckoutState(prev => ({
      ...prev,
      pickupTime: time,
    }));
  }, [setCheckoutState]);

  const setDeliveryQuote = useCallback((quote: DeliveryQuote | null) => {
    setCheckoutState(prev => ({
      ...prev,
      deliveryQuote: quote,
    }));
  }, [setCheckoutState]);

  return {
    setOrderType,
    setSelectedAddressId,
    setSelectedPaymentMethodId,
    setDeliveryInstructions,
    setPickupTime,
    setDeliveryQuote,
  };
};
