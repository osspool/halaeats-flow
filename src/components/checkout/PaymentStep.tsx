
import { useState, useEffect } from 'react';
import { useStripe, useElements, PaymentElement, CardElement } from '@stripe/react-stripe-js';
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
  
  // Stripe hooks
  const stripe = useStripe();
  const elements = useElements();
  
  const form = useForm({
    defaultValues: {
      saveCard: true,
      cardholderName: '',
    },
  });

  useEffect(() => {
    // Log the current selected payment method for debugging
    console.log('PaymentStep - selected payment method:', selected);
    console.log('PaymentStep - selectedPaymentMethodId prop:', selectedPaymentMethodId);
    
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

  const onSubmitNewCard = async (data: any) => {
    if (!stripe || !elements) {
      console.error('Stripe has not loaded properly');
      toast({
        title: "Error",
        description: "Payment system not initialized correctly. Please try again later.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // In a real implementation, this would use Stripe.js to create the payment method
      const result = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement)!,
        billing_details: {
          name: data.cardholderName,
        },
      });
      
      if (result.error) {
        // Fixed: Don't try to construct StripeError, just throw the error object
        throw result.error;
      }
      
      if (result.paymentMethod) {
        if (data.saveCard) {
          // In a real app, you would send this to your server to save
          const newPaymentMethod: PaymentMethod = {
            id: result.paymentMethod.id,
            brand: result.paymentMethod.card?.brand || 'unknown',
            last4: result.paymentMethod.card?.last4 || '0000',
            expiryMonth: result.paymentMethod.card?.exp_month || 1,
            expiryYear: result.paymentMethod.card?.exp_year || 2023,
            isDefault: false,
          };
          
          console.log('Adding new payment method:', newPaymentMethod);
          
          // For demo purposes
          paymentMethods.push(newPaymentMethod);
          setSelected(newPaymentMethod.id);
          onPaymentMethodSelect(newPaymentMethod.id);
        }
        
        toast({
          title: "Card added successfully",
          description: "Your new payment method has been added.",
        });
        
        setAddingNewCard(false);
      }
    } catch (error) {
      console.error('Error adding card:', error);
      toast({
        title: "Failed to add card",
        description: "There was a problem adding your card. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinue = () => {
    console.log('Continue clicked with selected payment method:', selected);
    
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
            <p>Enter your card details. Your payment information is securely processed by Stripe.</p>
          </div>
          
          <form onSubmit={form.handleSubmit(onSubmitNewCard)} className="space-y-4">
            <div className="space-y-4">
              <div className="form-group">
                <Label htmlFor="cardholderName">Name on Card</Label>
                <Input
                  id="cardholderName"
                  placeholder="John Doe"
                  {...form.register('cardholderName')}
                  className="mt-1"
                />
              </div>
              
              <div className="form-group">
                <Label htmlFor="card-element">Card Details</Label>
                <div className="border border-gray-300 rounded p-3 mt-1 bg-white">
                  <CardElement
                    id="card-element"
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#424770',
                          '::placeholder': {
                            color: '#aab7c4',
                          },
                        },
                        invalid: {
                          color: '#9e2146',
                        },
                      },
                    }}
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
                disabled={isProcessing || !stripe || !elements}
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
