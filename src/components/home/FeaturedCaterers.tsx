
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, MapPin, Star } from 'lucide-react';
import { featuredCaterers } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const FeaturedCaterers = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className={cn(
        "py-16 bg-white section-animate",
        isVisible && "visible"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <span className="inline-block text-primary font-medium mb-2">Explore</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold">Featured Caterers</h2>
            <p className="mt-3 text-halaeats-600 max-w-xl">
              Discover talented home chefs in your area offering unique and delicious menus for your next gathering.
            </p>
          </div>
          <Link to="/caterers" className="mt-4 md:mt-0">
            <Button variant="outline" className="group">
              View All Caterers
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCaterers.map((caterer, index) => (
            <div 
              key={caterer.id}
              className={cn(
                "bg-white rounded-xl overflow-hidden shadow-elevation-soft hover-lift transition-gpu",
                "will-change-transform"
              )}
              style={{ 
                animationDelay: `${index * 150}ms`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.5s ease-out ${index * 150}ms, transform 0.5s ease-out ${index * 150}ms`
              }}
            >
              {/* Cover Image */}
              <div className="h-48 w-full relative">
                <img 
                  src={caterer.coverImage} 
                  alt={caterer.name} 
                  className="w-full h-full object-cover"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                
                {/* Profile Image */}
                <div className="absolute -bottom-10 left-5 w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-white shadow-sm">
                  <img 
                    src={caterer.profileImage} 
                    alt={caterer.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className={cn(
                    "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
                    caterer.isOpen 
                      ? "bg-green-100 text-green-800" 
                      : "bg-halaeats-100 text-halaeats-600"
                  )}>
                    {caterer.isOpen ? 'Open Now' : 'Closed'}
                  </span>
                </div>
              </div>
              
              {/* Content */}
              <div className="pt-12 px-5 pb-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-medium text-halaeats-900">{caterer.name}</h3>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium">{caterer.rating}</span>
                      <span className="ml-1 text-sm text-halaeats-500">({caterer.reviewCount} reviews)</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
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
                
                <p className="mt-3 text-sm text-halaeats-600 line-clamp-2">
                  {caterer.description}
                </p>
                
                <div className="flex items-center mt-4 text-sm text-halaeats-600 space-x-4">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-primary mr-1" />
                    <span>{caterer.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-primary mr-1" />
                    <span>{caterer.preparationTime}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-halaeats-100">
                  <div>
                    <p className="text-xs text-halaeats-500">Minimum order</p>
                    <p className="font-medium">${caterer.minimumOrder}</p>
                  </div>
                  <div>
                    <p className="text-xs text-halaeats-500">Delivery fee</p>
                    <p className="font-medium">${caterer.deliveryFee.toFixed(2)}</p>
                  </div>
                  <Link 
                    to={`/caterer/${caterer.id}`} 
                    className="text-primary hover:text-cuisine-600 text-sm font-medium flex items-center"
                  >
                    View Menu
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCaterers;
