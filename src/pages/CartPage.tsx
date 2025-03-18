
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { CartItem, OrderSummary, OrderType } from '@/types';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartItem from '@/components/cart/CartItem';
import CartSidebar from '@/components/cart/CartSidebar';

// Mock cart data for demo purposes
const mockCartItems: CartItem[] = [
  {
    id: 'cart-1',
    menuItem: {
      id: 'item-a1',
      name: 'Butter Chicken',
      description: 'Tender chicken cooked in a rich, creamy tomato sauce with aromatic spices.',
      image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=684&auto=format&fit=crop',
      price: 15.99,
      category: 'Main Course',
      dietary: ['gluten-free'],
      featured: true,
      availableDates: ['2023-10-01'],
      customizations: [
        {
          id: 'spice-level',
          name: 'Spice Level',
          required: true,
          multiple: false,
          options: [
            { id: 'mild', name: 'Mild', price: 0 },
            { id: 'medium', name: 'Medium', price: 0 },
            { id: 'hot', name: 'Hot', price: 0 },
          ],
        },
      ],
    },
    quantity: 2,
    selectedDate: '2023-12-15',
    selectedTimeSlot: {
      id: 'time-1',
      startTime: '12:00',
      endTime: '14:00',
      available: true,
    },
    customizations: [
      {
        customizationId: 'spice-level',
        optionIds: ['medium'],
      },
    ],
    caterer: {
      id: 'caterer-1',
      name: 'Spice Delight',
    },
    subtotal: 31.98,
  },
  {
    id: 'cart-2',
    menuItem: {
      id: 'item-b1',
      name: 'Veggie Biryani',
      description: 'Fragrant basmati rice cooked with mixed vegetables and aromatic spices.',
      image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=687&auto=format&fit=crop',
      price: 13.99,
      category: 'Main Course',
      dietary: ['vegetarian'],
      featured: true,
      availableDates: ['2023-10-01'],
    },
    quantity: 1,
    selectedDate: '2023-12-15',
    selectedTimeSlot: {
      id: 'time-1',
      startTime: '12:00',
      endTime: '14:00',
      available: true,
    },
    customizations: [],
    caterer: {
      id: 'caterer-1',
      name: 'Spice Delight',
    },
    subtotal: 13.99,
  },
];

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems);
  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [orderSummary, setOrderSummary] = useState<OrderSummary>({
    subtotal: 0,
    deliveryFee: 0,
    tax: 0,
    total: 0,
  });
  
  useEffect(() => {
    // Calculate order summary
    const subtotal = cartItems.reduce((total, item) => total + item.subtotal, 0);
    const deliveryFee = orderType === 'delivery' ? 3.99 : 0;
    const tax = subtotal * 0.08; // 8% tax rate
    const total = subtotal + deliveryFee + tax;
    
    setOrderSummary({
      subtotal,
      deliveryFee,
      tax,
      total,
    });
  }, [cartItems, orderType]);
  
  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === id) {
          const updatedSubtotal = (item.menuItem.price * quantity);
          return { ...item, quantity, subtotal: updatedSubtotal };
        }
        return item;
      })
    );
  };
  
  const handleRemoveItem = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };
  
  const handleOrderTypeChange = (type: OrderType) => {
    setOrderType(type);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow mt-16 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-serif font-bold mb-2 flex items-center">
            <ShoppingBag className="mr-3 h-6 w-6 text-primary" />
            Your Cart
          </h1>
          <p className="text-halaeats-600 mb-8">
            Review your items and proceed to checkout when ready.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              {cartItems.length === 0 ? (
                <div className="bg-white rounded-xl p-8 shadow-elevation-soft text-center">
                  <div className="w-16 h-16 mx-auto bg-halaeats-50 rounded-full flex items-center justify-center mb-3">
                    <ShoppingBag className="h-8 w-8 text-halaeats-400" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Your cart is empty</h3>
                  <p className="text-halaeats-600 mb-6">
                    Looks like you haven't added any items to your cart yet.
                  </p>
                  <Link to="/">
                    <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-cuisine-600 transition-colors">
                      Browse Caterers
                    </button>
                  </Link>
                </div>
              ) : (
                <div>
                  {cartItems.map(item => (
                    <CartItem 
                      key={item.id}
                      item={item}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemove={handleRemoveItem}
                    />
                  ))}
                </div>
              )}
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <CartSidebar 
                items={cartItems}
                orderSummary={orderSummary}
                orderType={orderType}
                onOrderTypeChange={handleOrderTypeChange}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CartPage;
