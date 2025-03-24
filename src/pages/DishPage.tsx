
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { allMenuItems, caterers } from '@/data/mockData';
import { MenuItem, TimeSlot, CartItem, SelectedCustomization } from '@/types';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DishDetail from '@/components/dish/DishDetail';
import DishDetailsSheet from '@/components/dish/DishDetailsSheet';

// This component is for direct URL access to a dish
const DishPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dish, setDish] = useState<MenuItem | null>(null);
  const [catererName, setCatererName] = useState('');
  const [catererId, setCatererId] = useState('');
  const [availableDates, setAvailableDates] = useState<{ date: string; timeSlots: TimeSlot[] }[]>([]);
  
  useEffect(() => {
    // Find the dish by ID
    const foundDish = allMenuItems.find(item => item.id === id);
    
    if (foundDish) {
      setDish(foundDish);
      
      // Find caterer details
      const catererId = (foundDish as any).catererId;
      const catererName = (foundDish as any).catererName;
      
      if (catererId && catererName) {
        setCatererId(catererId);
        setCatererName(catererName);
        
        // Find the caterer's available dates for this dish
        const caterer = caterers.find(c => c.id === catererId);
        if (caterer) {
          // Filter dates where this dish is available
          const datesWithDish = caterer.availableDates
            .filter(date => date.menu.some(item => item.id === id))
            .map(date => ({
              date: date.date,
              timeSlots: date.availableTimeSlots
            }));
          
          setAvailableDates(datesWithDish);
        }
      }
    }
  }, [id]);
  
  const handleAddToCart = (
    quantity: number, 
    selectedDate: string, 
    selectedTimeSlot: TimeSlot, 
    customizations: { customizationId: string; optionIds: string[] }[]
  ) => {
    if (!dish) return;
    
    // Calculate the total price including customizations
    let itemTotal = dish.price * quantity;
    
    // Add price of customizations
    if (dish.customizations) {
      dish.customizations.forEach(customization => {
        const selectedOptions = customizations
          .find(c => c.customizationId === customization.id)
          ?.optionIds || [];
        
        selectedOptions.forEach(optionId => {
          const option = customization.options.find(opt => opt.id === optionId);
          if (option) {
            itemTotal += option.price * quantity;
          }
        });
      });
    }
    
    // Create a cart item
    const cartItem: CartItem = {
      id: uuidv4(),
      menuItem: dish,
      quantity,
      selectedDate,
      selectedTimeSlot,
      customizations: customizations as SelectedCustomization[],
      caterer: {
        id: catererId,
        name: catererName
      },
      subtotal: itemTotal
    };
    
    // In a real app, we would add this to a cart state or context
    console.log('Adding to cart:', cartItem);
  };
  
  if (!dish) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow mt-16 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-medium mb-2">Dish Not Found</h2>
            <p className="text-halaeats-600">The dish you're looking for doesn't exist or has been removed.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow mt-16">
        <DishDetail
          dish={dish}
          catererName={catererName}
          catererId={catererId}
          availableDates={availableDates}
          onAddToCart={handleAddToCart}
        />
      </main>
      
      <Footer />
    </div>
  );
};

// Export a component to handle opening the dish in a sheet
export const useDishDetailsSheet = () => {
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [catererDetails, setCatererDetails] = useState<{
    name: string;
    id: string;
    availableDates: { date: string; timeSlots: TimeSlot[] }[];
  } | null>(null);

  const openDishDetails = (dish: MenuItem) => {
    // Find caterer details
    const catererId = (dish as any).catererId;
    const catererName = (dish as any).catererName;
    
    if (catererId && catererName) {
      // Find the caterer's available dates for this dish
      const caterer = caterers.find(c => c.id === catererId);
      if (caterer) {
        // Filter dates where this dish is available
        const datesWithDish = caterer.availableDates
          .filter(date => date.menu.some(item => item.id === dish.id))
          .map(date => ({
            date: date.date,
            timeSlots: date.availableTimeSlots
          }));
        
        setCatererDetails({
          name: catererName,
          id: catererId,
          availableDates: datesWithDish
        });
      }
    }

    setSelectedDish(dish);
    setIsSheetOpen(true);
  };

  const closeDishDetails = () => {
    setIsSheetOpen(false);
    // Delay clearing the dish to allow for the closing animation
    setTimeout(() => {
      setSelectedDish(null);
      setCatererDetails(null);
    }, 300);
  };

  const handleAddToCart = (
    quantity: number, 
    selectedDate: string, 
    selectedTimeSlot: TimeSlot, 
    customizations: { customizationId: string; optionIds: string[] }[]
  ) => {
    if (!selectedDish || !catererDetails) return;
    
    // Calculate the total price including customizations
    let itemTotal = selectedDish.price * quantity;
    
    // Add price of customizations
    if (selectedDish.customizations) {
      selectedDish.customizations.forEach(customization => {
        const selectedOptions = customizations
          .find(c => c.customizationId === customization.id)
          ?.optionIds || [];
        
        selectedOptions.forEach(optionId => {
          const option = customization.options.find(opt => opt.id === optionId);
          if (option) {
            itemTotal += option.price * quantity;
          }
        });
      });
    }
    
    // Create a cart item
    const cartItem: CartItem = {
      id: uuidv4(),
      menuItem: selectedDish,
      quantity,
      selectedDate,
      selectedTimeSlot,
      customizations: customizations as SelectedCustomization[],
      caterer: {
        id: catererDetails.id,
        name: catererDetails.name
      },
      subtotal: itemTotal
    };
    
    // In a real app, we would add this to a cart state or context
    console.log('Adding to cart from sheet:', cartItem);
  };

  const DishDetailsSheetComponent = () => (
    <DishDetailsSheet
      isOpen={isSheetOpen}
      onClose={closeDishDetails}
      dish={selectedDish}
      catererName={catererDetails?.name || ''}
      catererId={catererDetails?.id || ''}
      availableDates={catererDetails?.availableDates || []}
      onAddToCart={handleAddToCart}
    />
  );

  return {
    openDishDetails,
    DishDetailsSheetComponent
  };
};

export default DishPage;
