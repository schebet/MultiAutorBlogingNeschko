import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { mockUsers } from '../data/mockData';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real application, this would make an API call
    const foundUser = mockUsers.find(u => u.email === email && u.isActive);
    
    // Check for super admin with special password
    if (foundUser && foundUser.email === 'djoricnenad@gmail.com' && password === '1Flasicradule!') {
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    // Check for other users with default password
    else if (foundUser && password === 'admin123') {
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  const canEdit = (postId: string): boolean => {
    if (!user) return false;
    return user.role === 'super_admin' || user.role === 'editor';
  };

  const canModerate = (): boolean => {
    if (!user) return false;
    return user.role === 'super_admin' || user.role === 'editor';
  };

  const canAdmin = (): boolean => {
    if (!user) return false;
    return user.role === 'super_admin';
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated,
    canEdit,
    canModerate,
    canAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};