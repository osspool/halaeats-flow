
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TimeSlot } from "@/types/restaurant";
import { Plus, X } from "lucide-react";

interface TimeSlotEditorProps {
  day: string;
  timeSlots: TimeSlot[];
  onChange: (timeSlots: TimeSlot[]) => void;
}

const TimeSlotEditor = ({ day, timeSlots, onChange }: TimeSlotEditorProps) => {
  const [newStartTime, setNewStartTime] = useState("07:00");
  const [newEndTime, setNewEndTime] = useState("09:00");

  const handleAddTimeSlot = () => {
    const newTimeSlot = {
      start_time: newStartTime,
      end_time: newEndTime
    };
    onChange([...timeSlots, newTimeSlot]);
  };

  const handleRemoveTimeSlot = (index: number) => {
    const updatedTimeSlots = [...timeSlots];
    updatedTimeSlots.splice(index, 1);
    onChange(updatedTimeSlots);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <h4 className="text-md font-medium capitalize">{day}</h4>
      </div>

      {timeSlots.length > 0 ? (
        <div className="space-y-2">
          {timeSlots.map((slot, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="flex-1 flex items-center">
                <span className="text-sm text-muted-foreground mr-2">From</span>
                <Input 
                  type="time" 
                  value={slot.start_time}
                  onChange={(e) => {
                    const updatedSlots = [...timeSlots];
                    updatedSlots[index].start_time = e.target.value;
                    onChange(updatedSlots);
                  }}
                  className="w-full"
                />
              </div>
              <div className="flex-1 flex items-center">
                <span className="text-sm text-muted-foreground mr-2">To</span>
                <Input 
                  type="time" 
                  value={slot.end_time}
                  onChange={(e) => {
                    const updatedSlots = [...timeSlots];
                    updatedSlots[index].end_time = e.target.value;
                    onChange(updatedSlots);
                  }}
                  className="w-full"
                />
              </div>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => handleRemoveTimeSlot(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-2 text-sm text-muted-foreground">
          No time slots set for this day. Add a time slot to make the dish available.
        </div>
      )}

      <div className="flex items-end space-x-3">
        <div className="flex-1">
          <span className="text-sm text-muted-foreground">Start Time</span>
          <Input 
            type="time" 
            value={newStartTime}
            onChange={(e) => setNewStartTime(e.target.value)}
            className="mt-1"
          />
        </div>
        <div className="flex-1">
          <span className="text-sm text-muted-foreground">End Time</span>
          <Input 
            type="time" 
            value={newEndTime}
            onChange={(e) => setNewEndTime(e.target.value)}
            className="mt-1"
          />
        </div>
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleAddTimeSlot}
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>
    </div>
  );
};

export default TimeSlotEditor;
