
import React from 'react';
import { FilterX, Utensils, MapPin, Truck, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { CatererFilters } from '@/hooks/useCatererSearch';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface CatererFiltersProps {
  filters: CatererFilters;
  updateFilters: (filters: Partial<CatererFilters>) => void;
  resetFilters: () => void;
  cuisineOptions: string[];
  activeFilterCount: number;
}

const CatererFilters: React.FC<CatererFiltersProps> = ({
  filters,
  updateFilters,
  resetFilters,
  cuisineOptions,
  activeFilterCount
}) => {
  return (
    <div className="mb-6">
      {/* Desktop filters */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Filters</h2>
          {activeFilterCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetFilters}
              className="text-primary flex items-center gap-1"
            >
              <FilterX className="w-4 h-4" />
              Clear all filters
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          {/* Sort by */}
          <div className="col-span-1">
            <Label htmlFor="sort-by" className="block mb-2 text-sm font-medium">
              Sort by
            </Label>
            <Select
              value={filters.sortBy}
              onValueChange={(value) => updateFilters({ sortBy: value as CatererFilters['sortBy'] })}
            >
              <SelectTrigger id="sort-by" className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="rating">Top Rated</SelectItem>
                  <SelectItem value="deliveryFee">Delivery Fee</SelectItem>
                  <SelectItem value="preparationTime">Preparation Time</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          {/* Cuisine filter */}
          <div className="col-span-1">
            <Label htmlFor="cuisine-filter" className="block mb-2 text-sm font-medium">
              Cuisine
            </Label>
            <Select
              value={filters.cuisine || ''}
              onValueChange={(value) => updateFilters({ cuisine: value || null })}
            >
              <SelectTrigger id="cuisine-filter" className="w-full">
                <SelectValue placeholder="All cuisines" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="">All cuisines</SelectItem>
                  {cuisineOptions.map((cuisine) => (
                    <SelectItem key={cuisine} value={cuisine}>
                      {cuisine}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          {/* Location filter (text input) */}
          <div className="col-span-1">
            <Label htmlFor="location-filter" className="block mb-2 text-sm font-medium">
              Location
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="location-filter"
                type="text"
                value={filters.location || ''}
                onChange={(e) => updateFilters({ location: e.target.value || null })}
                placeholder="Enter location"
                className="pl-10 pr-4 py-2 h-10 w-full border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
          
          {/* Delivery Only Switch */}
          <div className="col-span-1 flex items-end">
            <div className="flex items-center space-x-2 h-10">
              <Switch
                id="delivery-only"
                checked={filters.deliveryOnly}
                onCheckedChange={(checked) => updateFilters({ deliveryOnly: checked })}
              />
              <Label htmlFor="delivery-only" className="cursor-pointer">
                Delivery only
              </Label>
            </div>
          </div>
        </div>
        
        {/* Active Filters Display */}
        {activeFilterCount > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {filters.query && (
              <Badge variant="secondary" className="pl-2 pr-1 py-1 gap-1 flex items-center">
                <span>"{filters.query}"</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 rounded-full" 
                  onClick={() => updateFilters({ query: '' })}
                >
                  <span className="sr-only">Remove</span>
                  <span aria-hidden>×</span>
                </Button>
              </Badge>
            )}
            
            {filters.cuisine && (
              <Badge variant="secondary" className="pl-2 pr-1 py-1 gap-1 flex items-center">
                <Utensils className="h-3 w-3 mr-1" />
                <span>{filters.cuisine}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 rounded-full" 
                  onClick={() => updateFilters({ cuisine: null })}
                >
                  <span className="sr-only">Remove</span>
                  <span aria-hidden>×</span>
                </Button>
              </Badge>
            )}
            
            {filters.location && (
              <Badge variant="secondary" className="pl-2 pr-1 py-1 gap-1 flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                <span>{filters.location}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 rounded-full" 
                  onClick={() => updateFilters({ location: null })}
                >
                  <span className="sr-only">Remove</span>
                  <span aria-hidden>×</span>
                </Button>
              </Badge>
            )}
            
            {filters.deliveryOnly && (
              <Badge variant="secondary" className="pl-2 pr-1 py-1 gap-1 flex items-center">
                <Truck className="h-3 w-3 mr-1" />
                <span>Delivery only</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 rounded-full" 
                  onClick={() => updateFilters({ deliveryOnly: false })}
                >
                  <span className="sr-only">Remove</span>
                  <span aria-hidden>×</span>
                </Button>
              </Badge>
            )}
          </div>
        )}
      </div>
      
      {/* Mobile filters */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Filters</h2>
          
          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetFilters}
                className="text-sm"
              >
                Clear ({activeFilterCount})
              </Button>
            )}
            
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <span>Filters</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>
                    Refine your search results
                  </SheetDescription>
                </SheetHeader>
                
                <div className="py-4 space-y-6">
                  {/* Sort Options */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Sort by</h3>
                    <RadioGroup 
                      value={filters.sortBy} 
                      onValueChange={(value) => updateFilters({ sortBy: value as CatererFilters['sortBy'] })}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="rating" id="sort-rating" />
                        <Label htmlFor="sort-rating">Top Rated</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="deliveryFee" id="sort-fee" />
                        <Label htmlFor="sort-fee">Delivery Fee</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="preparationTime" id="sort-time" />
                        <Label htmlFor="sort-time">Preparation Time</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Separator />
                  
                  {/* Cuisine filter */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Cuisine</h3>
                    <Select
                      value={filters.cuisine || ''}
                      onValueChange={(value) => updateFilters({ cuisine: value || null })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All cuisines" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="">All cuisines</SelectItem>
                          {cuisineOptions.map((cuisine) => (
                            <SelectItem key={cuisine} value={cuisine}>
                              {cuisine}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Separator />
                  
                  {/* Location filter */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Location</h3>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={filters.location || ''}
                        onChange={(e) => updateFilters({ location: e.target.value || null })}
                        placeholder="Enter location"
                        className="pl-10 pr-4 py-2 w-full border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Delivery Only Switch */}
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="delivery-only-mobile"
                      checked={filters.deliveryOnly}
                      onCheckedChange={(checked) => updateFilters({ deliveryOnly: checked })}
                    />
                    <Label htmlFor="delivery-only-mobile">Delivery only</Label>
                  </div>
                </div>
                
                <SheetFooter>
                  <SheetClose asChild>
                    <Button type="submit">Apply Filters</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        {/* Mobile active filters */}
        {activeFilterCount > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            {filters.query && (
              <Badge variant="secondary" className="whitespace-nowrap pl-2 pr-1 py-1 gap-1 flex items-center">
                <span>"{filters.query}"</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 rounded-full" 
                  onClick={() => updateFilters({ query: '' })}
                >×</Button>
              </Badge>
            )}
            
            {filters.cuisine && (
              <Badge variant="secondary" className="whitespace-nowrap pl-2 pr-1 py-1 gap-1 flex items-center">
                <Utensils className="h-3 w-3 mr-1" />
                <span>{filters.cuisine}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 rounded-full" 
                  onClick={() => updateFilters({ cuisine: null })}
                >×</Button>
              </Badge>
            )}
            
            {filters.location && (
              <Badge variant="secondary" className="whitespace-nowrap pl-2 pr-1 py-1 gap-1 flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                <span>{filters.location}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 rounded-full" 
                  onClick={() => updateFilters({ location: null })}
                >×</Button>
              </Badge>
            )}
            
            {filters.deliveryOnly && (
              <Badge variant="secondary" className="whitespace-nowrap pl-2 pr-1 py-1 gap-1 flex items-center">
                <Truck className="h-3 w-3 mr-1" />
                <span>Delivery only</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 rounded-full" 
                  onClick={() => updateFilters({ deliveryOnly: false })}
                >×</Button>
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CatererFilters;
