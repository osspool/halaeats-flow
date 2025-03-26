
import { CreditCard, Shield } from 'lucide-react';
import { PaymentMethod } from '@/types/checkout';

interface PaymentMethodSectionProps {
  selectedPaymentMethod?: PaymentMethod;
}

const PaymentMethodSection = ({ selectedPaymentMethod }: PaymentMethodSectionProps) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="font-medium flex items-center mb-3">
        <CreditCard className="h-4 w-4 mr-2 text-primary" />
        Payment Method
      </h3>
      
      {selectedPaymentMethod ? (
        <div>
          <p className="text-sm font-medium">
            {selectedPaymentMethod.brand.charAt(0).toUpperCase() + selectedPaymentMethod.brand.slice(1)}
          </p>
          <p className="text-sm">
            •••• {selectedPaymentMethod.last4}
          </p>
          <div className="flex items-center mt-2 text-xs text-gray-500">
            <Shield className="h-3 w-3 mr-1" />
            <span>Payment processed securely via Stripe</span>
          </div>
        </div>
      ) : (
        <p className="text-sm text-red-500">No payment method selected. Please go back and select one.</p>
      )}
    </div>
  );
};

export default PaymentMethodSection;
