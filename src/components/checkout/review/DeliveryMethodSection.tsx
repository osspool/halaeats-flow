
import { Truck } from 'lucide-react';
import { OrderType } from '@/types';
import { Address } from '@/types/checkout';
import { DeliveryQuote } from '@/types/delivery';
import { format } from 'date-fns';

interface DeliveryMethodSectionProps {
  orderType: OrderType;
  selectedAddress?: Address;
  deliveryInstructions?: string;
  deliveryQuote?: DeliveryQuote;
  pickupTime?: string;
}

const DeliveryMethodSection = ({
  orderType,
  selectedAddress,
  deliveryInstructions,
  deliveryQuote,
  pickupTime,
}: DeliveryMethodSectionProps) => {
  const formatEstimatedTime = (isoString?: string) => {
    if (!isoString) return 'Unknown';
    try {
      return format(new Date(isoString), 'h:mm a');
    } catch (e) {
      return 'Unknown';
    }
  };

  return (
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
          
          {deliveryInstructions && (
            <div className="mt-2">
              <p className="text-xs text-gray-500 font-medium">Delivery Instructions:</p>
              <p className="text-sm">{deliveryInstructions}</p>
            </div>
          )}
          
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
          {pickupTime && (
            <p className="text-sm mt-1">Pickup time: <span className="font-medium">{pickupTime}</span></p>
          )}
        </div>
      )}
    </div>
  );
};

export default DeliveryMethodSection;
