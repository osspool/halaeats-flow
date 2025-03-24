
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { PaymentMethod } from '@/types/checkout';
import { cn } from '@/lib/utils';
import { ArrowLeft, CreditCard, Plus, Lock, CheckCircle } from 'lucide-react';
import { mockPaymentMethods } from '@/data/checkoutMockData';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

interface PaymentStepProps {
  selectedPaymentMethodId?: string;
  onPaymentMethodSelect: (paymentMethodId: string) => void;
  onNext: () => void;
  onPrevious: () => void;
}

interface NewCardFormData {
  cardNumber: string;
  expiry: string;
  cvc: string;
  name: string;
  saveCard: boolean;
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
  const [addingNewCard, setAddingNewCard] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<NewCardFormData>({
    defaultValues: {
      cardNumber: '',
      expiry: '',
      cvc: '',
      name: '',
      saveCard: true,
    },
  });

  const handlePaymentMethodChange = (value: string) => {
    setSelected(value);
    onPaymentMethodSelect(value);
  };

  // Mock function to simulate creating a payment method with Stripe
  const createMockStripePaymentMethod = async (cardData: NewCardFormData) => {
    setIsProcessing(true);
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate success response from Stripe Connect
    const response = {
      id: `pm_${Math.random().toString(36).substring(2, 10)}`,
      object: 'payment_method',
      card: {
        brand: 'visa',
        last4: cardData.cardNumber.slice(-4),
        exp_month: parseInt(cardData.expiry.split('/')[0]),
        exp_year: parseInt(`20${cardData.expiry.split('/')[1]}`),
      },
      created: Date.now() / 1000,
      customer: null,
      livemode: false,
    };
    
    setIsProcessing(false);
    return response;
  };

  const onSubmitNewCard = async (data: NewCardFormData) => {
    try {
      // Mock create payment method via Stripe Connect
      const paymentMethod = await createMockStripePaymentMethod(data);
      
      // Add to saved methods if user opted to save
      if (data.saveCard) {
        const newPaymentMethod: PaymentMethod = {
          id: paymentMethod.id,
          brand: paymentMethod.card.brand,
          last4: paymentMethod.card.last4,
          expiryMonth: paymentMethod.card.exp_month,
          expiryYear: paymentMethod.card.exp_year,
          isDefault: false,
        };
        
        // In a real app, this would be an API call to save to the database
        // Mock behavior here
        console.log('Adding new payment method to account:', newPaymentMethod);
        
        // Update local state for demo purposes
        paymentMethods.push(newPaymentMethod);
        setSelected(newPaymentMethod.id);
        onPaymentMethodSelect(newPaymentMethod.id);
      }
      
      toast({
        title: "Card added successfully",
        description: "Your new payment method has been added.",
      });
      
      setAddingNewCard(false);
    } catch (error) {
      console.error('Error adding card:', error);
      toast({
        title: "Failed to add card",
        description: "There was a problem adding your card. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleContinue = () => {
    if (!selected) {
      toast({
        title: "Payment method required",
        description: "Please select a payment method to continue.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real implementation, this would create a SetupIntent or PaymentIntent
    // with Stripe, depending on the checkout flow

    // Mock a successful payment setup
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onNext();
    }, 1000);
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
      <p className="text-gray-600 mb-6">
        Select how you'd like to pay for your order
      </p>

      {!addingNewCard ? (
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
              onClick={() => setAddingNewCard(true)}
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

          <div className="pt-4 flex flex-col md:flex-row md:justify-between gap-4">
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={isProcessing}
              className="md:w-auto w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <Button 
              onClick={handleContinue}
              className="w-full md:w-auto bg-primary hover:bg-primary/90"
              disabled={!selected || isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Continue to Review'}
            </Button>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-blue-700 text-sm flex items-start">
            <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <p>For demo purposes, you can enter any valid-looking card details. No real charges will be made.</p>
          </div>
          
          <form onSubmit={form.handleSubmit(onSubmitNewCard)} className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="form-group">
                  <Label htmlFor="cardName">Name on Card</Label>
                  <Input
                    id="cardName"
                    placeholder="John Doe"
                    {...form.register('name')}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="4242 4242 4242 4242"
                  maxLength={19}
                  {...form.register('cardNumber')}
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <Label htmlFor="cardExpiry">Expiry Date</Label>
                  <Input
                    id="cardExpiry"
                    placeholder="MM/YY"
                    maxLength={5}
                    {...form.register('expiry')}
                    className="mt-1"
                  />
                </div>
                
                <div className="form-group">
                  <Label htmlFor="cardCvc">Security Code</Label>
                  <Input
                    id="cardCvc"
                    placeholder="CVC"
                    maxLength={3}
                    {...form.register('cvc')}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="saveCard"
                  checked={form.getValues().saveCard}
                  onChange={(e) => form.setValue('saveCard', e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <Label 
                  htmlFor="saveCard" 
                  className="ml-2 block text-sm text-gray-700"
                >
                  Save card for future payments
                </Label>
              </div>
            </div>
            
            <div className="flex items-center justify-center text-xs text-gray-500 gap-1 mt-2">
              <Lock className="h-3 w-3" />
              <span>Your payment information is secure and encrypted via Stripe</span>
            </div>
            
            <div className="pt-4 flex flex-col-reverse sm:flex-row justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddingNewCard(false)}
                disabled={isProcessing}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              
              <Button 
                type="submit"
                className="w-full sm:w-auto bg-primary hover:bg-primary/90"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Add Payment Method'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PaymentStep;
