
import React from 'react';
import Header from './Header';
import { Toaster } from '@/components/ui/toaster';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <footer className="py-6 bg-secondary">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          Home Renovation Tracker &copy; {new Date().getFullYear()}
        </div>
      </footer>
      <Toaster />
    </div>
  );
};

export default Layout;
