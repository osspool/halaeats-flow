
import { useCallback } from 'react';
import { CheckoutState } from '@/types/checkout';
import { useToast } from '@/hooks/use-toast';

interface UseCheckoutStepsProps {
  checkoutState: CheckoutState;
  setCheckoutState: React.Dispatch<React.SetStateAction<CheckoutState>>;
  completeCheckout: () => Promise<void>;
}

export const useCheckoutSteps = ({ 
  checkoutState, 
  setCheckoutState, 
  completeCheckout 
}: UseCheckoutStepsProps) => {
  const nextStep = useCallback(() => {
    console.log('Current step:', checkoutState.step);
    
    switch (checkoutState.step) {
      case 'delivery-method':
        console.log('Moving to payment step');
        setCheckoutState(prev => ({
          ...prev,
          step: 'payment',
        }));
        break;
      case 'payment':
        console.log('Moving to review step');
        setCheckoutState(prev => ({
          ...prev,
          step: 'review',
        }));
        break;
      case 'review':
        console.log('Completing checkout');
        completeCheckout();
        break;
      default:
        console.log('Unknown step:', checkoutState.step);
        break;
    }
  }, [checkoutState.step, completeCheckout, setCheckoutState]);

  const previousStep = useCallback(() => {
    switch (checkoutState.step) {
      case 'payment':
        setCheckoutState(prev => ({
          ...prev,
          step: 'delivery-method',
        }));
        break;
      case 'review':
        setCheckoutState(prev => ({
          ...prev,
          step: 'payment',
        }));
        break;
      default:
        break;
    }
  }, [checkoutState.step, setCheckoutState]);

  return {
    nextStep,
    previousStep
  };
};
