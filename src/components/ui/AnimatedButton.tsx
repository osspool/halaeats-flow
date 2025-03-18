
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  hover3d?: boolean;
}

const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, children, variant = 'default', size = 'default', hover3d = false, ...props }, ref) => {
    return (
      <button
        className={cn(
          "relative inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background overflow-hidden",
          // Base styles for all variants
          "transition-all duration-300 transform-gpu",
          // Hover 3D effect
          hover3d && "hover:shadow-elevation-medium active:shadow-elevation-soft hover:-translate-y-0.5 active:translate-y-0",
          // Variants
          variant === 'default' && "bg-primary text-primary-foreground hover:bg-primary/90",
          variant === 'outline' && "border border-input hover:bg-accent hover:text-accent-foreground",
          variant === 'secondary' && "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          variant === 'ghost' && "hover:bg-accent hover:text-accent-foreground",
          // Sizes
          size === 'default' && "h-10 py-2 px-4",
          size === 'sm' && "h-9 px-3 rounded-md",
          size === 'lg' && "h-11 px-8 rounded-md",
          size === 'icon' && "h-10 w-10",
          className
        )}
        ref={ref}
        {...props}
      >
        {/* Optional ripple effect */}
        <span className="absolute inset-0 overflow-hidden rounded-md pointer-events-none ripple-effect"/>
        
        {/* Button content */}
        <span className="flex items-center justify-center relative z-10">
          {children}
        </span>
      </button>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';

export { AnimatedButton };
