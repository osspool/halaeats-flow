
import { Button } from '@/components/ui/button';
import { OrderType } from '@/types';
import { OrderSummary } from '@/types';
import { DeliveryQuote } from '@/types/delivery';

interface PlaceOrderButtonProps {
  isProcessing: boolean;
  disabled: boolean;
  orderType: OrderType;
  orderSummary: OrderSummary;
  deliveryQuote?: DeliveryQuote;
  onClick: () => void;
}

const PlaceOrderButton = ({
  isProcessing,
  disabled,
  orderType,
  orderSummary,
  deliveryQuote,
  onClick,
}: PlaceOrderButtonProps) => {
  const total = orderType === 'delivery' && deliveryQuote
    ? orderSummary.subtotal + deliveryQuote.fee + orderSummary.tax
    : orderSummary.total;

  return (
    <Button 
      onClick={onClick}
      className="w-full bg-primary hover:bg-primary/90 h-12"
      disabled={isProcessing || disabled}
    >
      {isProcessing ? (
        <>Processing Payment...</>
      ) : (
        <>Place Order - ${total.toFixed(2)}</>
      )}
    </Button>
  );
};

export default PlaceOrderButton;
