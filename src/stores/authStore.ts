import { create } from 'zustand';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { createUserDocument } from '../utils/userHelpers';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  dateOfBirth: Date;
  totalPoints: number;
  createdAt: Date;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Omit<User, 'id' | 'totalPoints' | 'createdAt'>, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Fetch user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const user: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          name: userData.name,
          avatar: userData.avatar,
          dateOfBirth: userData.dateOfBirth.toDate(),
          totalPoints: userData.totalPoints || 0,
          createdAt: userData.createdAt.toDate(),
        };
        
        set({ 
          user, 
          isAuthenticated: true, 
          isLoading: false 
        });
      } else {
        // User exists in Auth but not in Firestore - create a basic user document
        const user = await createUserDocument(firebaseUser);
        
        set({ 
          user, 
          isAuthenticated: true, 
          isLoading: false 
        });
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (userData, password) => {
    set({ isLoading: true });
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, password);
      const firebaseUser = userCredential.user;
      
      // Create user document in Firestore
      const user = await createUserDocument(firebaseUser, userData);
      
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    await signOut(auth);
    set({ 
      user: null, 
      isAuthenticated: false, 
      isLoading: false 
    });
  },

  setUser: (user) => {
    set({ 
      user, 
      isAuthenticated: !!user, 
      isLoading: false 
    });
  },

  initializeAuth: () => {
    set({ isLoading: true });
    
    onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const user: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email!,
              name: userData.name,
              avatar: userData.avatar,
              dateOfBirth: userData.dateOfBirth.toDate(),
              totalPoints: userData.totalPoints || 0,
              createdAt: userData.createdAt.toDate(),
            };
            
            set({ 
              user, 
              isAuthenticated: true, 
              isLoading: false 
            });
          } else {
            // User exists in Auth but not in Firestore - create a basic user document
            const user = await createUserDocument(firebaseUser);

            set({ 
              user, 
              isAuthenticated: true, 
              isLoading: false 
            });
          }
        } catch {
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
          });
        }
      } else {
        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false 
        });
      }
    });
  },
}));