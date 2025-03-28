
import { useState } from 'react';
import { CardElement, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Lock, CreditCard, Paypal, Bank } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface AddPaymentMethodFormProps {
  onCancel: () => void;
  onSubmit: (data: any) => void;
  isProcessing: boolean;
  isStripeReady: boolean;
}

const AddPaymentMethodForm = ({
  onCancel,
  onSubmit,
  isProcessing,
  isStripeReady,
}: AddPaymentMethodFormProps) => {
  const [paymentType, setPaymentType] = useState<'card' | 'paypal' | 'bank'>('card');
  const form = useForm({
    defaultValues: {
      saveCard: true,
      cardholderName: '',
    },
  });

  const handlePaymentTypeChange = (type: 'card' | 'paypal' | 'bank') => {
    setPaymentType(type);
  };
  
  const handleFormSubmit = (data: any) => {
    data.paymentType = paymentType;
    onSubmit(data);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-blue-700 text-sm flex items-start">
        <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
        <p>Choose your preferred payment method. Your payment information is securely processed.</p>
      </div>
      
      <Tabs defaultValue="card" className="w-full" onValueChange={(v) => handlePaymentTypeChange(v as any)}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="card" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span>Card</span>
          </TabsTrigger>
          <TabsTrigger value="paypal" className="flex items-center gap-2">
            <Paypal className="h-4 w-4" />
            <span>PayPal</span>
          </TabsTrigger>
          <TabsTrigger value="bank" className="flex items-center gap-2">
            <Bank className="h-4 w-4" />
            <span>Bank</span>
          </TabsTrigger>
        </TabsList>
        
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
          <TabsContent value="card" className="space-y-4">
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
                {isStripeReady ? (
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
                ) : (
                  <div className="text-center py-2 text-gray-500">Loading payment form...</div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="paypal" className="space-y-4">
            <div className="text-center p-6 border rounded-lg border-dashed border-gray-300">
              <Paypal className="h-12 w-12 mx-auto text-blue-600 mb-3" />
              <p className="text-gray-600">
                You'll be redirected to PayPal to complete your payment securely.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="bank" className="space-y-4">
            <div className="form-group">
              <Label htmlFor="accountName">Account Holder Name</Label>
              <Input
                id="accountName"
                placeholder="John Doe"
                className="mt-1"
              />
            </div>
            
            <div className="form-group">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                placeholder="Bank of America"
                className="mt-1"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <Label htmlFor="routingNumber">Routing Number</Label>
                <Input
                  id="routingNumber"
                  placeholder="XXXXXXXXX"
                  className="mt-1"
                />
              </div>
              <div className="form-group">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  placeholder="XXXXXXXXX"
                  className="mt-1"
                />
              </div>
            </div>
          </TabsContent>
          
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
              Save payment method for future payments
            </Label>
          </div>
          
          <div className="flex items-center justify-center text-xs text-gray-500 gap-1 mt-2">
            <Lock className="h-3 w-3" />
            <span>Your payment information is secure and encrypted via Stripe</span>
          </div>
          
          <div className="pt-4 flex flex-col-reverse sm:flex-row justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isProcessing}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            
            <Button 
              type="submit"
              className="w-full sm:w-auto bg-primary hover:bg-primary/90"
              disabled={isProcessing || (paymentType === 'card' && !isStripeReady)}
            >
              {isProcessing ? 'Processing...' : 'Add Payment Method'}
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  );
};

export default AddPaymentMethodForm;
