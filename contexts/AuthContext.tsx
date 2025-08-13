import { auth } from '@/lib/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUserWithEmailAndPassword, signOut as fbSignOut, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type AuthContextValue = {
  isAuthenticated: boolean;
  isLoading: boolean;
  userEmail?: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  register: (email: string, password: string, displayName?: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AUTH_EMAIL_KEY = 'sahabatdarurat_auth_email';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      // Hanya set authenticated jika user benar-benar ada dan valid
      if (user && user.emailVerified !== false) {
        setIsAuthenticated(true);
        setUserEmail(user.email ?? null);
        await AsyncStorage.setItem(AUTH_EMAIL_KEY, user.email ?? '');
      } else {
        setIsAuthenticated(false);
        setUserEmail(null);
        await AsyncStorage.removeItem(AUTH_EMAIL_KEY);
      }
      setIsLoading(false);
    });
    return unsub;
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      // Logout dari Firebase
      await fbSignOut(auth);
      // Hapus data dari AsyncStorage
      await AsyncStorage.removeItem(AUTH_EMAIL_KEY);
      // Reset state lokal
      setIsAuthenticated(false);
      setUserEmail(null);
    } catch (error) {
      console.error('Error during sign out:', error);
      // Tetap reset state meskipun ada error
      setIsAuthenticated(false);
      setUserEmail(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string, displayName?: string) => {
    setIsLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        await updateProfile(cred.user, { displayName });
      }
      // Kembali ke state belum login setelah registrasi
      await fbSignOut(auth);
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
    register,
  }), [isAuthenticated, isLoading, userEmail, signIn, signOut, register]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth harus dipakai di dalam AuthProvider');
  }
  return ctx;
};


