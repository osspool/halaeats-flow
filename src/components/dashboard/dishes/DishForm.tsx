
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DishType, DishVisibility, DishCreateRequest, DailyAvailability, TimeSlot } from "@/types/restaurant";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
} from "@/components/ui/dialog";
import TimeSlotEditor from "./TimeSlotEditor";
import { useForm, Controller } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";

interface DishFormProps {
  initialData?: DishCreateRequest;
  onSubmit: (dish: DishCreateRequest) => void;
  onCancel: () => void;
}

const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

const DishForm = ({ initialData, onSubmit, onCancel }: DishFormProps) => {
  const { register, handleSubmit, control, formState: { errors } } = useForm<DishCreateRequest>({
    defaultValues: initialData || {
      name: '',
      price: 0,
      description: '',
      dishType: DishType.MAIN_COURSE,
      dietary: [],
      visibility: DishVisibility.DRAFT,
      featured: false,
      isSpicy: false,
      maxOrdersPerDay: -1,
      availability: DAYS_OF_WEEK.map(day => ({ 
        day, 
        time_slots: [] 
      }))
    }
  });

  const onFormSubmit = (data: DishCreateRequest) => {
    onSubmit(data);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{initialData ? 'Edit Dish' : 'Add New Dish'}</DialogTitle>
        <DialogDescription>
          {initialData 
            ? 'Edit your dish information including availability.'
            : 'Add a new dish to your menu with pricing and availability information.'}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 pt-4 overflow-y-auto max-h-[60vh]">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Basic Information</h3>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="name">Dish Name</Label>
            <Input 
              id="name" 
              {...register("name", { required: "Dish name is required" })} 
              placeholder="Enter dish name" 
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>
          
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="price">Price ($)</Label>
            <Input 
              id="price" 
              {...register("price", { 
                required: "Price is required",
                valueAsNumber: true,
                min: { value: 0, message: "Price cannot be negative" }
              })}
              type="number" 
              step="0.01" 
              min="0" 
              placeholder="0.00" 
            />
            {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="dishType">Dish Type</Label>
            <Controller
              control={control}
              name="dishType"
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select dish type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(DishType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              {...register("description", { required: "Description is required" })}
              placeholder="Brief description of the dish" 
              className="min-h-[100px]"
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>
        </div>

        {/* Additional Options */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Additional Options</h3>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="featured">Featured Dish</Label>
            <Controller
              control={control}
              name="featured"
              render={({ field }) => (
                <Switch 
                  id="featured"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="isSpicy">Spicy</Label>
            <Controller
              control={control}
              name="isSpicy"
              render={({ field }) => (
                <Switch 
                  id="isSpicy"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>
          
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="visibility">Visibility</Label>
            <Controller
              control={control}
              name="visibility"
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(DishVisibility).map((visibility) => (
                      <SelectItem key={visibility} value={visibility}>
                        {visibility.charAt(0).toUpperCase() + visibility.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
        
        {/* Time Slot Availability */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Availability</h3>
          <p className="text-sm text-muted-foreground">Set the days and times when this dish is available</p>
          
          <div className="space-y-4">
            {DAYS_OF_WEEK.map((day, index) => (
              <Controller
                key={day}
                control={control}
                name={`availability.${index}.time_slots`}
                render={({ field }) => (
                  <Card>
                    <CardContent className="pt-6">
                      <TimeSlotEditor
                        day={day}
                        timeSlots={field.value}
                        onChange={field.onChange}
                      />
                    </CardContent>
                  </Card>
                )}
              />
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel} className="mr-2">Cancel</Button>
          <Button type="submit">{initialData ? 'Update Dish' : 'Add Dish'}</Button>
        </DialogFooter>
      </form>
    </>
  );
};

export default DishForm;
