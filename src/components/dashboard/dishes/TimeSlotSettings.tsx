
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Clock, Plus, X, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TimeSlotCapacity } from "@/types/restaurant";

interface TimeSlotSettingsProps {
  timeSlots: string[];
  capacities: TimeSlotCapacity;
  onSave: (timeSlots: string[], capacities: TimeSlotCapacity) => void;
  onCancel: () => void;
}

const TimeSlotSettings = ({ 
  timeSlots,
  capacities = {},
  onSave,
  onCancel
}: TimeSlotSettingsProps) => {
  const [slots, setSlots] = useState<string[]>(timeSlots);
  const [slotCapacities, setSlotCapacities] = useState<TimeSlotCapacity>(capacities);
  const [startHour, setStartHour] = useState<string>("09");
  const [startMinute, setStartMinute] = useState<string>("00");
  const [endHour, setEndHour] = useState<string>("11");
  const [endMinute, setEndMinute] = useState<string>("00");
  const [defaultCapacity, setDefaultCapacity] = useState<number>(5);
  
  // Generate hours and minutes for dropdowns
  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const minutes = ['00', '15', '30', '45'];
  
  // Initialize capacities when component loads or slots change
  useEffect(() => {
    const updatedCapacities = { ...slotCapacities };
    
    // Ensure all slots have capacity information
    slots.forEach(slot => {
      if (!updatedCapacities[slot]) {
        updatedCapacities[slot] = { capacity: defaultCapacity, booked: 0 };
      }
    });
    
    // Remove capacities for slots that no longer exist
    Object.keys(updatedCapacities).forEach(slot => {
      if (!slots.includes(slot)) {
        delete updatedCapacities[slot];
      }
    });
    
    setSlotCapacities(updatedCapacities);
  }, [slots]);
  
  const handleAddSlot = () => {
    const newTimeSlot = `${startHour}:${startMinute}-${endHour}:${endMinute}`;
    
    // Validate that end time is after start time
    const start = parseInt(startHour) * 60 + parseInt(startMinute);
    const end = parseInt(endHour) * 60 + parseInt(endMinute);
    
    if (end <= start) {
      alert("End time must be after start time");
      return;
    }
    
    // Check if this slot already exists
    if (slots.includes(newTimeSlot)) {
      alert("This time slot already exists");
      return;
    }
    
    // Add the new slot and its capacity
    setSlots([...slots, newTimeSlot]);
    setSlotCapacities({
      ...slotCapacities,
      [newTimeSlot]: { capacity: defaultCapacity, booked: 0 }
    });
  };
  
  const handleRemoveSlot = (index: number) => {
    const slotToRemove = slots[index];
    const updatedSlots = [...slots];
    updatedSlots.splice(index, 1);
    setSlots(updatedSlots);
    
    // Also remove capacity info for this slot
    const updatedCapacities = { ...slotCapacities };
    delete updatedCapacities[slotToRemove];
    setSlotCapacities(updatedCapacities);
  };
  
  const handleCapacityChange = (slot: string, capacity: number) => {
    setSlotCapacities({
      ...slotCapacities,
      [slot]: { ...slotCapacities[slot], capacity }
    });
  };
  
  const handleSave = () => {
    onSave(slots, slotCapacities);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          Manage Available Time Slots
        </DialogTitle>
        <DialogDescription>
          Configure the time slots and their capacities for your restaurant.
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid grid-cols-1 gap-6 pt-4">
        <div>
          <div className="flex flex-wrap gap-4 items-center mb-4">
            <div className="flex-grow">
              <Label htmlFor="defaultCapacity">Default Capacity for New Slots</Label>
              <div className="flex items-center mt-1 gap-2">
                <Input
                  id="defaultCapacity"
                  type="number"
                  min="1"
                  value={defaultCapacity}
                  onChange={(e) => setDefaultCapacity(parseInt(e.target.value) || 5)}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">orders per slot</span>
              </div>
            </div>
          </div>
          
          <Label htmlFor="newSlot">Add New Time Slot</Label>
          <div className="grid grid-cols-5 gap-2 mt-2 items-center">
            <div className="col-span-2 flex items-center gap-2">
              <Select value={startHour} onValueChange={setStartHour}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Hour" />
                </SelectTrigger>
                <SelectContent>
                  {hours.map(hour => (
                    <SelectItem key={`start-hour-${hour}`} value={hour}>{hour}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span>:</span>
              <Select value={startMinute} onValueChange={setStartMinute}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Min" />
                </SelectTrigger>
                <SelectContent>
                  {minutes.map(minute => (
                    <SelectItem key={`start-min-${minute}`} value={minute}>{minute}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="text-center">to</div>
            
            <div className="col-span-2 flex items-center gap-2">
              <Select value={endHour} onValueChange={setEndHour}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Hour" />
                </SelectTrigger>
                <SelectContent>
                  {hours.map(hour => (
                    <SelectItem key={`end-hour-${hour}`} value={hour}>{hour}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span>:</span>
              <Select value={endMinute} onValueChange={setEndMinute}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Min" />
                </SelectTrigger>
                <SelectContent>
                  {minutes.map(minute => (
                    <SelectItem key={`end-min-${minute}`} value={minute}>{minute}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleAddSlot} type="button" className="mt-2">
            <Plus className="h-4 w-4 mr-1" />
            Add Time Slot
          </Button>
        </div>
        
        <div>
          <Label>Current Time Slots</Label>
          <div className="overflow-hidden rounded-md border border-gray-200 mt-2">
            {slots.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-4 py-2 text-left font-medium text-sm">Time Slot</th>
                    <th className="px-4 py-2 text-left font-medium text-sm">Capacity (Orders)</th>
                    <th className="px-4 py-2 text-left font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {slots.map((slot, index) => (
                    <tr key={index} className={index % 2 === 0 ? "" : "bg-muted/30"}>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{slot}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="1"
                            value={slotCapacities[slot]?.capacity || defaultCapacity}
                            onChange={(e) => handleCapacityChange(slot, parseInt(e.target.value) || 5)}
                            className="w-20"
                          />
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {slotCapacities[slot]?.booked > 0 && (
                            <Badge variant="outline" className="ml-2">
                              {slotCapacities[slot]?.booked} booked
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRemoveSlot(index)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="p-4 text-sm text-gray-500">No time slots defined yet.</p>
            )}
          </div>
        </div>
      </div>
      
      <DialogFooter className="mt-6">
        <Button 
          variant="outline" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Time Slots
        </Button>
      </DialogFooter>
    </>
  );
};

export default TimeSlotSettings;
