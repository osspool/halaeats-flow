
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Check, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Constants for days of week
const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday", 
  "Wednesday", 
  "Thursday", 
  "Friday", 
  "Saturday", 
  "Sunday"
];

interface TimeSlotEditorProps {
  dishName: string;
  selectedTimeSlots: { [day: string]: string[] };
  onSave: () => void;
  onCancel: () => void;
  onToggleTimeSlot: (day: string, timeSlot: string) => void;
  selectedDay: string;
  onDayChange: (day: string) => void;
  availableTimeSlots: string[]; // Added this prop
}

const TimeSlotEditor = ({ 
  dishName,
  selectedTimeSlots,
  onSave,
  onCancel,
  onToggleTimeSlot,
  selectedDay,
  onDayChange,
  availableTimeSlots
}: TimeSlotEditorProps) => {
  const isTimeSlotSelected = (day: string, timeSlot: string) => {
    return selectedTimeSlots[day]?.includes(timeSlot) || false;
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          Set Availability for {dishName}
        </DialogTitle>
        <DialogDescription>
          Select which days of the week and time slots this dish will be available.
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid grid-cols-1 gap-6 pt-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {DAYS_OF_WEEK.map((day) => (
            <Button
              key={day}
              variant={selectedDay === day ? "default" : "outline"}
              onClick={() => onDayChange(day)}
              className="text-sm"
            >
              {day.substring(0, 3)}
              {selectedTimeSlots[day]?.length > 0 && (
                <div className="ml-1 w-2 h-2 bg-green-500 rounded-full"></div>
              )}
            </Button>
          ))}
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label className="text-base font-medium">Time Slots for {selectedDay}</Label>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {availableTimeSlots.map((timeSlot) => (
              <div
                key={timeSlot}
                className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                  isTimeSlotSelected(selectedDay, timeSlot)
                    ? "bg-primary/10 border-primary"
                    : "hover:border-primary/50"
                }`}
                onClick={() => onToggleTimeSlot(selectedDay, timeSlot)}
              >
                <div className="mr-2">
                  {isTimeSlotSelected(selectedDay, timeSlot) ? (
                    <div className="h-4 w-4 rounded-sm bg-primary flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  ) : (
                    <div className="h-4 w-4 rounded-sm border border-primary/50"></div>
                  )}
                </div>
                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                <span>{timeSlot}</span>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Summary of Selected Times</h3>
            <div className="bg-gray-50 p-3 rounded-md max-h-[120px] overflow-y-auto">
              {Object.keys(selectedTimeSlots).length > 0 ? (
                Object.entries(selectedTimeSlots).map(([day, slots]) => (
                  <div key={day} className="flex flex-wrap gap-1 mb-2">
                    <Badge className="text-xs">{day}</Badge>
                    {slots.map(slot => (
                      <Badge key={`${day}-${slot}`} variant="outline" className="text-xs">
                        {slot}
                      </Badge>
                    ))}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No time slots selected yet.</p>
              )}
            </div>
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
        <Button onClick={onSave}>
          Save Availability
        </Button>
      </DialogFooter>
    </>
  );
};

export default TimeSlotEditor;
