
import { DeliveryQuote } from './delivery';

export interface Address {
  id: string;
  name: string;
  street: string;
  apt?: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export type PaymentMethodType = 'card' | 'paypal' | 'apple_pay' | 'google_pay' | 'bank_transfer';

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  brand?: string;
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  email?: string; // For PayPal
  bankName?: string; // For bank transfers
  isDefault: boolean;
}

export interface MockStripePaymentIntent {
  id: string;
  object: 'payment_intent';
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'requires_capture' | 'canceled' | 'succeeded';
  client_secret: string;
  payment_method?: string;
  created: number;
  livemode: boolean;
  metadata: {
    order_id?: string;
    customer_id?: string;
  };
  application_fee_amount?: number;
  transfer_data?: {
    destination: string; // Stripe account ID of the connected account (restaurant/caterer)
  };
  payment_method_types?: PaymentMethodType[];
}

export type CheckoutStep = 'delivery-method' | 'payment' | 'review' | 'confirmation';
export type OrderType = 'delivery' | 'pickup';

export interface CheckoutState {
  step: CheckoutStep;
  orderType: OrderType;
  selectedAddressId?: string;
  selectedPaymentMethodId?: string;
  deliveryInstructions?: string;
  pickupTime?: string;
  paymentIntent?: MockStripePaymentIntent;
  deliveryQuote?: DeliveryQuote | null;
}
