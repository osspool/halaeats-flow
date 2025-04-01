
import { caterers } from '@/data/mockData';
import { LatLngTuple } from 'leaflet';

// Calculate distance between two coordinates in kilometers
const calculateDistance = (coord1: LatLngTuple, coord2: LatLngTuple): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (coord2[0] - coord1[0]) * Math.PI / 180;
  const dLon = (coord2[1] - coord1[1]) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1[0] * Math.PI / 180) * Math.cos(coord2[0] * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  
  return distance;
};

export interface SearchParams {
  query?: string;
  cuisine?: string;
  location?: LatLngTuple;
  radius?: number;
  deliveryOnly?: boolean;
}

export const searchCaterers = (params: SearchParams) => {
  let results = [...caterers];
  
  // Filter by search query (name or menu items)
  if (params.query && params.query.trim()) {
    const normalizedQuery = params.query.toLowerCase().trim();
    results = results.filter(caterer => 
      caterer.name.toLowerCase().includes(normalizedQuery) || 
      caterer.cuisine.some(c => c.toLowerCase().includes(normalizedQuery)) ||
      caterer.tags.some(tag => tag.toLowerCase().includes(normalizedQuery))
    );
  }
  
  // Filter by cuisine
  if (params.cuisine && params.cuisine !== 'All cuisines') {
    results = results.filter(caterer => 
      caterer.cuisine.some(c => c.toLowerCase() === params.cuisine?.toLowerCase())
    );
  }
  
  // Filter by location radius
  if (params.location && params.radius) {
    results = results.filter(caterer => {
      // For mock data, let's assume each caterer has a random location near the search point
      const catererLat = params.location![0] + (Math.random() - 0.5) * 0.1;
      const catererLng = params.location![1] + (Math.random() - 0.5) * 0.1;
      const catererLocation: LatLngTuple = [catererLat, catererLng];
      
      // Calculate distance
      const distance = calculateDistance(params.location!, catererLocation);
      
      // Store the distance for sorting later
      (caterer as any).distance = distance.toFixed(1);
      
      // Return true if within radius
      return distance <= params.radius!;
    });
    
    // Sort by distance
    results.sort((a, b) => (a as any).distance - (b as any).distance);
  }
  
  // Filter by delivery availability
  if (params.deliveryOnly) {
    results = results.filter(caterer => caterer.deliveryAvailable);
  }
  
  return results;
};
