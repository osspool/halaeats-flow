
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, ShoppingBag, Truck, MapPin, CreditCard, Shield } from 'lucide-react';
import { OrderSummary, CartItem, OrderType } from '@/types';
import { Address, PaymentMethod } from '@/types/checkout';
import { mockAddresses, mockPaymentMethods, createMockPaymentIntent, confirmMockPaymentIntent } from '@/data/checkoutMockData';
import { useToast } from '@/hooks/use-toast';
import { useCheckout } from '@/hooks/useCheckout';

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
  
  const handlePlaceOrder = async () => {
    if (!selectedPaymentMethodId) {
      toast({
        title: "Payment required",
        description: "Please select a payment method before placing your order.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Implement Stripe Connect flow
    try {
      // Step 1: Create a payment intent
      await createPaymentIntent(orderSummary.total, items);
      
      // Step 2: Place the order (handled in completeCheckout)
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
              <span>${orderSummary.deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>${orderSummary.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium pt-2 border-t border-gray-200 mt-2">
              <span>Total</span>
              <span>${orderSummary.total.toFixed(2)}</span>
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
            <>Place Order - ${orderSummary.total.toFixed(2)}</>
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
