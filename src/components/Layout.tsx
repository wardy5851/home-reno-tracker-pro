
import React from 'react';
import Header from './Header';
import { Toaster } from '@/components/ui/toaster';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&q=80" 
          alt="Home improvement background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      
      {/* Content positioned above the background */}
      <div className="relative z-1 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto p-4">
          <div className="bg-white/95 dark:bg-black/80 rounded-lg shadow-lg p-6 backdrop-blur-sm">
            {children}
          </div>
        </main>
        <footer className="py-6 bg-secondary relative z-1">
          <div className="container mx-auto text-center text-sm text-muted-foreground">
            Ward Home Improvements &copy; {new Date().getFullYear()}
          </div>
        </footer>
      </div>
      <Toaster />
    </div>
  );
};

export default Layout;
