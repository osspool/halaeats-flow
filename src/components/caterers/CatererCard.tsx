
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Truck, Star } from 'lucide-react';
import { Caterer } from '@/types';
import { Badge } from '@/components/ui/badge';

interface CatererCardProps {
  caterer: Caterer;
}

const CatererCard: React.FC<CatererCardProps> = ({ caterer }) => {
  // Prepare cuisine tags (limit to 3)
  const cuisineTags = caterer.cuisine.slice(0, 3);
  const hasMoreCuisines = caterer.cuisine.length > 3;

  return (
    <Link 
      to={`/caterer/${caterer.id}`}
      className="group block rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
    >
      <div className="relative">
        <img 
          src={caterer.coverImage} 
          alt={caterer.name} 
          className="w-full h-48 object-cover transition-transform group-hover:scale-105 duration-300"
        />
        {!caterer.isOpen && (
          <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center">
            <Badge variant="destructive" className="text-lg py-1.5 px-3">
              Currently Closed
            </Badge>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{caterer.rating.toFixed(1)}</span>
            <span className="text-gray-500 text-xs">({caterer.reviewCount})</span>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
            {caterer.name}
          </h3>
          <img 
            src={caterer.profileImage} 
            alt={`${caterer.name} logo`}
            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
          />
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {cuisineTags.map((cuisine, index) => (
            <Badge key={index} variant="secondary" className="bg-gray-100 hover:bg-gray-200 text-gray-700">
              {cuisine}
            </Badge>
          ))}
          {hasMoreCuisines && (
            <Badge variant="outline" className="text-gray-500">
              +{caterer.cuisine.length - 3} more
            </Badge>
          )}
        </div>
        
        <div className="text-sm text-gray-500 line-clamp-2 mb-3">
          {caterer.description}
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-gray-700">
            <Clock className="w-4 h-4" />
            <span>{caterer.preparationTime}</span>
          </div>
          
          <div className="flex items-center gap-1 text-gray-700">
            <Truck className="w-4 h-4" />
            <span>
              {caterer.deliveryFee === 0 
                ? 'Free delivery' 
                : `$${caterer.deliveryFee.toFixed(2)} delivery`}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CatererCard;
