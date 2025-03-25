
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DishCreateRequest } from "@/types/restaurant";

interface DishFormProps {
  onSubmit: (dish: DishCreateRequest) => void;
}

const DishForm = ({ onSubmit }: DishFormProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newDish: DishCreateRequest = {
      name: formData.get('name') as string,
      price: parseFloat(formData.get('price') as string),
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      dietary: []
    };
    
    onSubmit(newDish);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Add New Dish</DialogTitle>
        <DialogDescription>
          Add a new dish to your menu with pricing and category information.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4 pt-4">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="name">Dish Name</Label>
          <Input id="name" name="name" placeholder="Enter dish name" required />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="price">Price ($)</Label>
          <Input id="price" name="price" type="number" step="0.01" min="0" placeholder="0.00" required />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="category">Category</Label>
          <Input id="category" name="category" placeholder="e.g., Pasta, Dessert" required />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="description">Description</Label>
          <Input id="description" name="description" placeholder="Brief description of the dish" required />
        </div>
        <DialogFooter>
          <Button type="submit">Add Dish</Button>
        </DialogFooter>
      </form>
    </>
  );
};

export default DishForm;
