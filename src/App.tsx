
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Import pages
import Index from "./pages/Index";
import CatererPage from "./pages/CatererPage";
import DishPage from "./pages/DishPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import NotFound from "./pages/NotFound";

// Create QueryClient
const queryClient = new QueryClient();

// Page transition settings
const pageVariants = {
  initial: {
    opacity: 0,
    y: 5,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -5,
  },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.3,
};

// Wrap page components with motion for transitions
const AnimatedRoutes = () => (
  <AnimatePresence mode="wait">
    <Routes>
      <Route 
        path="/" 
        element={
          <motion.div
            key="home"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Index />
          </motion.div>
        } 
      />
      <Route 
        path="/caterer/:id" 
        element={
          <motion.div
            key="caterer"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <CatererPage />
          </motion.div>
        } 
      />
      <Route 
        path="/dish/:id" 
        element={
          <motion.div
            key="dish"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <DishPage />
          </motion.div>
        } 
      />
      <Route 
        path="/cart" 
        element={
          <motion.div
            key="cart"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <CartPage />
          </motion.div>
        } 
      />
      <Route 
        path="/checkout" 
        element={
          <motion.div
            key="checkout"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <CheckoutPage />
          </motion.div>
        } 
      />
      <Route 
        path="*" 
        element={
          <motion.div
            key="notfound"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <NotFound />
          </motion.div>
        } 
      />
    </Routes>
  </AnimatePresence>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
