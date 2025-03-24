
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { PaymentMethod } from '@/types/checkout';
import { cn } from '@/lib/utils';
import { ArrowLeft, CreditCard, Plus, Lock } from 'lucide-react';
import { mockPaymentMethods } from '@/data/checkoutMockData';

interface PaymentStepProps {
  selectedPaymentMethodId?: string;
  onPaymentMethodSelect: (paymentMethodId: string) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const PaymentStep = ({
  selectedPaymentMethodId,
  onPaymentMethodSelect,
  onNext,
  onPrevious,
}: PaymentStepProps) => {
  const [paymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [selected, setSelected] = useState<string>(
    selectedPaymentMethodId || paymentMethods.find(p => p.isDefault)?.id || ''
  );

  const handlePaymentMethodChange = (value: string) => {
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
    <div className="space-y-6">
      <h2 className="text-xl font-medium">Payment Method</h2>
      <p className="text-halaeats-600 mb-6">
        Select how you'd like to pay for your order
      </p>

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
                : "border-halaeats-200"
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
                  <span className="ml-2 bg-halaeats-100 text-halaeats-700 text-xs px-2 py-0.5 rounded-full">
                    Default
                  </span>
                )}
              </Label>
              <p className="text-sm text-halaeats-600 mt-1">
                •••• •••• •••• {method.last4}
              </p>
              <p className="text-xs text-halaeats-500">
                Expires {method.expiryMonth}/{method.expiryYear}
              </p>
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          className="flex items-center w-full py-6 border-dashed"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Payment Method
        </Button>
      </RadioGroup>

      <div className="flex items-center justify-center text-xs text-halaeats-500 gap-1 mt-2">
        <Lock className="h-3 w-3" />
        <span>Your payment information is secure and encrypted</span>
      </div>

      <div className="pt-4">
        <Button
          variant="outline"
          className="mb-4"
          onClick={onPrevious}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <Button 
          onClick={onNext}
          className="w-full bg-primary hover:bg-cuisine-600"
          disabled={!selected}
        >
          Review Order
        </Button>
      </div>
    </div>
  );
};

export default PaymentStep;
