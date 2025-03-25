
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DishManagement from "@/components/dashboard/DishManagement";
import OrderCalendar from "@/components/dashboard/OrderCalendar";

const RestaurantDashboard = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Restaurant Owner Dashboard</h1>
      
      <Tabs defaultValue="dishes" className="w-full">
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
  );
};

export default RestaurantDashboard;
