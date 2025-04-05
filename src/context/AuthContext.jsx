
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { toast } from '@/components/ui/use-toast';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if token exists in localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        // Verify token with backend
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Authentication error:', error);
        // Clear invalid token
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (username, password) => {
    try {
      const response = await authService.login(username, password);
      
      // Store the token in localStorage
      localStorage.setItem('token', response.token);
      
      // Set the user in context
      setUser(response.user);
      
      // Redirect to dashboard
      navigate('/dashboard');
      
      toast({
        title: 'Login successful',
        description: `Welcome back, ${response.user.name}!`,
      });
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      
      toast({
        title: 'Login failed',
        description: error.response?.data?.message || 'Invalid username or password',
        variant: 'destructive',
      });
      
      return false;
    }
  };

  // Logout function
  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Clear user from context
    setUser(null);
    
    // Redirect to login page
    navigate('/login');
    
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully.',
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
