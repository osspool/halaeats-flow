
import { CardElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CheckCircle, Lock } from 'lucide-react';
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
  const form = useForm({
    defaultValues: {
      saveCard: true,
      cardholderName: '',
    },
  });

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-blue-700 text-sm flex items-start">
        <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
        <p>Enter your card details. Your payment information is securely processed by Stripe.</p>
      </div>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            onClick={onCancel}
            disabled={isProcessing}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          
          <Button 
            type="submit"
            className="w-full sm:w-auto bg-primary hover:bg-primary/90"
            disabled={isProcessing || !isStripeReady}
          >
            {isProcessing ? 'Processing...' : 'Add Payment Method'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddPaymentMethodForm;
