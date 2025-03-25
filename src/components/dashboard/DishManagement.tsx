
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Settings, Plus } from "lucide-react";
import DishList from "./dishes/DishList";
import DishForm from "./dishes/DishForm";
import TimeSlotSettings from "./dishes/TimeSlotSettings";
import TimeSlotEditor from "./dishes/TimeSlotEditor";
import { useAddDish, useDeleteDish, useRestaurantMenu, useUpdateAvailability, useUpdateTimeSlots } from "@/hooks/useRestaurantApi";
import { useToast } from "@/hooks/use-toast";
import { DishCreateRequest, AvailabilityUpdateRequest, TimeSlotCapacity } from "@/types/restaurant";
import { MenuItem } from "@/types";

const DishManagement = () => {
  // States for dialog management
  const [isDishDialogOpen, setIsDishDialogOpen] = useState<boolean>(false);
  const [isTimeSlotDialogOpen, setIsTimeSlotDialogOpen] = useState<boolean>(false);
  const [isAvailabilityDialogOpen, setIsAvailabilityDialogOpen] = useState<boolean>(false);
  
  // State for selected dish for availability editing
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  
  // State for availability management
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<{ [day: string]: string[] }>({});
  const [selectedDay, setSelectedDay] = useState<string>("Monday");
  
  // Fetch menu data with React Query
  const { data: menuData, isLoading: isMenuLoading } = useRestaurantMenu();
  
  // Mutations for CRUD operations
  const addDishMutation = useAddDish();
  const deleteDishMutation = useDeleteDish();
  const updateAvailabilityMutation = useUpdateAvailability();
  const updateTimeSlotsMutation = useUpdateTimeSlots();
  
  // Toast for notifications
  const { toast } = useToast();
  
  // Handler for adding a new dish
  const handleAddDish = (data: DishCreateRequest) => {
    addDishMutation.mutate(data, {
      onSuccess: () => {
        setIsDishDialogOpen(false);
      }
    });
  };
  
  // Handler for deleting a dish
  const handleDeleteDish = (dishId: string) => {
    deleteDishMutation.mutate(dishId);
  };
  
  // Handler for editing dish availability
  const handleEditAvailability = (dish: MenuItem) => {
    setSelectedDish(dish);
    
    // Initialize selected time slots from the dish's availability
    const initialTimeSlots: { [day: string]: string[] } = {};
    
    if (menuData?.availability[dish.id]) {
      Object.keys(menuData.availability[dish.id]).forEach(day => {
        initialTimeSlots[day] = [...menuData.availability[dish.id][day]];
      });
    }
    
    setSelectedTimeSlots(initialTimeSlots);
    setSelectedDay("Monday");
    setIsAvailabilityDialogOpen(true);
  };
  
  // Handler for toggling time slot selection
  const handleToggleTimeSlot = (day: string, timeSlot: string) => {
    const currentSlots = selectedTimeSlots[day] || [];
    const newSlots = currentSlots.includes(timeSlot)
      ? currentSlots.filter(slot => slot !== timeSlot)
      : [...currentSlots, timeSlot];
    
    setSelectedTimeSlots({
      ...selectedTimeSlots,
      [day]: newSlots
    });
  };
  
  // Handler for saving dish availability
  const handleSaveAvailability = () => {
    if (!selectedDish) return;
    
    const request: AvailabilityUpdateRequest = {
      dishId: selectedDish.id,
      availability: { ...selectedTimeSlots }
    };
    
    updateAvailabilityMutation.mutate(request, {
      onSuccess: () => {
        setIsAvailabilityDialogOpen(false);
      }
    });
  };
  
  // Handler for saving time slots settings
  const handleSaveTimeSlots = (timeSlots: string[], capacities: TimeSlotCapacity) => {
    updateTimeSlotsMutation.mutate({
      timeSlots,
      capacities
    }, {
      onSuccess: () => {
        setIsTimeSlotDialogOpen(false);
      }
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Menu</h2>
        <div className="flex space-x-3">
          <Dialog open={isTimeSlotDialogOpen} onOpenChange={setIsTimeSlotDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Time Slots
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <TimeSlotSettings 
                timeSlots={menuData?.availableTimeSlots || []}
                capacities={menuData?.timeSlotCapacities || {}}
                onSave={handleSaveTimeSlots}
                onCancel={() => setIsTimeSlotDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
          
          <Dialog open={isDishDialogOpen} onOpenChange={setIsDishDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add Dish
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DishForm 
                onSubmit={handleAddDish} 
                onCancel={() => setIsDishDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <DishList 
        dishes={menuData?.dishes || []}
        availability={menuData?.availability || {}}
        onDelete={handleDeleteDish}
        onEditAvailability={handleEditAvailability}
        isLoading={isMenuLoading}
      />
      
      {/* Dialog for editing dish availability */}
      <Dialog open={isAvailabilityDialogOpen} onOpenChange={setIsAvailabilityDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          {selectedDish && (
            <TimeSlotEditor
              dishName={selectedDish.name}
              selectedTimeSlots={selectedTimeSlots}
              onSave={handleSaveAvailability}
              onCancel={() => setIsAvailabilityDialogOpen(false)}
              onToggleTimeSlot={handleToggleTimeSlot}
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
