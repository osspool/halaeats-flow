
import { OrderSummary } from '@/types';
import { DeliveryQuote } from '@/types/delivery';
import { OrderType } from '@/types';

interface OrderSummarySectionProps {
  orderSummary: OrderSummary;
  deliveryQuote?: DeliveryQuote;
  orderType: OrderType;
}

const OrderSummarySection = ({ 
  orderSummary, 
  deliveryQuote,
  orderType 
}: OrderSummarySectionProps) => {
  const total = orderType === 'delivery' && deliveryQuote
    ? orderSummary.subtotal + deliveryQuote.fee + orderSummary.tax
    : orderSummary.total;

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="font-medium mb-3">Order Summary</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>${orderSummary.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Delivery Fee</span>
          <span>${(deliveryQuote?.fee || orderSummary.deliveryFee).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Tax</span>
          <span>${orderSummary.tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-medium pt-2 border-t border-gray-200 mt-2">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummarySection;
