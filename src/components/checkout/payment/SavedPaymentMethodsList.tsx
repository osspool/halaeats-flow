import { 
  CreditCard, 
  Plus, 
  Check 
} from 'lucide-react';
import { PaypalIcon, BankIcon, AppleIcon, GooglePayIcon } from './PaymentIcons';
import { PaymentMethod } from '@/types/checkout';

interface SavedPaymentMethodsListProps {
  paymentMethods: PaymentMethod[];
  selectedPaymentMethodId?: string;
  onPaymentMethodSelect: (id: string) => void;
  onAddNewCard: () => void;
}

const SavedPaymentMethodsList = ({
  paymentMethods,
  selectedPaymentMethodId,
  onPaymentMethodSelect,
  onAddNewCard,
}: SavedPaymentMethodsListProps) => {
  
  // Get appropriate icon for payment method type
  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'paypal':
        return <PaypalIcon className="h-5 w-5 text-blue-600" />;
      case 'bank_transfer':
        return <BankIcon className="h-5 w-5 text-green-600" />;
      case 'apple_pay':
        return <AppleIcon className="h-5 w-5 text-black" />;
      case 'google_pay':
        return <GooglePayIcon className="h-5 w-5 text-gray-600" />;
      case 'card':
      default:
        return <CreditCard className="h-5 w-5 text-primary" />;
    }
  };
  
  // Get display name for payment method
  const getPaymentMethodName = (method: PaymentMethod) => {
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
          `${method.brand.charAt(0).toUpperCase() + method.brand.slice(1)}` :
          'Credit Card';
      default:
        return 'Payment Method';
    }
  };
  
  // Get description text for payment method
  const getPaymentMethodDescription = (method: PaymentMethod) => {
    switch (method.type) {
      case 'paypal':
        return method.email || '';
      case 'bank_transfer':
        return method.last4 ? `Ending in ${method.last4}` : '';
      case 'card':
        return method.last4 ? 
          `Ending in ${method.last4} - Expires ${method.expiryMonth}/${method.expiryYear}` : 
          '';
      default:
        return '';
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700">Your saved payment methods</h3>
      
      <div className="border rounded-lg divide-y">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedPaymentMethodId === method.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''
            }`}
            onClick={() => onPaymentMethodSelect(method.id)}
          >
            <div className="flex items-center">
              <div className="mr-3">
                {getPaymentMethodIcon(method.type)}
              </div>
              <div>
                <div className="font-medium">
                  {getPaymentMethodName(method)}
                  {method.isDefault && <span className="ml-2 text-xs text-primary">(Default)</span>}
                </div>
                <div className="text-sm text-gray-500">
                  {getPaymentMethodDescription(method)}
                </div>
              </div>
            </div>
            
            {selectedPaymentMethodId === method.id && (
              <Check className="h-5 w-5 text-primary" />
            )}
          </div>
        ))}
        
        <div
          className="p-4 flex items-center cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={onAddNewCard}
        >
          <div className="mr-3 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
            <Plus className="h-5 w-5 text-gray-600" />
          </div>
          <div className="font-medium">Add new payment method</div>
        </div>
      </div>
    </div>
  );
};

export default SavedPaymentMethodsList;
