
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

export interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

export type CheckoutStep = 'delivery-method' | 'address' | 'payment' | 'review' | 'confirmation';

export interface CheckoutState {
  step: CheckoutStep;
  orderType: 'delivery' | 'pickup';
  selectedAddressId?: string;
  selectedPaymentMethodId?: string;
  deliveryInstructions?: string;
  pickupTime?: string;
}
