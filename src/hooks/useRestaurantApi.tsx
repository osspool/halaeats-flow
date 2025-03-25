
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { restaurantService } from "@/services/restaurantService";
import { AvailabilityUpdateRequest, DishCreateRequest } from "@/types/restaurant";
import { MenuItem } from "@/types";
import { toast } from "sonner";

// Key constants for React Query
const MENU_QUERY_KEY = "restaurant-menu";
const AVAILABILITY_KEY = "dish-availability";

/**
 * Hook for fetching restaurant menu data
 */
export const useRestaurantMenu = () => {
  return useQuery({
    queryKey: [MENU_QUERY_KEY],
    queryFn: restaurantService.getMenu,
  });
};

/**
 * Hook for adding a new dish
 */
export const useAddDish = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newDish: DishCreateRequest) => restaurantService.addDish(newDish),
    onSuccess: () => {
      // Invalidate the menu query to refetch with the new dish
      queryClient.invalidateQueries({ queryKey: [MENU_QUERY_KEY] });
      toast.success("New dish added successfully!");
    },
    onError: () => {
      toast.error("Failed to add dish. Please try again.");
    }
  });
};

/**
 * Hook for updating dish availability
 */
export const useUpdateAvailability = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (request: AvailabilityUpdateRequest) => 
      restaurantService.updateAvailability(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MENU_QUERY_KEY] });
      toast.success("Dish availability updated!");
    },
    onError: () => {
      toast.error("Failed to update availability. Please try again.");
    }
  });
};

/**
 * Hook for deleting a dish
 */
export const useDeleteDish = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (dishId: string) => restaurantService.deleteDish(dishId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MENU_QUERY_KEY] });
      toast.success("Dish deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete dish. Please try again.");
    }
  });
};
