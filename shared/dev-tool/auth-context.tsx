'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User, MOCK_ADMIN_USER } from './types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null; 
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop()?.split(';').shift() || '');
  return null;
};

const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
};

const removeCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = () => {
      console.log('[AuthContext] Checking initial auth state');
      const authToken = getCookie('authToken');
      
      if (authToken) {
        console.log('[AuthContext] Found existing auth token, restoring session');
        setUser(MOCK_ADMIN_USER);
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = () => {
    console.log('[AuthContext] Login started');
    setUser(MOCK_ADMIN_USER);
    const mockToken = 'mock-jwt-token-' + Date.now();
    setCookie('authToken', mockToken);
    router.push('/dashboard');
  };

  const logout = () => {
    console.log('[AuthContext] Logout started');
    setUser(null);
    removeCookie('authToken');
    router.push('/');
  };

  // Render loading state if needed
  if (isLoading) {
    return (
      <AuthContext.Provider value={{ user, isLoading, login, logout }}>
        <div>Loading...</div>
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}