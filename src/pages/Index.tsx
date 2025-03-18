
import { useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import FeaturedCaterers from '@/components/home/FeaturedCaterers';
import PopularDishes from '@/components/home/PopularDishes';

const Index = () => {
  // Animation for sections becoming visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Unobserve after animation to save resources
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    // Observe all section-animate elements
    document.querySelectorAll('.section-animate').forEach((el) => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow mt-14">
        <Hero />
        
        <section className="py-16 section-animate">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block text-primary font-medium mb-2">How It Works</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Enjoy Homemade Food in 3 Easy Steps</h2>
              <p className="text-halaeats-600">
                HalaEats connects you with talented home caterers in your area, offering unique and authentic dishes for delivery or pickup on your chosen date.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="relative bg-white rounded-xl p-6 shadow-elevation-soft hover-lift text-center">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div className="mt-6 mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=2071&auto=format&fit=crop" 
                    alt="Browse caterers" 
                    className="h-40 w-40 object-cover rounded-full mx-auto shadow-md"
                  />
                </div>
                <h3 className="text-xl font-medium mb-2">Browse Caterers</h3>
                <p className="text-halaeats-600 text-sm">
                  Explore profiles and menus of local home caterers, filtering by cuisine, availability, and more.
                </p>
              </div>
              
              <div className="relative bg-white rounded-xl p-6 shadow-elevation-soft hover-lift text-center">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div className="mt-6 mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1611599538835-b52a8c2af7fe?q=80&w=1974&auto=format&fit=crop" 
                    alt="Choose date and dishes" 
                    className="h-40 w-40 object-cover rounded-full mx-auto shadow-md"
                  />
                </div>
                <h3 className="text-xl font-medium mb-2">Choose Date & Dishes</h3>
                <p className="text-halaeats-600 text-sm">
                  Select your preferred delivery date and add available dishes to your cart with any customizations.
                </p>
              </div>
              
              <div className="relative bg-white rounded-xl p-6 shadow-elevation-soft hover-lift text-center">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div className="mt-6 mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?q=80&w=1828&auto=format&fit=crop" 
                    alt="Enjoy your meal" 
                    className="h-40 w-40 object-cover rounded-full mx-auto shadow-md"
                  />
                </div>
                <h3 className="text-xl font-medium mb-2">Enjoy Your Meal</h3>
                <p className="text-halaeats-600 text-sm">
                  Receive your freshly prepared food via delivery or pickup on your selected date and time.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <FeaturedCaterers />
        <PopularDishes />
        
        <section className="py-16 section-animate relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cuisine-500 to-primary -z-10 opacity-95"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1170&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20 -z-10"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Ready to Share Your Culinary Passion?</h2>
              <p className="text-white/90 mb-8 text-lg">
                Join HalaEats as a caterer and turn your cooking skills into a thriving business. 
                Set your own menu, prices, and availability. We'll handle the rest.
              </p>
              <button className="bg-white text-primary hover:bg-halaeats-50 transition-colors px-8 py-3 rounded-lg font-medium shadow-elevation-medium">
                Become a Caterer
              </button>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white section-animate">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-block text-primary font-medium mb-2">Testimonials</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">What Our Customers Say</h2>
              <p className="text-halaeats-600">
                Don't just take our word for it. Hear from our happy customers who have experienced the joy of authentic home cooking.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-elevation-soft">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img 
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1160&auto=format&fit=crop" 
                      alt="Customer" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">Ahmed S.</p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400">
                          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-halaeats-600">
                  "The biryani from Spice Delight was absolutely delicious and authentic! Being able to order it for a specific date made planning my dinner party so much easier."
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-elevation-soft">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop" 
                      alt="Customer" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">Sarah M.</p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400">
                          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-halaeats-600">
                  "I love that I can support home cooks in my community while enjoying amazing food. The date-based ordering system is perfect for planning meals ahead of time."
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-elevation-soft">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop" 
                      alt="Customer" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">Michael J.</p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-4 h-4 ${i < 4 ? 'text-yellow-400' : 'text-halaeats-200'}`}>
                          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-halaeats-600">
                  "The quality and taste of the food is outstanding. Being able to order for specific dates is so convenient, especially when I have guests coming over."
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
