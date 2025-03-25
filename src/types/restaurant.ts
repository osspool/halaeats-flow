
import { MenuItem } from "./index";

export interface TimeSlotSettings {
  dayOfWeek: string;
  timeSlots: string[];
}

export interface DishAvailability {
  [dishId: string]: {
    [day: string]: string[];
  };
}

export interface RestaurantMenu {
  dishes: MenuItem[];
  availability: DishAvailability;
  availableTimeSlots: string[]; // Added this to store custom time slots
}

export interface AvailabilityUpdateRequest {
  dishId: string;
  availability: {
    [day: string]: string[];
  };
}

export interface DishCreateRequest {
  name: string;
  price: number;
  description: string;
  category: string;
  dietary: string[];
}

export interface TimeSlotUpdateRequest {
  timeSlots: string[];
}
