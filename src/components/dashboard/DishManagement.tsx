
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import DishList from "./dishes/DishList";
import DishForm from "./dishes/DishForm";
import { useAddDish, useDeleteDish, useRestaurantMenu } from "@/hooks/useRestaurantApi";
import { useToast } from "@/hooks/use-toast";
import { DishCreateRequest } from "@/types/restaurant";
import { MenuItem } from "@/types";

const DishManagement = () => {
  // States for dialog management
  const [isDishDialogOpen, setIsDishDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  
  // Fetch menu data with React Query
  const { data: menuData, isLoading: isMenuLoading } = useRestaurantMenu();
  
  // Mutations for CRUD operations
  const addDishMutation = useAddDish();
  const deleteDishMutation = useDeleteDish();
  
  // Toast for notifications
  const { toast } = useToast();
  
  // Handler for adding a new dish
  const handleAddDish = (data: DishCreateRequest) => {
    addDishMutation.mutate(data, {
      onSuccess: () => {
        setIsDishDialogOpen(false);
        toast({
          title: "Success",
          description: "Dish added successfully",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to add dish. Please try again.",
          variant: "destructive",
        });
      }
    });
  };
  
  // Handler for deleting a dish
  const handleDeleteDish = (dishId: string) => {
    deleteDishMutation.mutate(dishId, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Dish deleted successfully",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to delete dish. Please try again.",
          variant: "destructive",
        });
      }
    });
  };
  
  // Handler for editing availability
  const handleEditAvailability = (dish: MenuItem) => {
    setSelectedDish(dish);
    setIsEditDialogOpen(true);
  };
  
  // Handler for editing a dish
  const handleEditDish = (dish: MenuItem) => {
    setSelectedDish(dish);
    setIsEditDialogOpen(true);
  };
  
  // Handler for updating a dish
  const handleUpdateDish = (data: DishCreateRequest) => {
    if (!selectedDish) return;
    
    // Use addDish mutation to update dish
    addDishMutation.mutate({
      ...data,
      id: selectedDish.id,
    } as any, {
      onSuccess: () => {
        setIsEditDialogOpen(false);
        setSelectedDish(null);
        toast({
          title: "Success",
          description: "Dish updated successfully",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to update dish. Please try again.",
          variant: "destructive",
        });
      }
    });
  };
  
  // Create a simplified availability map for the DishList
  const createAvailabilityMap = () => {
    if (!menuData) return {};
    
    const availabilityMap: {[dishId: string]: {[day: string]: string[]}} = {};
    
    // Ensure dishes is an array before iterating
    const dishes = menuData.dishes || [];
    
    dishes.forEach(dish => {
      if (menuData.availableTimeSlots) {
        availabilityMap[dish.id] = {
          "Monday": menuData.availableTimeSlots,
          "Wednesday": menuData.availableTimeSlots,
        };
      }
    });
    
    return availabilityMap;
  };
  
  // Ensure we have an array of dishes, even if menuData is undefined
  const dishes = menuData?.dishes || [];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Menu</h2>
        <div className="flex space-x-3">
          <Dialog open={isDishDialogOpen} onOpenChange={setIsDishDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add Dish
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[650px] max-h-[90vh]">
              <DishForm 
                onSubmit={handleAddDish} 
                onCancel={() => setIsDishDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <DishList 
        dishes={dishes}
        onDeleteDish={handleDeleteDish}
        onEditAvailability={handleEditAvailability}
        onEditDish={handleEditDish}
        isLoading={isMenuLoading}
        availability={createAvailabilityMap()}
      />
      
      {/* Dialog for editing dish */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[650px] max-h-[90vh]">
          {selectedDish && (
            <DishForm
              initialData={{
                name: selectedDish.name,
                price: selectedDish.price,
                description: selectedDish.description,
                dishType: selectedDish.category as any,
                dietary: selectedDish.dietary || [],
                featured: selectedDish.featured,
                // Other fields would come from the API
              }}
              onSubmit={handleUpdateDish}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DishManagement;
