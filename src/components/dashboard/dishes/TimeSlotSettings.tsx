
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Plus, X } from "lucide-react";
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
  const [newSlot, setNewSlot] = useState<string>("");
  
  const handleAddSlot = () => {
    if (!newSlot) return;
    
    // Basic validation for time format (HH:MM-HH:MM)
    const pattern = /^([0-1][0-9]|2[0-3]):([0-5][0-9])-([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
    if (!pattern.test(newSlot)) {
      alert("Please use the format HH:MM-HH:MM (e.g., 09:00-11:00)");
      return;
    }
    
    setSlots([...slots, newSlot]);
    setNewSlot("");
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
          <div className="flex gap-2 mt-2">
            <Input 
              id="newSlot" 
              value={newSlot} 
              onChange={(e) => setNewSlot(e.target.value)} 
              placeholder="HH:MM-HH:MM (e.g., 09:00-11:00)"
            />
            <Button onClick={handleAddSlot} type="button">
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
        
        <div>
          <Label>Current Time Slots</Label>
          <div className="flex flex-wrap gap-2 mt-2 p-3 border rounded-md">
            {slots.length > 0 ? (
              slots.map((slot, index) => (
                <Badge key={index} variant="secondary" className="p-2">
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
