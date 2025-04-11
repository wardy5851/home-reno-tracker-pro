
import React from 'react';
import { Home, PieChart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  
  return (
    <header className="bg-primary text-primary-foreground p-4 sticky top-0 z-10 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Home className="h-6 w-6" />
          <h1 className="text-xl font-bold">Ward Home Improvements</h1>
        </div>
        
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link 
                to="/" 
                className={`flex items-center gap-1 px-3 py-1 rounded-md ${
                  location.pathname === '/' 
                    ? 'bg-primary-foreground/20' 
                    : 'hover:bg-primary-foreground/10'
                }`}
              >
                <Home className="h-4 w-4" />
                <span>Tasks</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/dashboard" 
                className={`flex items-center gap-1 px-3 py-1 rounded-md ${
                  location.pathname === '/dashboard' 
                    ? 'bg-primary-foreground/20' 
                    : 'hover:bg-primary-foreground/10'
                }`}
              >
                <PieChart className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
