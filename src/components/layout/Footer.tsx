
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-halaeats-100 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand and Description */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-serif font-bold text-primary">
                Hala<span className="text-halaeats-800">Eats</span>
              </span>
            </Link>
            <p className="mt-4 text-halaeats-600 text-sm">
              Connecting you with the best home caterers in your area. Enjoy authentic, home-cooked meals delivered to your doorstep.
            </p>
            <div className="mt-6 flex space-x-4">
              <a 
                href="#" 
                className="text-halaeats-400 hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="#" 
                className="text-halaeats-400 hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="#" 
                className="text-halaeats-400 hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-halaeats-800 font-medium text-base mb-4">For Customers</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/how-it-works" className="text-halaeats-600 hover:text-primary text-sm transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-halaeats-600 hover:text-primary text-sm transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-halaeats-600 hover:text-primary text-sm transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-halaeats-600 hover:text-primary text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-halaeats-600 hover:text-primary text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Become a Caterer */}
          <div className="col-span-1">
            <h3 className="text-halaeats-800 font-medium text-base mb-4">For Caterers</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/become-a-caterer" className="text-halaeats-600 hover:text-primary text-sm transition-colors">
                  Join as a Caterer
                </Link>
              </li>
              <li>
                <Link to="/caterer-guidelines" className="text-halaeats-600 hover:text-primary text-sm transition-colors">
                  Food Safety Guidelines
                </Link>
              </li>
              <li>
                <Link to="/caterer-faq" className="text-halaeats-600 hover:text-primary text-sm transition-colors">
                  Caterer FAQs
                </Link>
              </li>
              <li>
                <Link to="/success-stories" className="text-halaeats-600 hover:text-primary text-sm transition-colors">
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-1">
            <h3 className="text-halaeats-800 font-medium text-base mb-4">Stay Updated</h3>
            <p className="text-halaeats-600 text-sm mb-4">
              Subscribe to our newsletter for the latest dishes and special offers.
            </p>
            <form className="flex flex-col space-y-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-2 rounded-md bg-halaeats-50 border border-halaeats-100 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
                required
              />
              <button 
                type="submit"
                className="bg-primary hover:bg-cuisine-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom section with copyright */}
        <div className="mt-12 pt-6 border-t border-halaeats-100 text-center text-halaeats-500 text-sm">
          <p>© {new Date().getFullYear()} HalaEats. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
