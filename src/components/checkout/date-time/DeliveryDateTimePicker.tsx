
import { useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Truck } from 'lucide-react';
import { TimeSlotSelector } from '@/components/shared/time-slots';
import { TimeSlot } from '@/components/shared/time-slots/types';
import { DeliveryQuote } from '@/types/delivery';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface DeliveryDateTimePickerProps {
  orderType: 'delivery' | 'pickup';
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  selectedSlot: string | null;
  onSlotSelect: (slotId: string) => void;
  availableTimeSlots: TimeSlot[];
  isLoadingTimeSlots: boolean;
  deliveryQuote?: DeliveryQuote | null;
  isLoadingQuote?: boolean;
  onRefreshQuote?: () => void;
}

const DeliveryDateTimePicker = ({
  orderType,
  selectedDate,
  onDateChange,
  selectedSlot,
  onSlotSelect,
  availableTimeSlots,
  isLoadingTimeSlots,
  deliveryQuote,
  isLoadingQuote = false,
  onRefreshQuote,
}: DeliveryDateTimePickerProps) => {
  const title = orderType === 'delivery' ? 'Delivery' : 'Pickup';
  const previousSlotRef = useRef<string | null>(selectedSlot);
  
  // Only refresh quote when time slot actually changes
  useEffect(() => {
    if (orderType === 'delivery' && 
        selectedSlot && 
        onRefreshQuote && 
        previousSlotRef.current !== selectedSlot) {
      console.log('Time slot changed from', previousSlotRef.current, 'to', selectedSlot, 'refreshing delivery quote');
      onRefreshQuote();
      previousSlotRef.current = selectedSlot;
    }
  }, [selectedSlot, orderType, onRefreshQuote]);
  
  // Format the estimated delivery time
  const formatEstimatedTime = (isoString: string) => {
    try {
      return format(new Date(isoString), 'h:mm a');
    } catch (e) {
      return 'Unknown';
    }
  };
  
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium mb-2">{title} Date</h3>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? (
                format(selectedDate, 'PPP')
              ) : (
                <span>Pick a {title.toLowerCase()} date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onDateChange}
              initialFocus
              className="p-3 pointer-events-auto"
              disabled={(date) => {
                // Disable past dates
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                // Disable dates more than 14 days in advance
                const twoWeeksFromNow = new Date();
                twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
                
                return date < today || date > twoWeeksFromNow;
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Only show time slots if a date is selected */}
      {selectedDate && (
        <div>
          <h3 className="font-medium mb-2">{title} Time</h3>
          <TimeSlotSelector
            slots={availableTimeSlots}
            selectedSlot={selectedSlot}
            onSelectSlot={onSlotSelect}
            label={`Available Time Slots for ${format(selectedDate, 'MMMM d, yyyy')}`}
            showCapacity={true}
            layout="grid"
            emptyMessage={isLoadingTimeSlots ? "Loading available slots..." : `No ${title.toLowerCase()} slots available for this date. Please select another date.`}
          />
        </div>
      )}
      
      {/* Delivery Quote information (for delivery only) */}
      {orderType === 'delivery' && deliveryQuote && (
        <Card className="p-4 bg-primary-50 border border-primary-200">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium flex items-center">
              <Truck className="h-4 w-4 mr-1" />
              Delivery Quote
            </h4>
            <Badge 
              variant={deliveryQuote.status === 'active' ? 'outline' : 'destructive'}
              className={deliveryQuote.status === 'active' ? 'bg-green-100 text-green-800' : ''}
            >
              {deliveryQuote.status === 'active' ? 'Active' : 'Expired'}
            </Badge>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Fee:</span>
              <span className="font-medium">${deliveryQuote.fee.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Est. Delivery:</span>
              <span className="font-medium">
                {formatEstimatedTime(deliveryQuote.estimated_delivery_time)}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Distance:</span>
              <span className="font-medium">{deliveryQuote.distance_miles.toFixed(1)} miles</span>
            </div>
            
            {deliveryQuote.status === 'expired' && onRefreshQuote && (
              <Button 
                variant="outline" 
                size="sm"
                className="w-full mt-2"
                onClick={onRefreshQuote}
                disabled={isLoadingQuote}
              >
                {isLoadingQuote ? 'Refreshing...' : 'Refresh Quote'}
              </Button>
            )}
            
            <p className="text-xs text-gray-500 mt-1">
              {deliveryQuote.status === 'active' 
                ? 'This quote is valid for 5 minutes.' 
                : 'This quote has expired. Please refresh to get updated pricing.'}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default DeliveryDateTimePicker;
