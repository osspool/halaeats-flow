
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { featuredDishes } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const PopularDishes = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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

  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5); // 5px buffer
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScroll);
      // Initial check
      checkScroll();
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', checkScroll);
      }
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.6; // Scroll 60% of the visible width
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section 
      ref={sectionRef}
      className={cn(
        "py-16 bg-halaeats-50 section-animate",
        isVisible && "visible"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <span className="inline-block text-primary font-medium mb-2">Delicious</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold">Popular Dishes</h2>
            <p className="mt-3 text-halaeats-600 max-w-xl">
              Explore our most loved dishes from various caterers, available for delivery on your preferred date.
            </p>
          </div>
          <div className="flex items-center mt-4 md:mt-0 space-x-3">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full"
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full"
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
            <Link to="/dishes">
              <Button variant="outline" className="ml-3 group">
                View All
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>

        <div 
          ref={scrollContainerRef}
          className="flex space-x-5 overflow-x-auto pb-8 scrollbar-hide" 
          style={{ scrollbarWidth: 'none' }}
        >
          {featuredDishes.map((dish, index) => (
            <div 
              key={dish.id}
              className="flex-shrink-0 w-full max-w-xs bg-white rounded-xl overflow-hidden shadow-elevation-soft hover-lift transition-gpu"
              style={{ 
                animationDelay: `${index * 150}ms`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.5s ease-out ${index * 150}ms, transform 0.5s ease-out ${index * 150}ms`
              }}
            >
              {/* Image */}
              <div className="h-48 relative">
                <img 
                  src={dish.image} 
                  alt={dish.name} 
                  className="w-full h-full object-cover"
                />
                
                {/* Category Badge */}
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/80 backdrop-blur-sm text-halaeats-800">
                    {dish.category}
                  </span>
                </div>
                
                {/* Caterer Badge */}
                <div className="absolute bottom-4 left-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/80 backdrop-blur-sm text-white">
                    By {dish.catererName}
                  </span>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-medium text-halaeats-900">{dish.name}</h3>
                  <p className="font-medium text-primary">${dish.price.toFixed(2)}</p>
                </div>
                
                <p className="mt-2 text-sm text-halaeats-600 line-clamp-2">
                  {dish.description}
                </p>
                
                <div className="mt-3 flex flex-wrap gap-1">
                  {dish.dietary.map(tag => (
                    <span 
                      key={tag} 
                      className="inline-block bg-halaeats-50 text-halaeats-700 text-xs px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="mt-5 pt-4 border-t border-halaeats-100 flex justify-between items-center">
                  <span className="text-sm text-halaeats-500">
                    Available on {dish.availableDates.length} days
                  </span>
                  <Link 
                    to={`/dish/${dish.id}`} 
                    className="text-primary hover:text-cuisine-600 text-sm font-medium flex items-center"
                  >
                    View Details
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

export default PopularDishes;
