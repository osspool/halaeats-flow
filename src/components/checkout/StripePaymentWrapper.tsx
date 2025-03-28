
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentStep from './payment/PaymentStep';
import { useCheckout } from '@/hooks/useCheckout';

// Initialize Stripe with the publishable key
// This is a public key, it's safe to include in the code
const stripePromise = loadStripe('pk_test_51Ob2TKEhTBJ6Q4tUABjKuoWrpJ6vYjpLlM5Lz4KYfBVcWouRi7bDvbSVdv4cQgDwN8KfljBehKXNTl6SaKaGfzVs00OZfldmA1');

interface StripePaymentWrapperProps {
  selectedPaymentMethodId?: string;
  onPaymentMethodSelect: (paymentMethodId: string) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const StripePaymentWrapper = ({
  selectedPaymentMethodId,
  onPaymentMethodSelect,
  onNext,
  onPrevious,
}: StripePaymentWrapperProps) => {
  const [clientSecret, setClientSecret] = useState('');
  const { checkoutState } = useCheckout();
  
  useEffect(() => {
    // In a real app, you would fetch this from your server
    // This is a mock implementation for the client secret
    const mockClientSecret = `seti_${Math.random().toString(36).substring(2)}_secret_${Math.random().toString(36).substring(2)}`;
    setClientSecret(mockClientSecret);
  }, []);
  
  // Handle payment method selection
  const handlePaymentMethodSelect = (paymentMethodId: string) => {
    console.log('Payment method selected in StripePaymentWrapper:', paymentMethodId);
    onPaymentMethodSelect(paymentMethodId);
  };
  
  return (
    <div>
      {clientSecret && (
        <Elements 
          stripe={stripePromise} 
          options={{
            appearance: {
              theme: 'stripe',
              variables: {
                colorPrimary: '#7c3aed',
              },
            },
            mode: 'setup', // 'setup' is appropriate for saving payment methods
            paymentMethods: {
              types: ['card', 'paypal', 'us_bank_account']
            }
          }}
        >
          <PaymentStep
            selectedPaymentMethodId={selectedPaymentMethodId || checkoutState.selectedPaymentMethodId}
            onPaymentMethodSelect={handlePaymentMethodSelect}
            onNext={onNext}
            onPrevious={onPrevious}
          />
        </Elements>
      )}
    </div>
  );
};

export default StripePaymentWrapper;
