
import React, { useState } from "react";
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
import { Clock, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TimeSlotSettingsProps {
  timeSlots: string[];
  onSave: (timeSlots: string[]) => void;
  onCancel: () => void;
}

const TimeSlotSettings = ({ 
  timeSlots,
  onSave,
  onCancel
}: TimeSlotSettingsProps) => {
  const [slots, setSlots] = useState<string[]>(timeSlots);
  const [startHour, setStartHour] = useState<string>("09");
  const [startMinute, setStartMinute] = useState<string>("00");
  const [endHour, setEndHour] = useState<string>("11");
  const [endMinute, setEndMinute] = useState<string>("00");
  
  // Generate hours and minutes for dropdowns
  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const minutes = ['00', '15', '30', '45'];
  
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
    
    setSlots([...slots, newTimeSlot]);
  };
  
  const handleRemoveSlot = (index: number) => {
    const updatedSlots = [...slots];
    updatedSlots.splice(index, 1);
    setSlots(updatedSlots);
  };
  
  const handleSave = () => {
    onSave(slots);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          Manage Available Time Slots
        </DialogTitle>
        <DialogDescription>
          Configure the time slots that will be available for all dishes in your restaurant.
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid grid-cols-1 gap-6 pt-4">
        <div>
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
          <div className="flex flex-wrap gap-2 mt-2 p-3 border rounded-md">
            {slots.length > 0 ? (
              slots.map((slot, index) => (
                <Badge key={index} variant="secondary" className="p-2">
                  <Clock className="h-3 w-3 mr-1" />
                  {slot}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-4 w-4 p-0 ml-2"
                    onClick={() => handleRemoveSlot(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))
            ) : (
              <p className="text-sm text-gray-500">No time slots defined yet.</p>
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
