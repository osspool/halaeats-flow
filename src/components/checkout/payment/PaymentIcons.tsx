
import React from 'react';
import { CreditCard, DollarSign, Ban } from 'lucide-react';

// Create custom components for the missing icons
export const PaypalIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    width={props.width || 24}
    height={props.height || 24}
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M7 11c.33-.33.67-.67 1-1h8c1.33 0 2.67 0 4 1 0 3.67-1 5.33-1 5.33H16c-.67 0-1-.33-1-1v-1c0-1.33.67-2 2-2" />
    <path d="M13.47 7.11C13.02 6.38 12.29 6 11.5 6h-6c-.55 0-1.07.23-1.4.64A2 2 0 0 0 4 8.5V14c0 .17.05.33.13.47c.08.14.2.26.33.34c.267.13.57.13.8.06c.23-.08.43-.23.54-.47c.33-.7 1-1.4 2.2-1.4h4c1 0 2 1 2 2c0 1.33-1 2-2 2h-1c-.5 0-1-.33-1-1" />
  </svg>
);

export const BankIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    width={props.width || 24}
    height={props.height || 24}
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={props.className}
  >
    <rect x="3" y="8" width="18" height="12" rx="2" />
    <rect x="6" y="12" width="12" height="4" />
    <path d="M12 4L4 8L12 12L20 8L12 4Z" />
  </svg>
);

export const AppleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    width={props.width || 24}
    height={props.height || 24}
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M12 20.94c1.5 0 2.75-.58 3.94-1.5 1.24-.97 2.16-2.27 2.38-3.94.36-2.75-1.35-5.74-3.82-6.5.38 1.25.38 2.5 0 3.75-.33 1.05-.9 1.97-1.76 2.69-1.07.97-2.44 1.44-3.74 1.5-1.67.07-3.25-.62-4.35-1.85 1.65 3.5 4.85 5.85 7.35 5.85Z" />
    <path d="M9.85 7.5c0-1.06.7-2.02 1.6-2.66.72-.5 1.48-.84 2.3-.84.26 0 .52.03.77.1-.96.88-1.72 1.85-2.23 2.9-.5 1-.75 2.02-.75 3 0 .71.14 1.4.38 2.06.24.6.56 1.17.98 1.7-.72.24-1.46.38-2.22.38-3.6 0-6.36-2.76-6.36-6.36 0-3.5 2.85-6.24 6.14-6.36-.2.87-.31 1.78-.31 2.69 0 .9.2 1.83.61 2.69 0-.75.21-1.46.6-2.1.37-.62.87-1.17 1.49-1.6-.66-.4-1.43-.63-2.23-.63-.23 0-.46.02-.69.05C9.96 3.59 9.85 5.52 9.85 7.5Z" />
  </svg>
);

export const GooglePayIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    width={props.width || 24}
    height={props.height || 24}
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M21 12c0-2.76-2.24-5-5-5h-7c-2.76 0-5 2.24-5 5s2.24 5 5 5h7c2.76 0 5-2.24 5-5z" />
    <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <path d="M3 12h3m12 0h3" />
  </svg>
);
