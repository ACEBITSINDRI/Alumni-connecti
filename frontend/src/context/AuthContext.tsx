import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { logout as logoutApi } from '../services/auth.service';
import { auth } from '../config/firebase';
import { onAuthStateChanged, setPersistence, browserLocalPersistence } from 'firebase/auth';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'student' | 'alumni' | 'admin';
  profilePicture?: string;
  coverPhoto?: string;
  batch?: string;
  company?: string;
  currentRole?: string;
  phone?: string;
  bio?: string;
  location?: {
    city: string;
    state: string;
    country: string;
  };
  linkedinUrl?: string;
  isVerified: boolean;
  isEmailVerified?: boolean;
  // Additional optional fields used across the app
  department?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  skills?: string[];
  experience?: any[];
  education?: any[];
  mentorshipAvailable?: boolean;
  availableForMentorship?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  checkAuth: () => Promise<void>;
}

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
  const [isLoading, setIsLoading] = useState(true);

  // Enable Firebase persistence and listen to auth state changes
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initAuth = async () => {
      try {
        // Enable Firebase persistence
        await setPersistence(auth, browserLocalPersistence);

        // Listen to Firebase auth state changes
        unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            // User is signed in with Firebase
            // Check if we have user data in localStorage
            const storedUser = localStorage.getItem('user');
            const token = localStorage.getItem('accessToken');

            if (storedUser && token) {
              try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
              } catch (error) {
                console.error('Failed to parse stored user:', error);
                // Clear invalid data
                localStorage.removeItem('user');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                setUser(null);
              }
            } else {
              // Firebase user exists but no localStorage data
              // This can happen after signup, wait for app to set user data
              console.log('Firebase user found, waiting for user data...');
            }
          } else {
            // User is signed out
            setUser(null);
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
          }

          // Auth state resolved, stop loading
          setIsLoading(false);
        });
      } catch (error) {
        console.error('Firebase auth initialization error:', error);
        setIsLoading(false);
      }
    };

    initAuth();

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const checkAuth = async () => {
    // This is now handled by onAuthStateChanged listener
    // Kept for backward compatibility
    const token = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
      }
    }
  };

  const logout = async () => {
    try {
      // Call logout API
      await logoutApi();
    } catch (error) {
      console.error('Logout API failed:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');

      // Clear user state
      setUser(null);

      // Redirect to login page
      window.location.href = '/login';
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      // Update stored user
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    setUser,
    logout,
    updateUser,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
