
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DishManagement from "@/components/dashboard/DishManagement";
import OrderCalendar from "@/components/dashboard/OrderCalendar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
    },
  },
});

const RestaurantDashboard = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <h1 className="text-3xl font-bold mb-6">Restaurant Owner Dashboard</h1>
        
        <Tabs defaultValue="dishes" className="w-full">
          <TabsList className="mb-4 w-full sm:w-auto">
            <TabsTrigger value="dishes" className="flex-1 sm:flex-none">Manage Dishes</TabsTrigger>
            <TabsTrigger value="calendar" className="flex-1 sm:flex-none">Order Calendar</TabsTrigger>
          </TabsList>
          <TabsContent value="dishes">
            <DishManagement />
          </TabsContent>
          <TabsContent value="calendar">
            <OrderCalendar />
          </TabsContent>
        </Tabs>
      </div>
    </QueryClientProvider>
  );
};

export default RestaurantDashboard;
