
import { CreditCard, Shield, Paypal, Bank, AppleIcon } from 'lucide-react';
import { PaymentMethod } from '@/types/checkout';

interface PaymentMethodSectionProps {
  selectedPaymentMethod?: PaymentMethod;
}

const PaymentMethodSection = ({ selectedPaymentMethod }: PaymentMethodSectionProps) => {
  // Function to get the appropriate icon based on payment method type
  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'paypal':
        return <Paypal className="h-4 w-4 mr-2 text-primary" />;
      case 'bank_transfer':
        return <Bank className="h-4 w-4 mr-2 text-primary" />;
      case 'apple_pay':
        return <AppleIcon className="h-4 w-4 mr-2 text-primary" />;
      case 'google_pay':
        return <CreditCard className="h-4 w-4 mr-2 text-primary" />;
      case 'card':
      default:
        return <CreditCard className="h-4 w-4 mr-2 text-primary" />;
    }
  };
  
  // Function to get the display name for the payment method
  const getPaymentMethodDisplayName = (method: PaymentMethod) => {
    switch (method.type) {
      case 'paypal':
        return 'PayPal';
      case 'bank_transfer':
        return method.bankName || 'Bank Transfer';
      case 'apple_pay':
        return 'Apple Pay';
      case 'google_pay':
        return 'Google Pay';
      case 'card':
        return method.brand ? 
          (method.brand.charAt(0).toUpperCase() + method.brand.slice(1)) : 
          'Credit Card';
      default:
        return 'Payment Method';
    }
  };
  
  // Function to get the secondary display info for payment method
  const getPaymentMethodDetail = (method: PaymentMethod) => {
    switch (method.type) {
      case 'paypal':
        return method.email || 'PayPal Account';
      case 'bank_transfer':
        return method.last4 ? `Ending in ${method.last4}` : 'Bank Account';
      case 'card':
        return method.last4 ? `•••• ${method.last4}` : '';
      default:
        return '';
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="font-medium flex items-center mb-3">
        {selectedPaymentMethod ? 
          getPaymentIcon(selectedPaymentMethod.type) : 
          <CreditCard className="h-4 w-4 mr-2 text-primary" />}
        Payment Method
      </h3>
      
      {selectedPaymentMethod ? (
        <div>
          <p className="text-sm font-medium">
            {getPaymentMethodDisplayName(selectedPaymentMethod)}
          </p>
          <p className="text-sm">
            {getPaymentMethodDetail(selectedPaymentMethod)}
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
