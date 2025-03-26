
import { CheckoutState, CheckoutStep, MockStripePaymentIntent } from '@/types/checkout';
import { OrderType } from '@/types';
import { DeliveryQuote, DeliveryOrder } from '@/types/delivery';

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
  setDeliveryQuote: (quote: DeliveryQuote | null) => void;
  createPaymentIntent: (amount: number, cartItems: any[]) => Promise<MockStripePaymentIntent>;
  confirmPaymentIntent: (paymentIntentId: string, paymentMethodId: string) => Promise<MockStripePaymentIntent>;
  resetCheckout: () => void;
}

// Initial state for the checkout process
export const initialCheckoutState: CheckoutState = {
  step: 'delivery-method',
  orderType: 'delivery',
};

// Update the CheckoutState type in checkout.ts to include the delivery quote and order
export interface CheckoutStateWithDelivery extends CheckoutState {
  deliveryQuote?: DeliveryQuote;
  deliveryOrder?: DeliveryOrder;
}
