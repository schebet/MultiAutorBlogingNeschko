import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { getRegisteredAuthors } from '../data/authors';

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
    // Get fresh user data from storage
    const allUsers = getRegisteredAuthors();
    console.log('All users during login:', allUsers.map(u => ({ email: u.email, name: u.name, active: u.isActive })));
    console.log('Trying to login with:', email, password);
    
    const foundUser = allUsers.find(u => u.email === email && u.isActive);
    console.log('Found user:', foundUser);
    
    // Check for super admin with special password
    if (foundUser && foundUser.email === 'djoricnenad@gmail.com' && password === '1Flasicradule!') {
      console.log('Super admin login successful');
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    // Check for other users with default password
    else if (foundUser && password === 'admin123') {
      console.log('Regular user login successful');
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    console.log('Login failed - user not found or wrong password');
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