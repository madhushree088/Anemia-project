import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { auth, db, isFirebaseEnabled } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
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

  useEffect(() => {
    if (isFirebaseEnabled && auth) {
      // Firebase authentication
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          // Get additional user data from Firestore
          try {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            const userData = userDoc.data();
            
            const user: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: userData?.name || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
              createdAt: userData?.createdAt || new Date().toISOString(),
            };
            
            setUser(user);
            // Also store in localStorage for offline access
            localStorage.setItem('user', JSON.stringify(user));
          } catch (error) {
            console.error('Error fetching user data:', error);
            // Fallback to Firebase user data only
            const user: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
              createdAt: new Date().toISOString(),
            };
            setUser(user);
          }
        } else {
          setUser(null);
          localStorage.removeItem('user');
        }
        setIsLoading(false);
      });
      
      return () => unsubscribe();
    } else {
      // Fallback to localStorage for development/when Firebase is not configured
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      if (isFirebaseEnabled && auth) {
        // Firebase authentication
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('Firebase login successful for:', userCredential.user.email);
        setIsLoading(false);
        return true;
      } else {
        // Fallback mock authentication for development
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (email && password.length >= 6) {
          const mockUser: User = {
            id: 'demo-user-' + Date.now(),
            email,
            name: email.split('@')[0],
            createdAt: new Date().toISOString(),
          };
          
          setUser(mockUser);
          localStorage.setItem('user', JSON.stringify(mockUser));
          setIsLoading(false);
          return true;
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      if (isFirebaseEnabled && auth && db) {
        // Firebase registration
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        
        // Create user document in Firestore
        const userData = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: name,
          createdAt: new Date().toISOString(),
        };
        
        await setDoc(doc(db, 'users', firebaseUser.uid), userData);
        console.log('User registered and saved to Firestore:', userData);
        
        setIsLoading(false);
        return true;
      } else {
        // Fallback mock registration for development
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (email && password.length >= 6 && name) {
          const mockUser: User = {
            id: 'demo-user-' + Date.now(),
            email,
            name,
            createdAt: new Date().toISOString(),
          };
          
          setUser(mockUser);
          localStorage.setItem('user', JSON.stringify(mockUser));
          setIsLoading(false);
          return true;
        }
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setIsLoading(false);
      return false;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = async () => {
    try {
      if (isFirebaseEnabled && auth) {
        await signOut(auth);
        console.log('Firebase logout successful');
      }
      setUser(null);
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if Firebase logout fails
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};