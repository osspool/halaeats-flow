
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Truck, Package2, CircleCheck, Map, Home, ExternalLink } from 'lucide-react';
import { useCheckout } from '@/hooks/useCheckout';
import { useToast } from '@/hooks/use-toast';
import { DeliveryOrder } from '@/types/delivery';

const ConfirmationStep = () => {
  const navigate = useNavigate();
  const { checkoutState, resetCheckout } = useCheckout();
  const { toast } = useToast();
  const [orderNumber] = useState(`ORD-${Math.floor(100000 + Math.random() * 900000)}`);
  const [estimatedTime] = useState(Math.floor(20 + Math.random() * 20)); // 20-40 minutes
  
  // Get delivery order from checkout state if it exists
  const deliveryOrder = (checkoutState as any).deliveryOrder as DeliveryOrder | undefined;

  useEffect(() => {
    // If the checkout state is not in confirmation step, redirect to home
    if (checkoutState.step !== 'confirmation') {
      navigate('/');
    }
  }, [checkoutState.step, navigate]);

  const handleReturnHome = () => {
    resetCheckout();
    navigate('/');
  };
  
  const handleViewOrder = () => {
    toast({
      title: "Feature coming soon",
      description: "Order tracking will be available in a future update.",
    });
  };
  
  const handleOpenDeliveryTracking = () => {
    if (deliveryOrder?.tracking_url) {
      window.open(deliveryOrder.tracking_url, '_blank');
    } else {
      toast({
        title: "Tracking unavailable",
        description: "Delivery tracking information is not available yet.",
      });
    }
  };

  return (
    <div className="text-center max-w-lg mx-auto space-y-6 py-8">
      <div className="mb-6 flex flex-col items-center">
        <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CircleCheck className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold">Order Confirmed!</h1>
        <p className="text-gray-500 mt-1">
          Your order #{orderNumber} has been received
        </p>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-6 text-left">
        <h2 className="font-medium text-lg mb-4">Order Details</h2>
        
        <div className="space-y-4">
          {checkoutState.orderType === 'delivery' ? (
            <div className="flex items-start">
              <Truck className="h-5 w-5 mr-3 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Delivery</p>
                <p className="text-sm text-gray-600">
                  {deliveryOrder 
                    ? `Your order is being prepared and will be delivered soon.` 
                    : `Estimated delivery in ${estimatedTime} minutes`}
                </p>
                
                {deliveryOrder && deliveryOrder.tracking_url && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={handleOpenDeliveryTracking}
                  >
                    <Map className="h-4 w-4 mr-1" />
                    Track Delivery
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-start">
              <Home className="h-5 w-5 mr-3 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Pickup</p>
                <p className="text-sm text-gray-600">
                  Ready for pickup at {checkoutState.pickupTime}
                </p>
                <p className="text-sm text-gray-600">
                  Spice Delight, 123 Food Street, San Francisco
                </p>
              </div>
            </div>
          )}
          
          <div className="flex items-start">
            <Package2 className="h-5 w-5 mr-3 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Order Status</p>
              <p className="text-sm text-gray-600">
                Your order is being prepared
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-3 pt-4">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleViewOrder}
        >
          View Order Status
        </Button>
        
        <Button 
          className="w-full"
          onClick={handleReturnHome}
        >
          Return to Home
        </Button>
      </div>
      
      <p className="text-sm text-gray-500 pt-3">
        A confirmation email has been sent to your email address.
      </p>
    </div>
  );
};

export default ConfirmationStep;
