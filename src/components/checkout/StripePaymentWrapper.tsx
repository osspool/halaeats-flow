
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentStep from './payment/PaymentStep';

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
  
  useEffect(() => {
    // In a real app, you would fetch this from your server
    // This is a mock implementation for the client secret
    const mockClientSecret = `seti_${Math.random().toString(36).substring(2)}_secret_${Math.random().toString(36).substring(2)}`;
    setClientSecret(mockClientSecret);
  }, []);
  
  return (
    <div>
      {clientSecret && (
        <Elements 
          stripe={stripePromise} 
          options={{
            clientSecret,
            appearance: {
              theme: 'stripe',
              variables: {
                colorPrimary: '#7c3aed',
              },
            },
          }}
        >
          <PaymentStep
            selectedPaymentMethodId={selectedPaymentMethodId}
            onPaymentMethodSelect={onPaymentMethodSelect}
            onNext={onNext}
            onPrevious={onPrevious}
          />
        </Elements>
      )}
    </div>
  );
};

export default StripePaymentWrapper;
