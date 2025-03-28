
import { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { PaymentMethod } from '@/types/checkout';
import { ArrowLeft } from 'lucide-react';
import { mockPaymentMethods } from '@/data/checkoutMockData';
import { useToast } from '@/hooks/use-toast';
import SavedPaymentMethodsList from './SavedPaymentMethodsList';
import AddPaymentMethodForm from './AddPaymentMethodForm';

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

  useEffect(() => {
    // Log the current selected payment method for debugging
    console.log('PaymentStep - selected payment method:', selected);
    console.log('PaymentStep - selectedPaymentMethodId prop:', selectedPaymentMethodId);
    
    // If a payment method is selected, call the parent callback
    if (selected) {
      onPaymentMethodSelect(selected);
    }
  }, [selected, selectedPaymentMethodId, onPaymentMethodSelect]);

  const handleAddNewCard = () => {
    setAddingNewCard(true);
  };

  const handleCancelAddCard = () => {
    setAddingNewCard(false);
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
      // Get card element
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }
      
      // In a real implementation, this would use Stripe.js to create the payment method
      const result = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: data.cardholderName,
        },
      });
      
      if (result.error) {
        throw result.error;
      }
      
      if (result.paymentMethod) {
        if (data.saveCard) {
          // In a real app, you would send this to your server to save
          const newPaymentMethod: PaymentMethod = {
            id: result.paymentMethod.id,
            type: 'card', // Add the required type property
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
    
    // Make sure to call onPaymentMethodSelect before proceeding
    onPaymentMethodSelect(selected);
    
    // Mock a successful payment setup
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onNext();
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium">Payment Method</h2>
      <p className="text-gray-600 mb-6">
        Select how you'd like to pay for your order
      </p>

      {!addingNewCard ? (
        <>
          <SavedPaymentMethodsList
            paymentMethods={paymentMethods}
            selectedPaymentMethodId={selected}
            onPaymentMethodSelect={setSelected}
            onAddNewCard={handleAddNewCard}
          />

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
        <AddPaymentMethodForm
          onCancel={handleCancelAddCard}
          onSubmit={onSubmitNewCard}
          isProcessing={isProcessing}
          isStripeReady={!!stripe && !!elements}
        />
      )}
    </div>
  );
};

export default PaymentStep;
