
import { Address, PaymentMethod } from '@/types/checkout';

export const mockAddresses: Address[] = [
  {
    id: 'addr_1',
    name: 'Home',
    street: '123 Main Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    isDefault: true,
  },
  {
    id: 'addr_2',
    name: 'Work',
    street: '456 Market Street',
    apt: 'Suite 500',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94103',
    isDefault: false,
  },
  {
    id: 'addr_3',
    name: 'Apartment',
    street: '789 Mission Street',
    apt: 'Apt 3B',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94107',
    isDefault: false,
  },
];

export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm_1',
    brand: 'visa',
    last4: '4242',
    expiryMonth: 12,
    expiryYear: 2024,
    isDefault: true,
  },
  {
    id: 'pm_2',
    brand: 'mastercard',
    last4: '5555',
    expiryMonth: 6,
    expiryYear: 2025,
    isDefault: false,
  },
];

// Mock stripe payment processing
export const mockProcessPayment = (
  paymentMethodId: string,
  amount: number
): Promise<{ success: boolean; transactionId: string }> => {
  return new Promise((resolve, reject) => {
    // Simulate API delay
    setTimeout(() => {
      // Check if payment method exists
      const paymentMethod = mockPaymentMethods.find(pm => pm.id === paymentMethodId);
      
      if (!paymentMethod) {
        reject(new Error('Invalid payment method'));
        return;
      }

      // Always succeed for mock purposes
      resolve({
        success: true,
        transactionId: `tx_${Math.random().toString(36).substring(2, 10)}`,
      });
    }, 1000);
  });
};
