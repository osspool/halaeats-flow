
import { Caterer, MenuItem, AvailableDate } from '../types';
import { addDays, format } from 'date-fns';

// Helper to create date strings for the next several days
const getNextDays = (daysAhead: number) => {
  return format(addDays(new Date(), daysAhead), 'yyyy-MM-dd');
};

// Generate available dates for the next 7 days
const generateAvailableDates = (menuItems: MenuItem[]): AvailableDate[] => {
  const dates: AvailableDate[] = [];
  
  for (let i = 0; i < 7; i++) {
    const date = getNextDays(i);
    
    // Filter menu items available for this date
    // For mock data, we'll make some items available on odd days, some on even days, and some every day
    const availableMenu = menuItems.filter(item => {
      if (i % 2 === 0 && item.id.includes('a')) return true;
      if (i % 2 === 1 && item.id.includes('b')) return true;
      if (item.id.includes('c')) return true;
      return false;
    });
    
    // Add the availability date for each menu item
    availableMenu.forEach(item => {
      if (!item.availableDates.includes(date)) {
        item.availableDates.push(date);
      }
    });
    
    dates.push({
      date,
      availableTimeSlots: [
        {
          id: `morning-${i}`,
          startTime: '10:00',
          endTime: '12:00',
          available: i !== 2, // Make one day unavailable for the morning slot
        },
        {
          id: `afternoon-${i}`,
          startTime: '12:00',
          endTime: '15:00',
          available: true,
        },
        {
          id: `evening-${i}`,
          startTime: '17:00',
          endTime: '20:00',
          available: i !== 5, // Make one day unavailable for the evening slot
        },
      ],
      menu: availableMenu,
    });
  }
  
  return dates;
};

// Menu items
export const menuItems: MenuItem[] = [
  {
    id: 'item-a1',
    name: 'Butter Chicken',
    description: 'Tender chicken cooked in a rich, creamy tomato sauce with aromatic spices.',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=684&auto=format&fit=crop',
    price: 15.99,
    category: 'Main Course',
    dietary: ['gluten-free'],
    featured: true,
    availableDates: [],
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
      {
        id: 'add-ons',
        name: 'Add-ons',
        required: false,
        multiple: true,
        options: [
          { id: 'naan', name: 'Garlic Naan', price: 2.99 },
          { id: 'rice', name: 'Basmati Rice', price: 3.49 },
          { id: 'raita', name: 'Cucumber Raita', price: 1.99 },
        ],
      },
    ],
  },
  {
    id: 'item-b1',
    name: 'Veggie Biryani',
    description: 'Fragrant basmati rice cooked with mixed vegetables and aromatic spices.',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=687&auto=format&fit=crop',
    price: 13.99,
    category: 'Main Course',
    dietary: ['vegetarian'],
    featured: true,
    availableDates: [],
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
      {
        id: 'add-ons',
        name: 'Add-ons',
        required: false,
        multiple: true,
        options: [
          { id: 'raita', name: 'Cucumber Raita', price: 1.99 },
          { id: 'papadum', name: 'Papadum (2 pieces)', price: 1.50 },
        ],
      },
    ],
  },
  {
    id: 'item-c1',
    name: 'Chicken Tikka Kebabs',
    description: 'Marinated chicken pieces grilled to perfection with a blend of spices.',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=1050&auto=format&fit=crop',
    price: 12.99,
    category: 'Appetizer',
    dietary: ['high-protein'],
    featured: false,
    availableDates: [],
    customizations: [
      {
        id: 'portion',
        name: 'Portion Size',
        required: true,
        multiple: false,
        options: [
          { id: 'regular', name: 'Regular (4 pieces)', price: 0 },
          { id: 'large', name: 'Large (6 pieces)', price: 4.99 },
        ],
      },
      {
        id: 'dips',
        name: 'Dipping Sauce',
        required: false,
        multiple: true,
        options: [
          { id: 'mint', name: 'Mint Chutney', price: 0.99 },
          { id: 'tamarind', name: 'Sweet Tamarind', price: 0.99 },
        ],
      },
    ],
  },
  {
    id: 'item-a2',
    name: 'Lamb Korma',
    description: 'Tender pieces of lamb in a rich, creamy sauce with cashews and mild spices.',
    image: 'https://images.unsplash.com/photo-1545247181-516773cae754?q=80&w=880&auto=format&fit=crop',
    price: 17.99,
    category: 'Main Course',
    dietary: ['high-protein'],
    featured: true,
    availableDates: [],
    customizations: [
      {
        id: 'spice-level',
        name: 'Spice Level',
        required: true,
        multiple: false,
        options: [
          { id: 'mild', name: 'Mild', price: 0 },
          { id: 'medium', name: 'Medium', price: 0 },
        ],
      },
      {
        id: 'add-ons',
        name: 'Add-ons',
        required: false,
        multiple: true,
        options: [
          { id: 'naan', name: 'Garlic Naan', price: 2.99 },
          { id: 'rice', name: 'Basmati Rice', price: 3.49 },
        ],
      },
    ],
  },
  {
    id: 'item-b2',
    name: 'Palak Paneer',
    description: 'Cottage cheese cubes in a creamy spinach sauce with aromatic spices.',
    image: 'https://images.unsplash.com/photo-1618449840665-9ed506d73a34?q=80&w=687&auto=format&fit=crop',
    price: 14.99,
    category: 'Main Course',
    dietary: ['vegetarian', 'gluten-free'],
    featured: false,
    availableDates: [],
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
      {
        id: 'add-ons',
        name: 'Add-ons',
        required: false,
        multiple: true,
        options: [
          { id: 'naan', name: 'Garlic Naan', price: 2.99 },
          { id: 'rice', name: 'Basmati Rice', price: 3.49 },
        ],
      },
    ],
  },
  {
    id: 'item-c2',
    name: 'Gulab Jamun',
    description: 'Soft milk dumplings soaked in rose-flavored sugar syrup.',
    image: 'https://images.unsplash.com/photo-1602082666899-492e4a428e94?q=80&w=764&auto=format&fit=crop',
    price: 5.99,
    category: 'Dessert',
    dietary: ['vegetarian'],
    featured: true,
    availableDates: [],
    customizations: [
      {
        id: 'portion',
        name: 'Portion Size',
        required: true,
        multiple: false,
        options: [
          { id: 'small', name: 'Small (2 pieces)', price: 0 },
          { id: 'regular', name: 'Regular (4 pieces)', price: 3.99 },
        ],
      },
      {
        id: 'add-ons',
        name: 'Add-ons',
        required: false,
        multiple: false,
        options: [
          { id: 'ice-cream', name: 'Vanilla Ice Cream', price: 2.49 },
        ],
      },
    ],
  },
  {
    id: 'item-a3',
    name: 'Mango Lassi',
    description: 'A refreshing yogurt-based drink with mango pulp and a hint of cardamom.',
    image: 'https://images.unsplash.com/photo-1626642767165-b827e79fce1b?q=80&w=685&auto=format&fit=crop',
    price: 4.99,
    category: 'Beverage',
    dietary: ['vegetarian'],
    featured: false,
    availableDates: [],
  },
  {
    id: 'item-b3',
    name: 'Samosa (2 pieces)',
    description: 'Crispy triangular pastries filled with spiced potatoes and peas.',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=1170&auto=format&fit=crop',
    price: 6.99,
    category: 'Appetizer',
    dietary: ['vegetarian'],
    featured: true,
    availableDates: [],
    customizations: [
      {
        id: 'dips',
        name: 'Dipping Sauce',
        required: false,
        multiple: true,
        options: [
          { id: 'mint', name: 'Mint Chutney', price: 0.99 },
          { id: 'tamarind', name: 'Sweet Tamarind', price: 0.99 },
        ],
      },
    ],
  },
];

