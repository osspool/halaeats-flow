
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { restaurantService } from "@/services/restaurantService";
import { DishCreateRequest, TimeSlotUpdateRequest, BookTimeSlotRequest } from "@/types/restaurant";
import { toast } from "sonner";
import { startOfMonth, endOfMonth, format } from "date-fns";

// Key constants for React Query
const MENU_QUERY_KEY = "restaurant-menu";
const ORDER_DATES_KEY = "order-dates";
const ORDERS_KEY = "orders";
const ORDERS_RANGE_KEY = "orders-range";

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
      queryClient.invalidateQueries({ queryKey: [MENU_QUERY_KEY] });
      toast.success("Dish saved successfully!");
    },
    onError: () => {
      toast.error("Failed to save dish. Please try again.");
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

/**
 * Hook for updating time slots
 */
export const useUpdateTimeSlots = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (request: TimeSlotUpdateRequest) => 
      restaurantService.updateTimeSlots(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MENU_QUERY_KEY] });
      toast.success("Time slots updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update time slots. Please try again.");
    }
  });
};

/**
 * Hook for booking a time slot
 */
export const useBookTimeSlot = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (timeSlot: string) => restaurantService.bookTimeSlot(timeSlot),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MENU_QUERY_KEY] });
      toast.success("Time slot booked successfully!");
    },
    onError: () => {
      toast.error("Failed to book time slot. Please try again.");
    }
  });
};

/**
 * Hook for fetching order dates for a specific month
 */
export const useOrderDatesForMonth = (date: Date) => {
  const startDate = format(startOfMonth(date), 'yyyy-MM-dd');
  const endDate = format(endOfMonth(date), 'yyyy-MM-dd');

  return useQuery({
    queryKey: [ORDER_DATES_KEY, startDate, endDate],
    queryFn: () => restaurantService.getOrderDates(startDate, endDate),
  });
};

/**
 * Hook for fetching orders by date with optional status filter
 */
export const useOrdersByDate = (date: string, status?: string) => {
  return useQuery({
    queryKey: [ORDERS_KEY, date, status],
    queryFn: () => restaurantService.getOrdersByDate(date, status),
    enabled: !!date, // Only run query if date is provided
  });
};

/**
 * Hook for fetching orders by date range with optional status filter
 */
export const useOrdersByDateRange = (startDate: string, endDate: string, status?: string) => {
  return useQuery({
    queryKey: [ORDERS_RANGE_KEY, startDate, endDate, status],
    queryFn: () => restaurantService.getOrdersByDateRange(startDate, endDate, status),
    enabled: !!(startDate && endDate), // Only run query if both dates are provided
  });
};

// For backward compatibility with existing components
export const useUpdateAvailability = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => Promise.resolve({}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MENU_QUERY_KEY] });
    }
  });
};
