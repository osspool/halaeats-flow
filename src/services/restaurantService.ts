import { DishAvailability, DishCreateRequest, RestaurantMenu, AvailabilityUpdateRequest, TimeSlotUpdateRequest } from "@/types/restaurant";
import { MenuItem } from "@/types";

// Default time slots
const defaultTimeSlots = [
  "07:00-09:00",
  "11:00-14:00", 
  "18:00-21:00",
  "21:00-23:00"
];

// Mock data for dishes
const mockDishes: MenuItem[] = [
  {
    id: "dish-001",
    name: "Pasta Carbonara",
    price: 14.99,
    description: "Creamy pasta with bacon and parmesan",
    category: "Pasta",
    image: "",
    dietary: ["Vegetarian-option"],
    featured: false,
    availableDates: [],
  },
  {
    id: "dish-002",
    name: "Margherita Pizza",
    price: 12.99,
    description: "Classic tomato and mozzarella pizza",
    category: "Pizza",
    image: "",
    dietary: ["Vegetarian"],
    featured: true,
    availableDates: [],
  },
  {
    id: "dish-003",
    name: "Chicken Curry",
    price: 16.99,
    description: "Spicy chicken curry with basmati rice",
    category: "Main Course",
    image: "",
    dietary: ["Gluten-free"],
    featured: false,
    availableDates: [],
  }
];

// Mock availability data
const mockAvailability: DishAvailability = {
  "dish-001": {
    "Monday": ["11:00-14:00", "18:00-21:00"],
    "Wednesday": ["11:00-14:00", "18:00-21:00"],
    "Friday": ["18:00-21:00"],
  },
  "dish-002": {
    "Tuesday": ["11:00-14:00", "18:00-21:00"],
    "Thursday": ["11:00-14:00", "18:00-21:00"],
    "Saturday": ["11:00-14:00", "18:00-21:00", "21:00-23:00"],
  },
  "dish-003": {
    "Wednesday": ["18:00-21:00"],
    "Sunday": ["11:00-14:00", "18:00-21:00"],
  }
};

// Mock menu data
let menuData: RestaurantMenu = {
  dishes: [...mockDishes],
  availability: {...mockAvailability},
  availableTimeSlots: [...defaultTimeSlots]
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Restaurant API Service
export const restaurantService = {
  // Get menu with availability
  getMenu: async (): Promise<RestaurantMenu> => {
    // Simulate network delay
    await delay(800);
    return {...menuData};
  },
  
  // Add a new dish
  addDish: async (dish: DishCreateRequest): Promise<MenuItem> => {
    await delay(600);
    
    const newDish: MenuItem = {
      id: `dish-${Date.now()}`,
      name: dish.name,
      price: dish.price,
      description: dish.description,
      category: dish.category,
      dietary: dish.dietary,
      image: "",
      featured: false,
      availableDates: [],
    };
    
    // Add to mock data
    menuData.dishes.push(newDish);
    menuData.availability[newDish.id] = {};
    
    return newDish;
  },
  
  // Update dish availability
  updateAvailability: async (request: AvailabilityUpdateRequest): Promise<DishAvailability> => {
    await delay(500);
    
    // Update availability for the specific dish
    menuData.availability[request.dishId] = request.availability;
    
    return {...menuData.availability};
  },
  
  // Delete a dish
  deleteDish: async (dishId: string): Promise<boolean> => {
    await delay(700);
    
    // Remove dish from menu
    menuData.dishes = menuData.dishes.filter(dish => dish.id !== dishId);
    
    // Remove availability data
    if (menuData.availability[dishId]) {
      delete menuData.availability[dishId];
    }
    
    return true;
  },
  
  // Update available time slots
  updateTimeSlots: async (request: TimeSlotUpdateRequest): Promise<string[]> => {
    await delay(500);
    
    // Update the available time slots
    menuData.availableTimeSlots = request.timeSlots;
    
    return [...menuData.availableTimeSlots];
  },
};