// Caterers data
export const caterers: Caterer[] = [
  {
    id: 'caterer-1',
    name: 'Spice Delight',
    profileImage: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?q=80&w=2070&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?q=80&w=2000&auto=format&fit=crop',
    description: 'Authentic Indian cuisine prepared with love using traditional family recipes and fresh ingredients.',
    rating: 4.8,
    reviewCount: 243,
    cuisine: ['Indian', 'Vegetarian'],
    location: 'Downtown',
    deliveryFee: 3.99,
    minimumOrder: 20,
    preparationTime: '40-60 min',
    isOpen: true,
    availableDates: generateAvailableDates(menuItems.slice(0, 3)),
  },
  {
    id: 'caterer-2',
    name: 'Curry House',
    profileImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1160&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?q=80&w=2080&auto=format&fit=crop',
    description: 'Specializing in Northern Indian cuisine with a modern twist. Our chef brings 20 years of experience.',
    rating: 4.6,
    reviewCount: 187,
    cuisine: ['North Indian', 'Halal'],
    location: 'Midtown',
    deliveryFee: 4.99,
    minimumOrder: 25,
    preparationTime: '30-50 min',
    isOpen: true,
    availableDates: generateAvailableDates(menuItems.slice(3, 6)),
  },
  {
    id: 'caterer-3',
    name: 'Taj Kitchen',
    profileImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1170&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop',
    description: 'Family-owned restaurant offering a blend of traditional and contemporary Indian dishes.',
    rating: 4.9,
    reviewCount: 302,
    cuisine: ['South Indian', 'Street Food'],
    location: 'Uptown',
    deliveryFee: 2.99,
    minimumOrder: 15,
    preparationTime: '20-40 min',
    isOpen: true,
    availableDates: generateAvailableDates(menuItems.slice(6)),
  },
];

// All menu items with their caterers
export const allMenuItems = [
  ...caterers[0].availableDates.flatMap(date => 
    date.menu.map(item => ({ ...item, catererId: caterers[0].id, catererName: caterers[0].name }))
  ),
  ...caterers[1].availableDates.flatMap(date => 
    date.menu.map(item => ({ ...item, catererId: caterers[1].id, catererName: caterers[1].name }))
  ),
  ...caterers[2].availableDates.flatMap(date => 
    date.menu.map(item => ({ ...item, catererId: caterers[2].id, catererName: caterers[2].name }))
  ),
];

// Featured dishes for the homepage
export const featuredDishes = allMenuItems
  .filter(item => item.featured)
  .slice(0, 6);

// Featured caterers for the homepage
export const featuredCaterers = caterers.slice(0, 3);
