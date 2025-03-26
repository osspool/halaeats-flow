
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ContinueButtonProps {
  onClick: (e: React.MouseEvent) => void;
  isDisabled: boolean;
  isLoadingPayment: boolean;
  isLoadingQuote: boolean;
}

const ContinueButton = ({
  onClick,
  isDisabled,
  isLoadingPayment,
  isLoadingQuote
}: ContinueButtonProps) => {
  let buttonText = "Continue to Payment";
  let isLoading = isLoadingPayment || isLoadingQuote;
  
  if (isLoadingPayment) {
    buttonText = "Reserving Your Slot...";
  } else if (isLoadingQuote) {
    buttonText = "Loading Delivery Quote...";
  }
  
  console.log("ContinueButton state:", { isDisabled, isLoading, isLoadingPayment, isLoadingQuote });
  
  return (
    <Button 
      onClick={onClick}
      className="w-full bg-primary hover:bg-cuisine-600"
      disabled={isDisabled || isLoading}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {buttonText}
    </Button>
  );
};

export default ContinueButton;
