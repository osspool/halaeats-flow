
import { useState } from 'react';
import { MapPin, Clock, Star, Calendar, Truck, ChevronDown, Users } from 'lucide-react';
import { Caterer } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CatererProfileProps {
  caterer: Caterer;
}

const CatererProfile = ({ caterer }: CatererProfileProps) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  
  return (
    <div className="w-full">
      {/* Cover Image */}
      <div className="h-48 sm:h-64 md:h-80 w-full relative">
        <img 
          src={caterer.coverImage} 
          alt={`${caterer.name} cover`} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>
      
      {/* Profile Section */}
      <div className="container mx-auto px-4 relative">
        <div className="bg-white rounded-xl shadow-elevation-soft -mt-20 relative z-10 p-6 md:p-8">
          <div className="flex flex-col md:flex-row">
            {/* Profile Image and Basics */}
            <div className="flex items-start mb-6 md:mb-0">
              <div className="w-24 h-24 rounded-xl border-4 border-white overflow-hidden bg-white shadow-sm mr-4 md:mr-6">
                <img 
                  src={caterer.profileImage} 
                  alt={caterer.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div>
                <div className="flex items-center">
                  <h1 className="text-2xl md:text-3xl font-serif font-bold">{caterer.name}</h1>
                  <span className={cn(
                    "ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                    caterer.isOpen 
                      ? "bg-green-100 text-green-800" 
                      : "bg-halaeats-100 text-halaeats-600"
                  )}>
                    {caterer.isOpen ? 'Open Now' : 'Closed'}
                  </span>
                </div>
                
                <div className="flex items-center mt-2 text-sm text-halaeats-600 space-x-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="font-medium">{caterer.rating}</span>
                    <span className="ml-1">({caterer.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-primary mr-1" />
                    <span>{caterer.location}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mt-3">
                  {caterer.cuisine.map(cuisine => (
                    <span 
                      key={cuisine} 
                      className="inline-block bg-halaeats-50 text-halaeats-700 text-xs px-2 py-0.5 rounded"
                    >
                      {cuisine}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Action Buttons - Desktop */}
            <div className="hidden md:flex items-start ml-auto space-x-3">
              <Button variant="outline" className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                Check Availability
              </Button>
              <Button className="bg-primary hover:bg-cuisine-600 transition-gpu">
                Contact Caterer
              </Button>
            </div>
          </div>
          
          {/* Action Buttons - Mobile */}
          <div className="flex md:hidden items-center justify-between mt-6 space-x-3">
            <Button variant="outline" className="flex-1 flex items-center justify-center">
              <Calendar className="mr-2 h-4 w-4" />
              Check Availability
            </Button>
            <Button className="flex-1 bg-primary hover:bg-cuisine-600 transition-gpu">
              Contact
            </Button>
          </div>
          
          {/* Divider */}
          <div className="border-t border-halaeats-100 my-6"></div>
          
          {/* Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-halaeats-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-halaeats-700">Prep Time</p>
                  <p className="text-sm text-halaeats-900 font-medium">{caterer.preparationTime}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-halaeats-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-halaeats-700">Delivery Fee</p>
                  <p className="text-sm text-halaeats-900 font-medium">${caterer.deliveryFee.toFixed(2)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-halaeats-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-halaeats-700">Min. Order</p>
                  <p className="text-sm text-halaeats-900 font-medium">${caterer.minimumOrder.toFixed(2)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-halaeats-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-halaeats-700">Available</p>
                  <p className="text-sm text-halaeats-900 font-medium">Next 7 Days</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">About {caterer.name}</h3>
            <div className={cn(
              "text-halaeats-600 relative",
              !showFullDescription && "max-h-20 overflow-hidden"
            )}>
              <p>{caterer.description}</p>
              {!showFullDescription && (
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent"></div>
              )}
            </div>
            <button 
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="mt-2 text-primary flex items-center text-sm font-medium hover:text-cuisine-600 transition-colors"
            >
              {showFullDescription ? 'Show Less' : 'Read More'}
              <ChevronDown className={cn(
                "ml-1 h-4 w-4 transition-transform",
                showFullDescription && "rotate-180"
              )} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatererProfile;
