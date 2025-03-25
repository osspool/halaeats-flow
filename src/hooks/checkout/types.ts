
import { CheckoutState, CheckoutStep, MockStripePaymentIntent } from '@/types/checkout';
import { OrderType } from '@/types';

// Define the return type of the useCheckout hook for better type safety
export interface UseCheckoutReturn {
  checkoutState: CheckoutState;
  nextStep: () => void;
  previousStep: () => void;
  setOrderType: (orderType: OrderType) => void;
  setSelectedAddressId: (addressId: string) => void;
  setSelectedPaymentMethodId: (paymentMethodId: string) => void;
  setDeliveryInstructions: (instructions: string) => void;
  setPickupTime: (time: string) => void;
  createPaymentIntent: (amount: number, cartItems: any[]) => Promise<MockStripePaymentIntent>;
  confirmPaymentIntent: (paymentIntentId: string, paymentMethodId: string) => Promise<MockStripePaymentIntent>;
  resetCheckout: () => void;
}

// Initial state for the checkout process
export const initialCheckoutState: CheckoutState = {
  step: 'delivery-method',
  orderType: 'delivery',
};
