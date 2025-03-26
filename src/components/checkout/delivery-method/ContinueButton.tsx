
import React from 'react';
import { Button } from '@/components/ui/button';

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
  
  if (isLoadingPayment) {
    buttonText = "Reserving Your Slot...";
  } else if (isLoadingQuote) {
    buttonText = "Loading Delivery Quote...";
  }
  
  return (
    <Button 
      onClick={onClick}
      className="w-full bg-primary hover:bg-cuisine-600"
      disabled={isDisabled}
    >
      {buttonText}
    </Button>
  );
};

export default ContinueButton;
