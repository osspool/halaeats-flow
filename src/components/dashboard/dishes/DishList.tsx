
import React from "react";
import { MenuItem } from "@/types";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Trash2, CalendarIcon } from "lucide-react";
import { DishAvailability } from "@/types/restaurant";

interface DishListProps {
  dishes: MenuItem[];
  availability: DishAvailability;
  onEditAvailability: (dish: MenuItem) => void;
  onDeleteDish: (dishId: string) => void;
  isLoading?: boolean; // Made optional with default value
}

const DishList = ({ 
  dishes, 
  availability, 
  onEditAvailability, 
  onDeleteDish,
  isLoading = false
}: DishListProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-500">
        Loading dishes...
      </div>
    );
  }

  if (dishes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No dishes added yet. Click "Add New Dish" to create your first menu item.
      </div>
    );
  }

  return (
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
              {availability[dish.id] && Object.keys(availability[dish.id]).length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {Object.keys(availability[dish.id]).slice(0, 2).map((day) => (
                    <Badge key={day} variant="outline" className="flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      {day}
                    </Badge>
                  ))}
                  {Object.keys(availability[dish.id]).length > 2 && (
                    <Badge variant="outline">+{Object.keys(availability[dish.id]).length - 2} more</Badge>
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
                  onClick={() => onEditAvailability(dish)}
                >
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  Set Times
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-500 hover:text-red-700 hover:bg-red-100"
                  onClick={() => onDeleteDish(dish.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DishList;
