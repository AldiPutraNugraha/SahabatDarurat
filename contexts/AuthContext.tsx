import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextValue = {
  isAuthenticated: boolean;
  isLoading: boolean;
  userEmail?: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AUTH_STORAGE_KEY = 'sahabatdarurat_auth_token';
const AUTH_EMAIL_KEY = 'sahabatdarurat_auth_email';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const restoreAuth = async () => {
      try {
        const [token, email] = await Promise.all([
          AsyncStorage.getItem(AUTH_STORAGE_KEY),
          AsyncStorage.getItem(AUTH_EMAIL_KEY),
        ]);
        setIsAuthenticated(!!token);
        setUserEmail(email);
      } finally {
        setIsLoading(false);
      }
    };
    restoreAuth();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Placeholder login: asalkan ada email & password, anggap valid
      if (!email || !password) {
        throw new Error('Email dan password wajib diisi');
      }
      // Simulasi delay jaringan
      await new Promise((resolve) => setTimeout(resolve, 400));
      const fakeToken = 'local_token_ok';
      await AsyncStorage.multiSet([
        [AUTH_STORAGE_KEY, fakeToken],
        [AUTH_EMAIL_KEY, email],
      ]);
      setUserEmail(email);
      setIsAuthenticated(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.multiRemove([AUTH_STORAGE_KEY, AUTH_EMAIL_KEY]);
      setUserEmail(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    isAuthenticated,
    isLoading,
    userEmail,
    signIn,
    signOut,
  }), [isAuthenticated, isLoading, userEmail, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth harus dipakai di dalam AuthProvider');
  }
  return ctx;
};


