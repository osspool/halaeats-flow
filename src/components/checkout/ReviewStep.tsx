import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, ShoppingBag, Truck, MapPin, CreditCard, Shield } from 'lucide-react';
import { OrderSummary, CartItem, OrderType } from '@/types';
import { Address, PaymentMethod } from '@/types/checkout';
import { mockAddresses, mockPaymentMethods } from '@/data/checkoutMockData';
import { useToast } from '@/hooks/use-toast';
import { useCheckout } from '@/hooks/useCheckout';
import { DeliveryQuote } from '@/types/delivery';
import { format } from 'date-fns';

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
  
  const selectedAddress = selectedAddressId 
    ? mockAddresses.find(addr => addr.id === selectedAddressId) 
    : undefined;
    
  const selectedPaymentMethod = selectedPaymentMethodId 
    ? mockPaymentMethods.find(pm => pm.id === selectedPaymentMethodId) 
    : undefined;
  
  // Get delivery quote from checkout state
  const deliveryQuote: DeliveryQuote | undefined = (checkoutState as any).deliveryQuote;

  useEffect(() => {
    console.log('ReviewStep - selectedPaymentMethodId:', selectedPaymentMethodId);
    console.log('ReviewStep - checkoutState:', checkoutState);
  }, [selectedPaymentMethodId, checkoutState]);
  
  const handlePlaceOrder = async () => {
    console.log('Placing order with payment method:', selectedPaymentMethodId);
    
    if (!selectedPaymentMethodId && !checkoutState.selectedPaymentMethodId) {
      toast({
        title: "Payment required",
        description: "Please select a payment method before placing your order.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // For delivery orders, pass the delivery quote to createPaymentIntent
      if (orderType === 'delivery' && deliveryQuote) {
        // Create a payment intent with the delivery quote information - fixed to use only 2 arguments
        await createPaymentIntent(orderSummary.total, items);
      } else {
        // Regular payment intent for pickup orders
        await createPaymentIntent(orderSummary.total, items);
      }
      
      // Place the order (handled in completeCheckout)
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
  
  // Format the estimated delivery time
  const formatEstimatedTime = (isoString?: string) => {
    if (!isoString) return 'Unknown';
    try {
      return format(new Date(isoString), 'h:mm a');
    } catch (e) {
      return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium">Review Your Order</h2>
      <p className="text-gray-600 mb-6">
        Please confirm your order details before proceeding
      </p>

      <div className="space-y-6">
        {/* Order Items */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium flex items-center mb-3">
            <ShoppingBag className="h-4 w-4 mr-2 text-primary" />
            Order Items
          </h3>
          
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-start text-sm">
                <div>
                  <p className="font-medium">{item.menuItem.name} × {item.quantity}</p>
                  <p className="text-xs text-gray-500">{item.caterer.name}</p>
                </div>
                <span>${item.subtotal.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Delivery Method */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium flex items-center mb-3">
            <Truck className="h-4 w-4 mr-2 text-primary" />
            Delivery Method
          </h3>
          
          <p className="text-sm font-medium">
            {orderType === 'delivery' ? 'Delivery' : 'Pickup'}
          </p>
          
          {orderType === 'delivery' && selectedAddress && (
            <div className="mt-2">
              <p className="text-sm font-medium">{selectedAddress.name}</p>
              <p className="text-sm">
                {selectedAddress.street}{selectedAddress.apt ? `, ${selectedAddress.apt}` : ''}
              </p>
              <p className="text-sm">
                {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}
              </p>
              
              {checkoutState.deliveryInstructions && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 font-medium">Delivery Instructions:</p>
                  <p className="text-sm">{checkoutState.deliveryInstructions}</p>
                </div>
              )}
              
              {/* Delivery Quote Information */}
              {deliveryQuote && (
                <div className="mt-3 p-2 bg-primary-50 rounded border border-primary-100">
                  <p className="text-xs text-gray-600 font-medium mb-1">Delivery Information:</p>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                    <span className="text-gray-500">Distance:</span>
                    <span className="font-medium">{deliveryQuote.distance_miles.toFixed(1)} miles</span>
                    
                    <span className="text-gray-500">Estimated Arrival:</span>
                    <span className="font-medium">{formatEstimatedTime(deliveryQuote.estimated_delivery_time)}</span>
                    
                    <span className="text-gray-500">Delivery Fee:</span>
                    <span className="font-medium">${deliveryQuote.fee.toFixed(2)}</span>
                  </div>
                  <p className="text-xs mt-1 text-gray-500">
                    Powered by our delivery service
                  </p>
                </div>
              )}
            </div>
          )}
          
          {orderType === 'pickup' && (
            <div className="mt-2">
              <p className="text-sm">Spice Delight</p>
              <p className="text-sm">123 Food Street, San Francisco, CA 94105</p>
              {checkoutState.pickupTime && (
                <p className="text-sm mt-1">Pickup time: <span className="font-medium">{checkoutState.pickupTime}</span></p>
              )}
            </div>
          )}
        </div>
        
        {/* Payment Method */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium flex items-center mb-3">
            <CreditCard className="h-4 w-4 mr-2 text-primary" />
            Payment Method
          </h3>
          
          {selectedPaymentMethod && (
            <div>
              <p className="text-sm font-medium">
                {selectedPaymentMethod.brand.charAt(0).toUpperCase() + selectedPaymentMethod.brand.slice(1)}
              </p>
              <p className="text-sm">
                •••• {selectedPaymentMethod.last4}
              </p>
              <div className="flex items-center mt-2 text-xs text-gray-500">
                <Shield className="h-3 w-3 mr-1" />
                <span>Payment processed securely via Stripe</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Order Summary */}
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
              <span>
                ${(orderType === 'delivery' && deliveryQuote
                  ? orderSummary.subtotal + deliveryQuote.fee + orderSummary.tax
                  : orderSummary.total
                ).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
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
        
        <Button 
          onClick={handlePlaceOrder}
          className="w-full bg-primary hover:bg-primary/90 h-12"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>Processing Payment...</>
          ) : (
            <>Place Order - ${(orderType === 'delivery' && deliveryQuote
              ? orderSummary.subtotal + deliveryQuote.fee + orderSummary.tax
              : orderSummary.total
            ).toFixed(2)}</>
          )}
        </Button>
        
        <p className="text-xs text-center text-gray-500 mt-3">
          By placing your order, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default ReviewStep;
