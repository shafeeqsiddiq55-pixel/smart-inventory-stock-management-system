import React, { createContext, useContext, useState, useCallback } from 'react';

interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  role: 'customer' | 'admin';
  status: 'active' | 'blocked';
  createdAt: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  updateUser: (user: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthState | null>(null);

function getStoredAuth() {
  try {
    const token = localStorage.getItem('fruit_shop_token');
    const userStr = localStorage.getItem('fruit_shop_user');
    const user: AuthUser | null = userStr ? JSON.parse(userStr) : null;
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const stored = getStoredAuth();
  const [user, setUser] = useState<AuthUser | null>(stored.user);
  const [token, setToken] = useState<string | null>(stored.token);

  const login = useCallback((newToken: string, newUser: AuthUser) => {
    localStorage.setItem('fruit_shop_token', newToken);
    localStorage.setItem('fruit_shop_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('fruit_shop_token');
    localStorage.removeItem('fruit_shop_user');
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((updates: Partial<AuthUser>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      localStorage.setItem('fruit_shop_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!token && !!user,
      isAdmin: user?.role === 'admin',
      login,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
