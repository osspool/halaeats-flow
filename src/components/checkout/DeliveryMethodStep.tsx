
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Truck, Home, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { OrderType } from '@/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Address } from '@/types/checkout';
import { cn } from '@/lib/utils';
import { mockAddresses } from '@/data/checkoutMockData';
import { useBookTimeSlot, useRestaurantMenu } from '@/hooks/useRestaurantApi';
import { TimeSlotSelector } from '@/components/shared/time-slots';
import { TimeSlot } from '@/components/shared/time-slots/types';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DeliveryMethodStepProps {
  orderType: OrderType;
  onOrderTypeChange: (type: OrderType) => void;
  selectedAddressId?: string;
  onAddressSelect: (addressId: string) => void;
  onDeliveryInstructionsChange: (instructions: string) => void;
  onPickupTimeChange: (time: string) => void;
  onNext: () => void;
}

const DeliveryMethodStep = ({ 
  orderType, 
  onOrderTypeChange, 
  selectedAddressId,
  onAddressSelect,
  onDeliveryInstructionsChange,
  onPickupTimeChange,
  onNext 
}: DeliveryMethodStepProps) => {
  const [selectedType, setSelectedType] = useState<OrderType>(orderType);
  const [addresses] = useState<Address[]>(mockAddresses);
  const [selected, setSelected] = useState<string>(selectedAddressId || addresses.find(a => a.isDefault)?.id || '');
  const [instructions, setInstructions] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  
  // Fetch restaurant menu data to get time slots and capacities
  const { data: menuData, isLoading: isMenuLoading } = useRestaurantMenu();
  const bookTimeSlotMutation = useBookTimeSlot();
  
  // Set initial values when component mounts
  useEffect(() => {
    // Set default address if none is selected
    if (!selected && addresses.length > 0) {
      const defaultAddress = addresses.find(a => a.isDefault)?.id || addresses[0].id;
      setSelected(defaultAddress);
      onAddressSelect(defaultAddress);
    }
  }, [addresses, selected, onAddressSelect]);

  const handleSelect = (value: string) => {
    const type = value as OrderType;
    setSelectedType(type);
    onOrderTypeChange(type);
  };

  const handleAddressChange = (value: string) => {
    setSelected(value);
    onAddressSelect(value);
  };

  const handleInstructionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInstructions(e.target.value);
    onDeliveryInstructionsChange(e.target.value);
  };

  const handleSelectTimeSlot = (slotId: string) => {
    setSelectedSlot(slotId);
    onPickupTimeChange(slotId);
  };

  const handleContinue = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Validation: Don't proceed if delivery is selected but no address is chosen
    if (selectedType === 'delivery' && !selected) return;
    
    // Validation: Don't proceed if no time slot is selected
    if (!selectedSlot) return;
    
    // Attempt to book the selected time slot
    bookTimeSlotMutation.mutate(selectedSlot, {
      onSuccess: (success) => {
        if (success) {
          // Time slot was successfully booked, proceed to next step
          console.log('Time slot booked successfully:', selectedSlot);
          onNext();
        }
        // If booking failed, the mutation will show an error toast
      }
    });
  };

  // Get available time slots for the selected date
  const getAvailableTimeSlotsForDate = (): TimeSlot[] => {
    if (!selectedDate || !menuData) return [];
    
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    
    // Get the time slots for this date from menu data
    const dateTimeSlots = menuData.availableTimeSlots || [];
    const capacities = menuData.timeSlotCapacities || {};
    
    // Convert to the format our TimeSlotSelector component expects
    return dateTimeSlots.map(timeSlot => {
      const capacity = capacities[timeSlot]?.capacity || 5;
      const booked = capacities[timeSlot]?.booked || 0;
      
      return {
        id: timeSlot,
        time: timeSlot,
        capacity,
        booked
      };
    });
  };

  // Generate available time slots
  const availableTimeSlots = getAvailableTimeSlotsForDate();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-medium mb-4">Delivery Method</h2>
        <p className="text-halaeats-600 mb-6">
          Choose how you want to receive your order
        </p>

        <Tabs 
          defaultValue={orderType} 
          className="w-full"
          value={selectedType}
          onValueChange={handleSelect}
        >
          <TabsList className="grid grid-cols-2 w-full mb-6">
            <TabsTrigger value="delivery" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              <span>Delivery</span>
            </TabsTrigger>
            <TabsTrigger value="pickup" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span>Pickup</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="delivery" className="p-4 bg-halaeats-50 rounded-lg space-y-6">
            <div>
              <h3 className="font-medium mb-2">Delivery Address</h3>
              <p className="text-sm text-halaeats-600 mb-4">
                Select where you'd like your order delivered
              </p>

              <RadioGroup
                value={selected}
                onValueChange={handleAddressChange}
                className="space-y-3"
              >
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className={cn(
                      "flex items-start space-x-3 border rounded-lg p-4 transition-colors",
                      selected === address.id
                        ? "border-primary bg-primary/5"
                        : "border-halaeats-200"
                    )}
                  >
                    <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                    <div className="flex-1">
                      <Label
                        htmlFor={address.id}
                        className="font-medium flex items-center cursor-pointer"
                      >
                        {address.name}
                        {address.isDefault && (
                          <span className="ml-2 bg-halaeats-100 text-halaeats-700 text-xs px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                      </Label>
                      <p className="text-sm text-halaeats-600 mt-1">
                        {address.street}{address.apt ? `, ${address.apt}` : ''}
                      </p>
                      <p className="text-sm text-halaeats-600">
                        {address.city}, {address.state} {address.zipCode}
                      </p>
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline"
                  className="flex items-center w-full py-6 border-dashed"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Address
                </Button>
              </RadioGroup>
            </div>
            
            {/* Date and Time Selection */}
            <div className="border-t pt-4 space-y-4">
              <div>
                <h3 className="font-medium mb-2">Delivery Date</h3>
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
                        <span>Pick a delivery date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
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
              
              <div>
                <h3 className="font-medium mb-2">Delivery Time</h3>
                <TimeSlotSelector
                  slots={availableTimeSlots}
                  selectedSlot={selectedSlot}
                  onSelectSlot={handleSelectTimeSlot}
                  label="Available Time Slots"
                  showCapacity={true}
                  layout="grid"
                  emptyMessage="No delivery slots available for this date. Please select another date."
                />
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Delivery Instructions (Optional)</h3>
              <Textarea
                placeholder="Add any special instructions for delivery..."
                value={instructions}
                onChange={handleInstructionsChange}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="pickup" className="p-4 bg-halaeats-50 rounded-lg space-y-6">
            <div>
              <h3 className="font-medium mb-2">Pickup Location</h3>
              <div className="bg-white p-4 rounded-lg border border-halaeats-100">
                <h4 className="font-medium text-halaeats-800 mb-2">Spice Delight</h4>
                <p className="text-sm text-halaeats-600 mb-1">123 Food Street, San Francisco, CA 94105</p>
                <p className="text-sm text-halaeats-600">Open: 11:00 AM - 9:00 PM</p>
              </div>
            </div>

            {/* Date and Time Selection */}
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Pickup Date</h3>
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
                        <span>Pick a pickup date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
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
              
              <div>
                <h3 className="font-medium mb-2">Pickup Time</h3>
                <TimeSlotSelector
                  slots={availableTimeSlots}
                  selectedSlot={selectedSlot}
                  onSelectSlot={handleSelectTimeSlot}
                  label="Available Time Slots"
                  showCapacity={true}
                  layout="grid"
                  emptyMessage="No pickup slots available for this date. Please select another date."
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Button 
        onClick={handleContinue}
        className="w-full bg-primary hover:bg-cuisine-600"
        disabled={(selectedType === 'delivery' && !selected) || !selectedSlot || bookTimeSlotMutation.isPending}
      >
        {bookTimeSlotMutation.isPending ? "Reserving Your Slot..." : "Continue to Payment"}
      </Button>
    </div>
  );
};

export default DeliveryMethodStep;
