
import React, { useState } from "react";
import { format } from "date-fns";
import { 
  PlusCircle, 
  Pencil, 
  Trash2, 
  Calendar as CalendarIcon,
  Clock
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
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Mock data for dishes
const mockDishes = [
  {
    id: "dish-001",
    name: "Pasta Carbonara",
    price: 14.99,
    description: "Creamy pasta with bacon and parmesan",
    category: "Pasta",
    availableDates: [
      { date: new Date(new Date().setDate(new Date().getDate() + 1)), 
        timeSlots: ["11:00-14:00", "18:00-21:00"] },
      { date: new Date(new Date().setDate(new Date().getDate() + 2)), 
        timeSlots: ["11:00-14:00", "18:00-21:00"] }
    ],
    dietary: ["Vegetarian-option"]
  },
  {
    id: "dish-002",
    name: "Margherita Pizza",
    price: 12.99,
    description: "Classic tomato and mozzarella pizza",
    category: "Pizza",
    availableDates: [
      { date: new Date(new Date().setDate(new Date().getDate() + 1)), 
        timeSlots: ["11:00-14:00", "18:00-21:00"] },
      { date: new Date(new Date().setDate(new Date().getDate() + 3)), 
        timeSlots: ["11:00-14:00", "18:00-21:00"] }
    ],
    dietary: ["Vegetarian"]
  },
  {
    id: "dish-003",
    name: "Chicken Curry",
    price: 16.99,
    description: "Spicy chicken curry with basmati rice",
    category: "Main Course",
    availableDates: [
      { date: new Date(new Date().setDate(new Date().getDate() + 2)), 
        timeSlots: ["18:00-21:00"] },
      { date: new Date(new Date().setDate(new Date().getDate() + 4)), 
        timeSlots: ["18:00-21:00"] }
    ],
    dietary: ["Gluten-free"]
  }
];

const DishManagement = () => {
  const [dishes, setDishes] = useState(mockDishes);
  const [isAddDishOpen, setIsAddDishOpen] = useState(false);
  const [isEditAvailabilityOpen, setIsEditAvailabilityOpen] = useState(false);
  const [currentDish, setCurrentDish] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const availableTimeSlots = ["11:00-14:00", "18:00-21:00"];

  const handleAddDish = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newDish = {
      id: `dish-${Date.now()}`,
      name: formData.get('name') as string,
      price: parseFloat(formData.get('price') as string),
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      availableDates: [],
      dietary: []
    };
    
    setDishes([...dishes, newDish]);
    setIsAddDishOpen(false);
    toast.success('New dish added successfully!');
  };

  const handleEditAvailability = (dish: any) => {
    setCurrentDish(dish);
    if (dish.availableDates && dish.availableDates.length > 0) {
      setSelectedDate(dish.availableDates[0].date);
      setSelectedTimeSlots(dish.availableDates[0].timeSlots);
    } else {
      setSelectedDate(new Date());
      setSelectedTimeSlots([]);
    }
    setIsEditAvailabilityOpen(true);
  };

  const handleSaveAvailability = () => {
    if (!selectedDate || selectedTimeSlots.length === 0) {
      toast.error('Please select date and time slots');
      return;
    }

    // Update the dish's availability
    const updatedDishes = dishes.map(dish => {
      if (dish.id === currentDish.id) {
        const existingDateIndex = dish.availableDates.findIndex(
          ad => format(ad.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
        );

        const newAvailableDates = [...dish.availableDates];
        
        if (existingDateIndex >= 0) {
          newAvailableDates[existingDateIndex].timeSlots = selectedTimeSlots;
        } else {
          newAvailableDates.push({
            date: selectedDate,
            timeSlots: selectedTimeSlots
          });
        }

        return {
          ...dish,
          availableDates: newAvailableDates
        };
      }
      return dish;
    });

    setDishes(updatedDishes);
    setIsEditAvailabilityOpen(false);
    toast.success('Dish availability updated!');
  };

  const toggleTimeSlot = (timeSlot: string) => {
    if (selectedTimeSlots.includes(timeSlot)) {
      setSelectedTimeSlots(selectedTimeSlots.filter(ts => ts !== timeSlot));
    } else {
      setSelectedTimeSlots([...selectedTimeSlots, timeSlot]);
    }
  };

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
              {dishes.map((dish) => (
                <TableRow key={dish.id}>
                  <TableCell className="font-medium">{dish.name}</TableCell>
                  <TableCell>{dish.category}</TableCell>
                  <TableCell>${dish.price.toFixed(2)}</TableCell>
                  <TableCell>
                    {dish.availableDates && dish.availableDates.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {dish.availableDates.slice(0, 2).map((ad, idx) => (
                          <Badge key={idx} variant="outline" className="flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            {format(ad.date, "MMM d")}
                          </Badge>
                        ))}
                        {dish.availableDates.length > 2 && (
                          <Badge variant="outline">+{dish.availableDates.length - 2} more</Badge>
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
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        Set Times
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-100">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditAvailabilityOpen} onOpenChange={setIsEditAvailabilityOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              Set Availability for {currentDish?.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div>
              <Label className="mb-2 block">Select Date</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="p-3 pointer-events-auto"
                disabled={(date) => date < new Date()}
              />
            </div>
            
            <div>
              <Label className="mb-2 block">Select Time Slots</Label>
              <div className="space-y-3 mt-4">
                {availableTimeSlots.map((timeSlot) => (
                  <div
                    key={timeSlot}
                    className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                      selectedTimeSlots.includes(timeSlot)
                        ? "bg-primary/10 border-primary"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => toggleTimeSlot(timeSlot)}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{timeSlot}</span>
                  </div>
                ))}
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
