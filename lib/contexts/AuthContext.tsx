'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import { STATIC_CREDENTIALS, STORAGE_KEYS } from '@/lib/config/adConfig';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const authState = localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);
      setIsAuthenticated(authState === 'true');
    }
    setIsLoading(false);
  }, []);

  const login = (username: string, password: string): boolean => {
    if (username === STATIC_CREDENTIALS.username && password === STATIC_CREDENTIALS.password) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
