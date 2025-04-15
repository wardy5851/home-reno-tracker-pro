import React from 'react';
import { Home, PieChart, LogOut, User, Shield } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  return (
    <header className="bg-primary text-primary-foreground p-4 sticky top-0 z-10 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Home className="h-6 w-6" />
          <h1 className="text-xl font-bold">Ward App</h1>
        </div>
        
        <div className="flex items-center gap-4">
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
              {user?.isAdmin && (
                <li>
                  <Link 
                    to="/admin" 
                    className={`flex items-center gap-1 px-3 py-1 rounded-md ${
                      location.pathname === '/admin' 
                        ? 'bg-primary-foreground/20' 
                        : 'hover:bg-primary-foreground/10'
                    }`}
                  >
                    <Shield className="h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                </li>
              )}
            </ul>
          </nav>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-primary-foreground/10 rounded-md">
              <User className="h-4 w-4" />
              <span className="text-sm">{user?.name}</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={logout}
              className="flex items-center gap-1 hover:bg-primary-foreground/10"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
