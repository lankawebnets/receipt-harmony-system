
import React, { createContext, useState, useContext, useEffect } from 'react';
import { USERS, ROLES } from '../lib/constants';
import { toast } from '@/components/ui/use-toast';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in from localStorage on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (username, password) => {
    // In a real app, this would be an API call
    const foundUser = USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      toast({
        title: 'Logged in successfully',
        description: `Welcome, ${foundUser.name}!`,
      });
      return true;
    } else {
      toast({
        title: 'Login failed',
        description: 'Invalid username or password',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully',
    });
  };

  // Check if user has a specific role
  const hasRole = (role) => {
    if (!user) return false;
    return user.role === role;
  };

  // Check if user is Super Admin
  const isSuperAdmin = () => hasRole(ROLES.SUPER_ADMIN);
  
  // Check if user is Manager
  const isManager = () => hasRole(ROLES.MANAGER);
  
  // Check if user is Data Entry Operator
  const isDataEntry = () => hasRole(ROLES.DATA_ENTRY);

  // Check if user can manage institutions and receipt types
  const canManageInstitutions = () => isSuperAdmin() || isManager();

  // Check if user can manage users
  const canManageUsers = () => isSuperAdmin();

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isSuperAdmin,
        isManager,
        isDataEntry,
        canManageInstitutions,
        canManageUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
