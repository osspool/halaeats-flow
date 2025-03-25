
import { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PaymentMethod } from '@/types/checkout';
import { cn } from '@/lib/utils';
import { Plus, Lock } from 'lucide-react';

interface SavedPaymentMethodsListProps {
  paymentMethods: PaymentMethod[];
  selectedPaymentMethodId?: string;
  onPaymentMethodSelect: (paymentMethodId: string) => void;
  onAddNewCard: () => void;
}

const SavedPaymentMethodsList = ({
  paymentMethods,
  selectedPaymentMethodId,
  onPaymentMethodSelect,
  onAddNewCard,
}: SavedPaymentMethodsListProps) => {
  const [selected, setSelected] = useState<string>(
    selectedPaymentMethodId || paymentMethods.find(p => p.isDefault)?.id || ''
  );

  useEffect(() => {
    // Log the current selected payment method for debugging
    console.log('SavedPaymentMethodsList - selected payment method:', selected);
    console.log('SavedPaymentMethodsList - selectedPaymentMethodId prop:', selectedPaymentMethodId);
    
    // If a payment method is selected, call the parent callback
    if (selected) {
      onPaymentMethodSelect(selected);
    }
  }, [selected, selectedPaymentMethodId, onPaymentMethodSelect]);

  const handlePaymentMethodChange = (value: string) => {
    console.log('Payment method changed to:', value);
    setSelected(value);
    onPaymentMethodSelect(value);
  };

  const getCardIcon = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return '💳 Visa';
      case 'mastercard':
        return '💳 Mastercard';
      case 'amex':
        return '💳 Amex';
      default:
        return '💳 Card';
    }
  };

  return (
    <>
      <RadioGroup
        value={selected}
        onValueChange={handlePaymentMethodChange}
        className="space-y-3"
      >
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={cn(
              "flex items-start space-x-3 border rounded-lg p-4 transition-colors",
              selected === method.id
                ? "border-primary bg-primary/5"
                : "border-gray-200"
            )}
          >
            <RadioGroupItem value={method.id} id={method.id} className="mt-1" />
            <div className="flex-1">
              <Label
                htmlFor={method.id}
                className="font-medium flex items-center cursor-pointer"
              >
                {getCardIcon(method.brand)}
                {method.isDefault && (
                  <span className="ml-2 bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                    Default
                  </span>
                )}
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                •••• •••• •••• {method.last4}
              </p>
              <p className="text-xs text-gray-500">
                Expires {method.expiryMonth}/{method.expiryYear}
              </p>
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          className="flex items-center w-full py-6 border-dashed"
          onClick={onAddNewCard}
          type="button"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Payment Method
        </Button>
      </RadioGroup>

      <div className="flex items-center justify-center text-xs text-gray-500 gap-1 mt-2">
        <Lock className="h-3 w-3" />
        <span>Your payment information is secure and encrypted</span>
      </div>
    </>
  );
};

export default SavedPaymentMethodsList;
