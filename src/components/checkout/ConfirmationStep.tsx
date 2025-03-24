
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, Clock, MapPin } from 'lucide-react';

const ConfirmationStep = () => {
  // Generate a random order number
  const orderNumber = `HE-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <div className="text-center space-y-6">
      <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
        <CheckCircle2 className="h-10 w-10 text-primary" />
      </div>
      
      <div>
        <h2 className="text-2xl font-medium">Thank You!</h2>
        <p className="text-halaeats-600 mt-2">
          Your order has been placed successfully
        </p>
      </div>
      
      <div className="bg-halaeats-50 p-4 rounded-lg text-left space-y-4">
        <div>
          <p className="text-sm text-halaeats-600">Order Number</p>
          <p className="font-medium">{orderNumber}</p>
        </div>
        
        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <p className="font-medium">Estimated Delivery Time</p>
            <p className="text-sm text-halaeats-600">
              35-45 minutes
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <p className="font-medium">Delivery Address</p>
            <p className="text-sm text-halaeats-600">
              123 Main Street, San Francisco, CA 94105
            </p>
          </div>
        </div>
      </div>
      
      <div className="pt-6">
        <p className="text-sm text-halaeats-600 mb-4">
          We'll send you updates about your order via email and SMS
        </p>
        
        <Link to="/">
          <Button className="bg-primary hover:bg-cuisine-600">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ConfirmationStep;
