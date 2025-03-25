
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddRestaurantForm from "@/components/dashboard/AddRestaurantForm";
import OrderCalendar from "@/components/dashboard/OrderCalendar";

const RestaurantDashboard = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Restaurant Dashboard</h1>
      
      <Tabs defaultValue="add-restaurant" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="add-restaurant">Add Restaurant</TabsTrigger>
          <TabsTrigger value="calendar">Order Calendar</TabsTrigger>
        </TabsList>
        <TabsContent value="add-restaurant">
          <AddRestaurantForm />
        </TabsContent>
        <TabsContent value="calendar">
          <OrderCalendar />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RestaurantDashboard;
