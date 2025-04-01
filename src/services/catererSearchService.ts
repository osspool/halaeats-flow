
import { LatLngTuple } from 'leaflet';
import { mockCaterers } from '@/data/mockData';

export interface SearchParams {
  query?: string;
  cuisine?: string;
  deliveryOnly?: boolean;
  location?: LatLngTuple;
  radius?: number;
}

// Helper function to calculate distance between two coordinates
function calculateDistance(point1: LatLngTuple, point2: LatLngTuple): number {
  const R = 6371; // Earth's radius in km
  const dLat = (point2[0] - point1[0]) * Math.PI / 180;
  const dLng = (point2[1] - point1[1]) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(point1[0] * Math.PI / 180) * Math.cos(point2[0] * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export const searchCaterers = (params: SearchParams) => {
  let results = [...mockCaterers];
  
  // Filter by search query
  if (params.query && params.query.trim() !== '') {
    const query = params.query.toLowerCase();
    results = results.filter(caterer => {
      return caterer.name.toLowerCase().includes(query) || 
             caterer.description.toLowerCase().includes(query) ||
             caterer.cuisineTypes.some(cuisine => cuisine.toLowerCase().includes(query)) ||
             (caterer.cuisineTags && caterer.cuisineTags.some(tag => tag.toLowerCase().includes(query)));
    });
  }
  
  // Filter by cuisine
  if (params.cuisine && params.cuisine.trim() !== '') {
    const cuisine = params.cuisine.toLowerCase();
    results = results.filter(caterer => {
      return caterer.cuisineTypes.some(type => type.toLowerCase() === cuisine);
    });
  }
  
  // Filter by location and radius
  if (params.location && params.radius) {
    results = results.filter(caterer => {
      if (!caterer.location) return false;
      
      const distance = calculateDistance(
        params.location as LatLngTuple,
        [caterer.location.lat, caterer.location.lng]
      );
      
      // Add distance property for sorting
      caterer.distance = distance;
      
      return distance <= (params.radius || 5);
    });
    
    // Sort by distance
    results.sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }
  
  // Filter for delivery only
  if (params.deliveryOnly) {
    results = results.filter(caterer => caterer.canDeliver);
  }
  
  return results;
};
