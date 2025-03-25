
import { useState, useCallback } from 'react';
import { OrderType } from '@/types';

/**
 * Hook for managing checkout form field state and setters
 */
export const useCheckoutForm = (initialState: any) => {
  const [formState, setFormState] = useState(initialState);

  const setOrderType = useCallback((orderType: OrderType) => {
    setFormState(prev => ({
      ...prev,
      orderType,
    }));
  }, []);

  const setSelectedAddressId = useCallback((addressId: string) => {
    setFormState(prev => ({
      ...prev,
      selectedAddressId: addressId,
    }));
  }, []);

  const setSelectedPaymentMethodId = useCallback((paymentMethodId: string) => {
    setFormState(prev => ({
      ...prev,
      selectedPaymentMethodId: paymentMethodId,
    }));
  }, []);

  const setDeliveryInstructions = useCallback((instructions: string) => {
    setFormState(prev => ({
      ...prev,
      deliveryInstructions: instructions,
    }));
  }, []);

  const setPickupTime = useCallback((time: string) => {
    setFormState(prev => ({
      ...prev,
      pickupTime: time,
    }));
  }, []);

  return {
    formState,
    setFormState,
    setOrderType,
    setSelectedAddressId,
    setSelectedPaymentMethodId,
    setDeliveryInstructions,
    setPickupTime,
  };
};
