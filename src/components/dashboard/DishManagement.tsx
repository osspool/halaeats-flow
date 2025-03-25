
import React, { useState } from "react";
import { PlusCircle, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  useRestaurantMenu, 
  useAddDish, 
  useUpdateAvailability, 
  useDeleteDish,
  useUpdateTimeSlots 
} from "@/hooks/useRestaurantApi";
import { AvailabilityUpdateRequest, TimeSlotUpdateRequest } from "@/types/restaurant";
import DishList from "./dishes/DishList";
import DishForm from "./dishes/DishForm";
import TimeSlotEditor from "./dishes/TimeSlotEditor";
import TimeSlotSettings from "./dishes/TimeSlotSettings";
import { MenuItem } from "@/types";

const DishManagement = () => {
  const { data: menuData, isLoading } = useRestaurantMenu();
  const { mutate: addDish } = useAddDish();
  const { mutate: updateAvailability } = useUpdateAvailability();
  const { mutate: deleteDish } = useDeleteDish();
  const { mutate: updateTimeSlots } = useUpdateTimeSlots();

  const [isAddDishOpen, setIsAddDishOpen] = useState(false);
  const [isEditAvailabilityOpen, setIsEditAvailabilityOpen] = useState(false);
  const [isTimeSlotSettingsOpen, setIsTimeSlotSettingsOpen] = useState(false);
  const [currentDish, setCurrentDish] = useState<MenuItem | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>("Monday");
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<{ [day: string]: string[] }>({});

  const handleAddDish = (newDish) => {
    addDish(newDish);
    setIsAddDishOpen(false);
  };

  const handleEditAvailability = (dish: MenuItem) => {
    setCurrentDish(dish);
    // Load existing availability
    const existingAvailability = menuData?.availability[dish.id] || {};
    setSelectedTimeSlots(existingAvailability);
    setSelectedDay("Monday");
    setIsEditAvailabilityOpen(true);
  };

  const handleSaveAvailability = () => {
    // Check if at least one day and time slot is selected
    if (Object.keys(selectedTimeSlots).length === 0) {
      toast.error('Please select at least one day and time slot');
      return;
    }

    // Update the dish's availability via API
    if (currentDish) {
      const request: AvailabilityUpdateRequest = {
        dishId: currentDish.id,
        availability: selectedTimeSlots
      };
      updateAvailability(request);
      setIsEditAvailabilityOpen(false);
    }
  };

  const handleDeleteDish = (dishId: string) => {
    if (confirm("Are you sure you want to delete this dish?")) {
      deleteDish(dishId);
    }
  };

  const toggleTimeSlot = (day: string, timeSlot: string) => {
    setSelectedTimeSlots(prev => {
      const updatedTimeSlots = { ...prev };
      
      if (!updatedTimeSlots[day]) {
        updatedTimeSlots[day] = [timeSlot];
      } else if (updatedTimeSlots[day].includes(timeSlot)) {
        updatedTimeSlots[day] = updatedTimeSlots[day].filter(ts => ts !== timeSlot);
        if (updatedTimeSlots[day].length === 0) {
          delete updatedTimeSlots[day];
        }
      } else {
        updatedTimeSlots[day] = [...updatedTimeSlots[day], timeSlot];
      }
      
      return updatedTimeSlots;
    });
  };

  const handleSaveTimeSlotSettings = (timeSlots: string[]) => {
    const request: TimeSlotUpdateRequest = {
      timeSlots: timeSlots
    };
    updateTimeSlots(request);
    setIsTimeSlotSettingsOpen(false);
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading menu data...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Your Menu Items</h2>
        <div className="flex gap-2">
          <Dialog open={isTimeSlotSettingsOpen} onOpenChange={setIsTimeSlotSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Time Slots
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <TimeSlotSettings 
                timeSlots={menuData?.availableTimeSlots || []}
                onSave={handleSaveTimeSlotSettings}
                onCancel={() => setIsTimeSlotSettingsOpen(false)}
              />
            </DialogContent>
          </Dialog>
          <Dialog open={isAddDishOpen} onOpenChange={setIsAddDishOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Dish
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DishForm onSubmit={handleAddDish} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Menu</CardTitle>
        </CardHeader>
        <CardContent>
          <DishList 
            dishes={menuData?.dishes || []} 
            availability={menuData?.availability || {}}
            onEditAvailability={handleEditAvailability}
            onDeleteDish={handleDeleteDish}
          />
        </CardContent>
      </Card>

      <Dialog open={isEditAvailabilityOpen} onOpenChange={setIsEditAvailabilityOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {currentDish && (
            <TimeSlotEditor 
              dishName={currentDish.name}
              selectedTimeSlots={selectedTimeSlots}
              onSave={handleSaveAvailability}
              onCancel={() => setIsEditAvailabilityOpen(false)}
              onToggleTimeSlot={toggleTimeSlot}
              selectedDay={selectedDay}
              onDayChange={setSelectedDay}
              availableTimeSlots={menuData?.availableTimeSlots || []}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DishManagement;
