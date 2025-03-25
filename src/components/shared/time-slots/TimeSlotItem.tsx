
import React from "react";
import { Clock, Users, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { TimeSlotItemProps } from "./types";

const TimeSlotItem = ({
  slot,
  isSelected,
  isFull,
  onSelect,
  showCapacity = true,
  disabled = false
}: TimeSlotItemProps) => {
  // Calculate availability metrics
  const available = slot.capacity - slot.booked;
  const isAlmostFull = available <= Math.max(1, Math.floor(slot.capacity * 0.2));
  
  return (
    <button
      onClick={() => !isFull && !disabled && onSelect()}
      disabled={isFull || disabled}
      className={cn(
        "relative flex items-center justify-between border rounded-md p-3 transition-colors",
        isSelected && !isFull && "border-primary bg-primary/10",
        isFull ? "bg-gray-100 cursor-not-allowed opacity-70" : "hover:border-primary",
        isAlmostFull && !isFull && "border-orange-300"
      )}
    >
      <div className="flex items-center">
        <Clock className="h-4 w-4 mr-2 text-gray-500" />
        <span>{slot.time}</span>
        
        {isSelected && (
          <CheckCircle2 className="h-4 w-4 ml-2 text-primary" />
        )}
      </div>
      
      {showCapacity && (
        <div className={cn(
          "flex items-center text-xs rounded-full px-2 py-1",
          isFull ? "bg-red-100 text-red-600" : 
          isAlmostFull ? "bg-orange-100 text-orange-600" : 
          "bg-green-100 text-green-600"
        )}>
          <Users className="h-3 w-3 mr-1" />
          {isFull ? (
            "Full"
          ) : (
            <>{available} left</>
          )}
        </div>
      )}
    </button>
  );
};

export default TimeSlotItem;
