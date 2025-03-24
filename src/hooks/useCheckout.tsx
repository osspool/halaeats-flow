
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckoutState, CheckoutStep } from '@/types/checkout';
import { OrderType } from '@/types';

const initialState: CheckoutState = {
  step: 'delivery-method',
  orderType: 'delivery',
};

export const useCheckout = () => {
  const [checkoutState, setCheckoutState] = useState<CheckoutState>(initialState);
  const navigate = useNavigate();

  const nextStep = () => {
    switch (checkoutState.step) {
      case 'delivery-method':
        setCheckoutState(prev => ({
          ...prev,
          step: 'address',
        }));
        break;
      case 'address':
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
      case 'address':
        setCheckoutState(prev => ({
          ...prev,
          step: 'delivery-method',
        }));
        break;
      case 'payment':
        setCheckoutState(prev => ({
          ...prev,
          step: 'address',
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

  const completeCheckout = async () => {
    // Mock API call to process payment and create order
    try {
      console.log('Processing payment and creating order with:', checkoutState);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Move to confirmation step
      setCheckoutState(prev => ({
        ...prev,
        step: 'confirmation',
      }));
    } catch (error) {
      console.error('Error processing order:', error);
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
    resetCheckout,
  };
};
