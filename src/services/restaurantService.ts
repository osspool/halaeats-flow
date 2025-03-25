import { DishAvailability, DishCreateRequest, RestaurantMenu, AvailabilityUpdateRequest, TimeSlotUpdateRequest, Order, OrderDate, OrdersResponse, OrderDatesResponse } from "@/types/restaurant";
import { MenuItem } from "@/types";
import { addDays, format, parseISO, subDays, startOfMonth, endOfMonth } from "date-fns";
import { OrderItem } from "@/types/restaurant";

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

// Generate 30 days of mock order data
const generateMockOrders = (): Order[] => {
  const orders: Order[] = [];
  const today = new Date();
  const statuses: Order['status'][] = ['pending', 'confirmed', 'completed', 'cancelled'];
  const paymentMethods: Order['paymentMethod'][] = ['card', 'cash', 'online'];
  const paymentStatuses: Order['paymentStatus'][] = ['paid', 'unpaid'];
  
  // Customer names
  const customers = [
    { id: 'cust-001', name: 'John Doe', email: 'john@example.com', phone: '555-1234' },
    { id: 'cust-002', name: 'Jane Smith', email: 'jane@example.com', phone: '555-5678' },
    { id: 'cust-003', name: 'Robert Johnson', email: 'robert@example.com', phone: '555-9012' },
    { id: 'cust-004', name: 'Sarah Williams', email: 'sarah@example.com', phone: '555-3456' },
    { id: 'cust-005', name: 'Michael Brown', email: 'michael@example.com', phone: '555-7890' },
  ];
  
  // Time slots for orders
  const timeSlots = ['12:30', '13:00', '13:30', '18:45', '19:15', '19:45', '20:30'];
  
  // Generate orders for the past 15 days and the next 15 days
  for (let i = -15; i <= 15; i++) {
    const date = addDays(today, i);
    const formattedDate = format(date, 'yyyy-MM-dd');
    
    // Random number of orders for this date (0 to 5)
    const numOrders = Math.floor(Math.random() * 6);
    
    for (let j = 0; j < numOrders; j++) {
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const time = timeSlots[Math.floor(Math.random() * timeSlots.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      // Generate order items
      const numItems = Math.floor(Math.random() * 3) + 1; // 1 to 3 items
      const items: OrderItem[] = [];
      let total = 0;
      
      for (let k = 0; k < numItems; k++) {
        const dish = mockDishes[Math.floor(Math.random() * mockDishes.length)];
        const quantity = Math.floor(Math.random() * 3) + 1; // 1 to 3 of each item
        const price = dish.price;
        
        items.push({
          id: `item-${Date.now()}-${k}`,
          dishId: dish.id,
          name: dish.name,
          quantity,
          price
        });
        
        total += price * quantity;
      }
      
      // Round total to 2 decimal places
      total = parseFloat(total.toFixed(2));
      
      orders.push({
        id: `order-${formattedDate}-${j}`,
        date: formattedDate,
        time,
        customer,
        items,
        total,
        status,
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        paymentStatus: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
        notes: Math.random() > 0.7 ? 'Special request: Extra sauce on the side' : undefined
      });
    }
  }
  
  return orders;
};

// Generate mock data
const mockOrders = generateMockOrders();

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
  
  // Get dates with orders
  getOrderDates: async (startDate?: string, endDate?: string): Promise<OrderDatesResponse> => {
    await delay(600);
    
    // If no dates provided, default to current month
    let start: Date;
    let end: Date;
    
    if (startDate && endDate) {
      // Use the provided date range
      start = parseISO(startDate);
      end = parseISO(endDate);
    } else {
      // Default to current month if no specific dates
      const today = new Date();
      start = startOfMonth(today);
      end = endOfMonth(today);
    }
    
    // Filter orders within the date range
    const filteredOrders = mockOrders.filter(order => {
      const orderDate = parseISO(order.date);
      return orderDate >= start && orderDate <= end;
    });
    
    // Group orders by date and count
    const dateMap = new Map<string, number>();
    
    filteredOrders.forEach(order => {
      const count = dateMap.get(order.date) || 0;
      dateMap.set(order.date, count + 1);
    });
    
    // Convert to array of OrderDate objects
    const dates: OrderDate[] = Array.from(dateMap.entries()).map(([date, orderCount]) => ({
      date,
      orderCount
    }));
    
    return {
      dates,
      total: dates.length
    };
  },
  
  // Get orders for a specific date
  getOrdersByDate: async (date: string, status?: string): Promise<OrdersResponse> => {
    await delay(700);
    
    // Filter orders for the specified date
    let orders = mockOrders.filter(order => order.date === date);
    
    // Apply status filter if provided
    if (status && status !== 'all') {
      orders = orders.filter(order => order.status === status);
    }
    
    // Sort by time
    orders.sort((a, b) => a.time.localeCompare(b.time));
    
    return {
      orders,
      total: orders.length
    };
  },
  
  // Get orders for a date range
  getOrdersByDateRange: async (startDate: string, endDate: string, status?: string): Promise<OrdersResponse> => {
    await delay(800);
    
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    
    // Filter orders within the date range
    let orders = mockOrders.filter(order => {
      const orderDate = parseISO(order.date);
      return orderDate >= start && orderDate <= end;
    });
    
    // Apply status filter if provided
    if (status && status !== 'all') {
      orders = orders.filter(order => order.status === status);
    }
    
    // Sort by date then time
    orders.sort((a, b) => {
      const dateComparison = a.date.localeCompare(b.date);
      return dateComparison !== 0 ? dateComparison : a.time.localeCompare(b.time);
    });
    
    return {
      orders,
      total: orders.length
    };
  }
};
