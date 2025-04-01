
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { MapPin, Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from '@/contexts/LocationContext';
import { useMap } from '@/components/map/MapContext';
import LocationSearch from '@/components/map/LocationSearch';
import LeafletMap from '@/components/map/LeafletMap';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';

const LocationModal = () => {
  const { 
    isLocationModalOpen, 
    closeLocationModal, 
    selectedLocation, 
    setSelectedLocation 
  } = useLocation();
  
  const { currentLocation } = useMap();
  const [activeTab, setActiveTab] = useState<string>('delivery');
  const [deliveryRadius, setDeliveryRadius] = useState<number>(5);
  const [tempLocation, setTempLocation] = useState(selectedLocation);

  useEffect(() => {
    if (currentLocation && !tempLocation) {
      setTempLocation({
        name: currentLocation.name || 'Current Location',
        address: currentLocation.address,
        coordinates: currentLocation.coordinates,
        radius: deliveryRadius
      });
    }
  }, [currentLocation, tempLocation]);

  const handleLocationSelect = (location: any) => {
    setTempLocation({
      name: location.address?.split(',')[0] || 'Selected Location',
      address: location.address,
      coordinates: [location.lat, location.lng],
      radius: deliveryRadius
    });
  };

  const handleRadiusChange = (value: number[]) => {
    setDeliveryRadius(value[0]);
    if (tempLocation) {
      setTempLocation({
        ...tempLocation,
        radius: value[0]
      });
    }
  };

  const handleDone = () => {
    if (tempLocation) {
      setSelectedLocation({
        ...tempLocation,
        radius: deliveryRadius
      });
    }
    closeLocationModal();
  };

  return (
    <Dialog open={isLocationModalOpen} onOpenChange={(open) => !open && closeLocationModal()}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b">
          <DialogTitle className="text-xl font-semibold">Delivery details</DialogTitle>
          <Button variant="ghost" size="icon" onClick={closeLocationModal}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-4 space-y-6">
          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-primary mt-1" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{tempLocation?.name || 'Select location'}</h3>
                  <p className="text-sm text-muted-foreground">{tempLocation?.address?.split(',').slice(1).join(',')}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8"
                  onClick={() => setActiveTab('address')}
                >
                  Change
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Clock className="h-5 w-5 text-primary mt-1" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Deliver now</h3>
                </div>
                <Button variant="outline" size="sm" className="h-8">
                  Schedule
                </Button>
              </div>
            </div>
          </div>

          {tempLocation && (
            <div className="space-y-2">
              <h3 className="font-medium">Delivery radius: {deliveryRadius} km</h3>
              <Slider
                defaultValue={[deliveryRadius]}
                max={20}
                min={1}
                step={1}
                onValueChange={handleRadiusChange}
              />
            </div>
          )}
          
          {tempLocation && (
            <div className="h-48 relative rounded-md overflow-hidden border">
              <LeafletMap height="100%" interactive={false} />
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="bg-primary/10 border-2 border-primary rounded-full" 
                     style={{ 
                       width: `${Math.min(deliveryRadius * 10, 75)}%`, 
                       height: `${Math.min(deliveryRadius * 10, 75)}%`,
                       opacity: 0.7
                     }} 
                />
              </div>
            </div>
          )}
        </div>
        
        {activeTab === 'address' && (
          <div className="p-4 border-t space-y-4">
            <h3 className="font-medium">Enter delivery address</h3>
            <LocationSearch 
              onSelectAddress={(address) => {}} 
              placeholder="Search for your address"
              className="mb-4"
            />
            <div className="h-48 relative rounded-md overflow-hidden border">
              <LeafletMap 
                height="100%" 
                onLocationSelect={handleLocationSelect}
              />
            </div>
            <Button variant="outline" onClick={() => setActiveTab('delivery')}>
              Back to delivery options
            </Button>
          </div>
        )}
        
        <div className="p-4 border-t">
          <Button 
            className="w-full" 
            disabled={!tempLocation}
            onClick={handleDone}
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationModal;
