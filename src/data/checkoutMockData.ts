
import { Address, PaymentMethod, MockStripePaymentIntent, PaymentMethodType } from '@/types/checkout';

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
    type: 'card',
    brand: 'visa',
    last4: '4242',
    expiryMonth: 12,
    expiryYear: 2024,
    isDefault: true,
  },
  {
    id: 'pm_2',
    type: 'card',
    brand: 'mastercard',
    last4: '5555',
    expiryMonth: 6,
    expiryYear: 2025,
    isDefault: false,
  },
  {
    id: 'pm_3',
    type: 'paypal',
    email: 'customer@example.com',
    isDefault: false,
  },
  {
    id: 'pm_4',
    type: 'bank_transfer',
    bankName: 'Chase',
    last4: '6789',
    isDefault: false,
  },
];

// Connected accounts for restaurants (in a real app, these would be stored in your database)
export const mockConnectedAccounts = {
  'caterer_1': 'acct_restaurant_spicedelight',
  'caterer_2': 'acct_restaurant_tandooripalace',
  'caterer_3': 'acct_restaurant_mediterraneangrill',
};

// Mock Stripe Connect payment intent creation
// This simulates what would happen on your backend
export const createMockPaymentIntent = async (
  amount: number,
  currency: string = 'usd',
  paymentMethodId?: string,
  metadata: Record<string, string> = {},
  connectedAccountId?: string,
): Promise<MockStripePaymentIntent> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Create a unique ID for the payment intent
  const id = `pi_${Math.random().toString(36).substring(2, 10)}`;
  const clientSecret = `${id}_secret_${Math.random().toString(36).substring(2, 10)}`;
  
  // Get the payment method type from the payment method ID
  let paymentMethodTypes: PaymentMethodType[] = ['card', 'paypal', 'bank_transfer'];
  
  if (paymentMethodId) {
    const paymentMethod = mockPaymentMethods.find(pm => pm.id === paymentMethodId);
    if (paymentMethod) {
      // Move the selected payment method to the beginning of the array
      paymentMethodTypes = [
        paymentMethod.type,
        ...paymentMethodTypes.filter(type => type !== paymentMethod.type)
      ];
    }
  }
  
  // Mock payment intent object
  const paymentIntent: MockStripePaymentIntent = {
    id,
    object: 'payment_intent',
    amount,
    currency,
    status: paymentMethodId ? 'requires_confirmation' : 'requires_payment_method',
    client_secret: clientSecret,
    payment_method: paymentMethodId,
    created: Math.floor(Date.now() / 1000),
    livemode: false,
    metadata,
    payment_method_types: paymentMethodTypes,
  };
  
  // If there's a connected account, add transfer data
  // This is how you would implement Stripe Connect direct charges
  if (connectedAccountId) {
    paymentIntent.transfer_data = {
      destination: connectedAccountId
    };
    
    // Calculate application fee (e.g., 10% of the transaction)
    const applicationFeeAmount = Math.round(amount * 0.1);
    paymentIntent.application_fee_amount = applicationFeeAmount;
  }
  
  return paymentIntent;
};

// Mock confirming a payment intent
export const confirmMockPaymentIntent = async (
  paymentIntentId: string,
  paymentMethodId: string
): Promise<MockStripePaymentIntent> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // In a real implementation, this would make an API call to your backend
  // Your backend would then call Stripe's API to confirm the payment intent
  
  // Find the payment method to determine its type
  const paymentMethod = mockPaymentMethods.find(pm => pm.id === paymentMethodId);
  
  // Mock successful confirmation
  return {
    id: paymentIntentId,
    object: 'payment_intent',
    amount: 5000, // Placeholder amount
    currency: 'usd',
    status: 'succeeded',
    client_secret: `${paymentIntentId}_secret_confirmed`,
    payment_method: paymentMethodId,
    created: Math.floor(Date.now() / 1000),
    livemode: false,
    metadata: {},
    payment_method_types: paymentMethod ? [paymentMethod.type] : ['card'],
  };
};

// Mock Stripe payment processing
export const mockProcessPayment = async (
  paymentMethodId: string,
  amount: number,
  metadata: Record<string, string> = {},
  connectedAccountId?: string
): Promise<{ success: boolean; paymentIntent: MockStripePaymentIntent }> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Check if payment method exists
      const paymentMethod = mockPaymentMethods.find(pm => pm.id === paymentMethodId);
      
      if (!paymentMethod) {
        reject(new Error('Invalid payment method'));
        return;
      }

      // Step 1: Create a payment intent (normally done on the server)
      const paymentIntent = await createMockPaymentIntent(
        amount,
        'usd',
        paymentMethodId,
        metadata,
        connectedAccountId
      );

      // Step 2: Confirm the payment intent (normally done on the server)
      const confirmedPaymentIntent = await confirmMockPaymentIntent(
        paymentIntent.id,
        paymentMethodId
      );

      // Always succeed for mock purposes
      resolve({
        success: true,
        paymentIntent: confirmedPaymentIntent,
      });
    } catch (error) {
      reject(error);
    }
  });
};
