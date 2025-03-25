
import React, { useState } from "react";
import { 
  PlusCircle, 
  Pencil, 
  Trash2, 
  Calendar as CalendarIcon,
  Clock,
  Check
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { useRestaurantMenu, useAddDish, useUpdateAvailability, useDeleteDish } from "@/hooks/useRestaurantApi";
import { AvailabilityUpdateRequest, DishCreateRequest } from "@/types/restaurant";

// Days of the week
const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday", 
  "Wednesday", 
  "Thursday", 
  "Friday", 
  "Saturday", 
  "Sunday"
];

// Available time slots
const TIME_SLOTS = [
  "07:00-09:00",
  "11:00-14:00", 
  "18:00-21:00",
  "21:00-23:00"
];

const DishManagement = () => {
  const { data: menuData, isLoading } = useRestaurantMenu();
  const { mutate: addDish } = useAddDish();
  const { mutate: updateAvailability } = useUpdateAvailability();
  const { mutate: deleteDish } = useDeleteDish();

  const [isAddDishOpen, setIsAddDishOpen] = useState(false);
  const [isEditAvailabilityOpen, setIsEditAvailabilityOpen] = useState(false);
  const [currentDish, setCurrentDish] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState<string>("Monday");
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<{ [day: string]: string[] }>({});

  const handleAddDish = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newDish: DishCreateRequest = {
      name: formData.get('name') as string,
      price: parseFloat(formData.get('price') as string),
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      dietary: []
    };
    
    addDish(newDish);
    setIsAddDishOpen(false);
  };

  const handleEditAvailability = (dish: any) => {
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

  const isTimeSlotSelected = (day: string, timeSlot: string) => {
    return selectedTimeSlots[day]?.includes(timeSlot) || false;
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading menu data...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Your Menu Items</h2>
        <Dialog open={isAddDishOpen} onOpenChange={setIsAddDishOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Dish
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Dish</DialogTitle>
              <DialogDescription>
                Add a new dish to your menu with pricing and category information.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddDish} className="space-y-4 pt-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="name">Dish Name</Label>
                <Input id="name" name="name" placeholder="Enter dish name" required />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="price">Price ($)</Label>
                <Input id="price" name="price" type="number" step="0.01" min="0" placeholder="0.00" required />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" placeholder="e.g., Pasta, Dessert" required />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="description">Description</Label>
                <Input id="description" name="description" placeholder="Brief description of the dish" required />
              </div>
              <DialogFooter>
                <Button type="submit">Add Dish</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Menu</CardTitle>
        </CardHeader>
        <CardContent>
          {menuData?.dishes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No dishes added yet. Click "Add New Dish" to create your first menu item.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dish Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {menuData?.dishes.map((dish) => (
                  <TableRow key={dish.id}>
                    <TableCell className="font-medium">{dish.name}</TableCell>
                    <TableCell>{dish.category}</TableCell>
                    <TableCell>${dish.price.toFixed(2)}</TableCell>
                    <TableCell>
                      {menuData.availability[dish.id] && Object.keys(menuData.availability[dish.id]).length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {Object.keys(menuData.availability[dish.id]).slice(0, 2).map((day) => (
                            <Badge key={day} variant="outline" className="flex items-center gap-1">
                              <CalendarIcon className="h-3 w-3" />
                              {day}
                            </Badge>
                          ))}
                          {Object.keys(menuData.availability[dish.id]).length > 2 && (
                            <Badge variant="outline">+{Object.keys(menuData.availability[dish.id]).length - 2} more</Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">Not scheduled</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditAvailability(dish)}
                        >
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          Set Times
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700 hover:bg-red-100"
                          onClick={() => handleDeleteDish(dish.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditAvailabilityOpen} onOpenChange={setIsEditAvailabilityOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              Set Availability for {currentDish?.name}
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
                  onClick={() => setSelectedDay(day)}
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
                {TIME_SLOTS.map((timeSlot) => (
                  <div
                    key={timeSlot}
                    className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                      isTimeSlotSelected(selectedDay, timeSlot)
                        ? "bg-primary/10 border-primary"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => toggleTimeSlot(selectedDay, timeSlot)}
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
                    <div className="space-y-2">
                      {Object.entries(selectedTimeSlots).map(([day, slots]) => (
                        <div key={day} className="flex items-start">
                          <span className="font-medium min-w-[100px]">{day}:</span>
                          <div className="flex flex-wrap gap-1">
                            {slots.map(slot => (
                              <Badge key={`${day}-${slot}`} variant="outline" className="text-xs">
                                {slot}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No time slots selected yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button 
              variant="outline" 
              onClick={() => setIsEditAvailabilityOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveAvailability}>
              Save Availability
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DishManagement;
