
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { OrderSummary, CartItem, OrderType } from '@/types';
import { mockAddresses, mockPaymentMethods } from '@/data/checkoutMockData';
import { useToast } from '@/hooks/use-toast';
import { useCheckout } from '@/hooks/useCheckout';

// Import the new component sections
import OrderItemsSection from './review/OrderItemsSection';
import DeliveryMethodSection from './review/DeliveryMethodSection';
import PaymentMethodSection from './review/PaymentMethodSection';
import OrderSummarySection from './review/OrderSummarySection';
import PlaceOrderButton from './review/PlaceOrderButton';

interface ReviewStepProps {
  items: CartItem[];
  orderSummary: OrderSummary;
  orderType: OrderType;
  selectedAddressId?: string;
  selectedPaymentMethodId?: string;
  onNext: () => void;
  onPrevious: () => void;
}

const ReviewStep = ({
  items,
  orderSummary,
  orderType,
  selectedAddressId,
  selectedPaymentMethodId,
  onNext,
  onPrevious,
}: ReviewStepProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { createPaymentIntent, checkoutState } = useCheckout();
  
  const effectivePaymentMethodId = selectedPaymentMethodId || checkoutState.selectedPaymentMethodId;
  const effectiveAddressId = selectedAddressId || checkoutState.selectedAddressId;
  
  const selectedAddress = effectiveAddressId 
    ? mockAddresses.find(addr => addr.id === effectiveAddressId) 
    : undefined;
    
  const selectedPaymentMethod = effectivePaymentMethodId 
    ? mockPaymentMethods.find(pm => pm.id === effectivePaymentMethodId) 
    : undefined;
  
  const deliveryQuote = checkoutState.deliveryQuote;

  useEffect(() => {
    console.log('ReviewStep - selectedPaymentMethodId prop:', selectedPaymentMethodId);
    console.log('ReviewStep - checkoutState:', checkoutState);
    console.log('ReviewStep - effective payment method ID:', effectivePaymentMethodId);
    console.log('ReviewStep - selected payment method:', selectedPaymentMethod);
    
    if (!effectivePaymentMethodId) {
      console.warn('No payment method selected in ReviewStep');
    }
    
    if (orderType === 'delivery' && !effectiveAddressId) {
      console.warn('No address selected for delivery in ReviewStep');
    }
  }, [selectedPaymentMethodId, checkoutState, effectivePaymentMethodId, selectedPaymentMethod, orderType, effectiveAddressId]);
  
  const handlePlaceOrder = async () => {
    console.log('Placing order with payment method:', effectivePaymentMethodId);
    
    if (!effectivePaymentMethodId) {
      toast({
        title: "Payment required",
        description: "Please select a payment method before placing your order.",
        variant: "destructive",
      });
      return;
    }
    
    if (orderType === 'delivery' && !effectiveAddressId) {
      toast({
        title: "Address required",
        description: "Please select a delivery address before placing your order.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Generate a mock order that will be used to create the payment intent
      // If we don't have real items, create a fallback item
      const orderItems = items.length > 0 ? items : [{
        id: 'fallback-item',
        quantity: 1,
        subtotal: orderSummary.subtotal,
        menuItem: { name: 'Your Order', description: '', price: orderSummary.subtotal },
        caterer: { id: 'cat_default', name: 'Restaurant' },
      }];
      
      await createPaymentIntent(orderSummary.total, orderItems);
      
      onNext();
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Order failed",
        description: "There was a problem processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium">Review Your Order</h2>
      <p className="text-gray-600 mb-6">
        Please confirm your order details before proceeding
      </p>

      <div className="space-y-6">
        <OrderItemsSection items={items} />
        
        <DeliveryMethodSection 
          orderType={orderType}
          selectedAddress={selectedAddress}
          deliveryInstructions={checkoutState.deliveryInstructions}
          deliveryQuote={deliveryQuote}
          pickupTime={checkoutState.pickupTime}
        />
        
        <PaymentMethodSection selectedPaymentMethod={selectedPaymentMethod} />
        
        <OrderSummarySection 
          orderSummary={orderSummary}
          deliveryQuote={deliveryQuote}
          orderType={orderType}
        />
      </div>

      <div className="pt-4">
        <Button
          variant="outline"
          className="mb-4"
          onClick={onPrevious}
          disabled={isProcessing}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <PlaceOrderButton
          isProcessing={isProcessing}
          disabled={!selectedPaymentMethod}
          orderType={orderType}
          orderSummary={orderSummary}
          deliveryQuote={deliveryQuote}
          onClick={handlePlaceOrder}
        />
        
        <p className="text-xs text-center text-gray-500 mt-3">
          By placing your order, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default ReviewStep;
