
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
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Restaurant Owner Dashboard</h1>
        
        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="dishes">Manage Dishes</TabsTrigger>
            <TabsTrigger value="calendar">Order Calendar</TabsTrigger>
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
