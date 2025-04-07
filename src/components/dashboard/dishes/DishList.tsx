
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

interface DishAvailabilityMap {
  [dishId: string]: {
    [day: string]: string[];
  };
}

interface DishListProps {
  dishes: MenuItem[];
  onEditAvailability: (dish: MenuItem) => void;
  onDeleteDish: (dishId: string) => void;
  onEditDish?: (dish: MenuItem) => void; // Added for compatibility with DishManagement
  isLoading?: boolean;
  availability?: DishAvailabilityMap;
}

const DishList = ({ 
  dishes = [], // Provide default empty array
  onEditAvailability, 
  onDeleteDish,
  onEditDish,
  isLoading = false,
  availability = {}
}: DishListProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-500">
        Loading dishes...
      </div>
    );
  }

  // Make sure dishes is an array before checking its length
  const dishesArray = Array.isArray(dishes) ? dishes : [];

  if (dishesArray.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No dishes added yet. Click "Add New Dish" to create your first menu item.
      </div>
    );
  }

  // Ensure availability is defined
  const safeAvailability = availability || {};

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
        {dishesArray.map((dish) => {
          // Ensure dish and dish.id are defined before accessing properties
          if (!dish || !dish.id) {
            return null;
          }
          
          const dishId = dish.id;
          const dishAvailability = safeAvailability[dishId] || {};
          const availabilityDays = Object.keys(dishAvailability);
          const hasAvailability = availabilityDays.length > 0;
          
          return (
            <TableRow key={dishId}>
              <TableCell className="font-medium">{dish.name || 'Unnamed Dish'}</TableCell>
              <TableCell>{dish.category || 'Uncategorized'}</TableCell>
              <TableCell>${(dish.price || 0).toFixed(2)}</TableCell>
              <TableCell>
                {hasAvailability ? (
                  <div className="flex flex-wrap gap-1">
                    {availabilityDays.slice(0, 2).map((day) => (
                      <Badge key={day} variant="outline" className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        {day}
                      </Badge>
                    ))}
                    {availabilityDays.length > 2 && (
                      <Badge variant="outline">+{availabilityDays.length - 2} more</Badge>
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
                  {onEditDish && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onEditDish(dish)}
                    >
                      Edit
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-500 hover:text-red-700 hover:bg-red-100"
                    onClick={() => onDeleteDish(dishId)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default DishList;
