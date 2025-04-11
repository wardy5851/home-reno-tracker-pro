
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Get stored credentials
      const storedCredentials = localStorage.getItem('app_credentials');
      
      // If no stored credentials but email/password meet basic requirements, 
      // create an admin user (first user setup)
      if (!storedCredentials && email && password.length >= 6) {
        // Create first admin user
        const firstAdminUser = {
          id: '1',
          name: email.split('@')[0],
          email,
          isAdmin: true
        };
        
        // Store user credentials
        const credentials = { [email]: password };
        localStorage.setItem('app_credentials', JSON.stringify(credentials));
        
        // Store user in users list
        const users = [firstAdminUser];
        localStorage.setItem('app_users', JSON.stringify(users));
        
        // Set as logged in user
        localStorage.setItem('user', JSON.stringify(firstAdminUser));
        setUser(firstAdminUser);
        
        toast({
          title: "Welcome to the system",
          description: "You've been set up as the first administrator.",
        });
        
        navigate('/');
        return;
      }
      
      // Regular login flow
      if (storedCredentials) {
        const credentials = JSON.parse(storedCredentials);
        
        // Check if credentials match
        if (credentials[email] === password) {
          // Get user details from users list
          const storedUsers = localStorage.getItem('app_users');
          
          if (storedUsers) {
            const users = JSON.parse(storedUsers);
            const loggedInUser = users.find((u: User) => u.email === email);
            
            if (loggedInUser) {
              // Save user to localStorage
              localStorage.setItem('user', JSON.stringify(loggedInUser));
              setUser(loggedInUser);
              
              toast({
                title: "Login successful",
                description: `Welcome back, ${loggedInUser.name}!`,
              });
              
              navigate('/');
              return;
            }
          }
        }
      }
      
      // If we get here, authentication failed
      throw new Error('Invalid credentials');
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
