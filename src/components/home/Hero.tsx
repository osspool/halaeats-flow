
import { useState } from 'react';
import { Search, MapPin, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Hero = () => {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <section className="relative min-h-[600px] pt-28 pb-20 md:min-h-[700px] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#FFF8F0] to-[#FFECD9]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1547592180-85f173990888?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-[0.03]"></div>
      </div>

      {/* Decorative elements */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute -bottom-10 -right-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
      />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute -top-10 -left-10 w-80 h-80 bg-cuisine-400/5 rounded-full blur-3xl"
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left column: Hero content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-start"
          >
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
              Homemade Delights, Delivered
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight md:leading-tight lg:leading-tight mb-6 text-balance">
              Authentic <span className="text-primary">Home Cooking</span> <br />
              For Every Occasion
            </h1>
            <p className="text-lg text-halaeats-600 mb-8 max-w-lg text-balance">
              Discover talented home caterers in your area. 
              Explore unique menus, choose your delivery date, 
              and enjoy homemade goodness at your convenience.
            </p>

            {/* Search box */}
            <div 
              className={cn(
                "w-full max-w-md bg-white rounded-xl shadow-elevation-soft transition-all duration-300",
                searchFocused ? "shadow-elevation-medium ring-2 ring-primary/20" : ""
              )}
            >
              <div className="flex flex-col p-4">
                <div className="flex items-center border-b border-halaeats-100 pb-3 mb-3">
                  <Search className="h-5 w-5 text-halaeats-400 mr-2 flex-shrink-0" />
                  <input 
                    type="text" 
                    placeholder="Search for dishes or cuisine..." 
                    className="bg-transparent border-none outline-none flex-1 text-halaeats-900 placeholder:text-halaeats-400"
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                  />
                </div>
                <div className="flex flex-wrap gap-3 md:gap-4">
                  <div className="flex items-center text-sm text-halaeats-600">
                    <MapPin className="h-4 w-4 text-primary mr-1" />
                    <span>Current Location</span>
                  </div>
                  <div className="flex items-center text-sm text-halaeats-600">
                    <Calendar className="h-4 w-4 text-primary mr-1" />
                    <span>Delivery: Today</span>
                  </div>
                </div>
              </div>
              <div className="px-4 pb-4">
                <Button className="w-full bg-primary hover:bg-cuisine-600 transition-gpu">
                  Find Caterers
                </Button>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center mt-8 space-x-6">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-halaeats-100 flex items-center justify-center">
                  <span className="text-halaeats-600 font-bold">300+</span>
                </div>
                <span className="ml-2 text-sm text-halaeats-600">Caterers</span>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-halaeats-100 flex items-center justify-center">
                  <span className="text-halaeats-600 font-bold">5K+</span>
                </div>
                <span className="ml-2 text-sm text-halaeats-600">Happy Customers</span>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-halaeats-100 flex items-center justify-center">
                  <span className="text-halaeats-600 font-bold">4.8</span>
                </div>
                <span className="ml-2 text-sm text-halaeats-600">Star Rating</span>
              </div>
            </div>
          </motion.div>

          {/* Right column: Hero image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden md:block"
          >
            <div className="relative z-10">
              <div className="relative w-full h-[480px] rounded-2xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1608835291093-394b0c943a75?q=80&w=1974&auto=format&fit=crop" 
                  alt="Home cooked meal" 
                  className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
                />
              </div>
              
              {/* Floating cards */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="absolute -bottom-6 -left-6 glass-panel p-4 rounded-xl max-w-[260px]"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1160&auto=format&fit=crop" 
                      alt="Food" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-halaeats-900">Biryani Special</p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        Available Today
                      </span>
                    </div>
                    <p className="text-sm text-halaeats-600 mt-1">
                      From Spice Delight
                    </p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="absolute -top-6 -right-6 glass-panel p-4 rounded-xl max-w-[200px]"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-halaeats-900">Schedule Ahead</p>
                    <p className="text-xs text-halaeats-600">
                      Order now for future dates
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
