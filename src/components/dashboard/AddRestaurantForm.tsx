
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Plus, X } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, { message: "Restaurant name must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  location: z.string().min(5, { message: "Location is required" }),
  cuisine: z.string().array().min(1, { message: "At least one cuisine type is required" }),
  deliveryFee: z.coerce.number().min(0, { message: "Delivery fee must be a positive number" }),
  minimumOrder: z.coerce.number().min(0, { message: "Minimum order must be a positive number" }),
  preparationTime: z.string().min(1, { message: "Preparation time is required" }),
  openingDate: z.date({ required_error: "Opening date is required" }),
  isOpen: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

const cuisineOptions = [
  "Italian", "Mexican", "American", "Chinese", "Indian", 
  "Japanese", "French", "Thai", "Mediterranean", "Middle Eastern"
];

const AddRestaurantForm = () => {
  const [cuisines, setCuisines] = React.useState<string[]>([]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      cuisine: [],
      deliveryFee: 0,
      minimumOrder: 0,
      preparationTime: "",
      isOpen: true,
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    
    // In a real app, this would send data to the backend
    toast({
      title: "Restaurant Added",
      description: `${data.name} has been successfully added.`,
    });
    
    form.reset();
    setCuisines([]);
  };

  const handleAddCuisine = (cuisine: string) => {
    if (!cuisines.includes(cuisine)) {
      const newCuisines = [...cuisines, cuisine];
      setCuisines(newCuisines);
      form.setValue("cuisine", newCuisines);
    }
  };

  const handleRemoveCuisine = (cuisine: string) => {
    const newCuisines = cuisines.filter(c => c !== cuisine);
    setCuisines(newCuisines);
    form.setValue("cuisine", newCuisines);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Restaurant</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Restaurant Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter restaurant name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter restaurant description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cuisine"
                render={() => (
                  <FormItem>
                    <FormLabel>Cuisine Types</FormLabel>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {cuisines.map(cuisine => (
                        <div key={cuisine} className="flex items-center bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                          {cuisine}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 ml-1 hover:bg-transparent"
                            onClick={() => handleRemoveCuisine(cuisine)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        onChange={(e) => e.target.value && handleAddCuisine(e.target.value)}
                        value=""
                      >
                        <option value="" disabled>Select cuisine</option>
                        {cuisineOptions.map(cuisine => (
                          <option key={cuisine} value={cuisine}>{cuisine}</option>
                        ))}
                      </select>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon"
                        onClick={() => {
                          const select = document.querySelector('select') as HTMLSelectElement;
                          if (select && select.value) {
                            handleAddCuisine(select.value);
                            select.value = '';
                          }
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deliveryFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Fee ($)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="minimumOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Order ($)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preparationTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preparation Time (e.g., "30-45 min")</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter preparation time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="openingDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Opening Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full justify-start text-left font-normal ${
                              !field.value && "text-muted-foreground"
                            }`}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isOpen"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Available for Orders</FormLabel>
                      <FormDescription>
                        Allow customers to place orders from this restaurant
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full">Add Restaurant</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddRestaurantForm;
