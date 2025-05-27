import { create } from 'zustand';
import { supabase, User } from '../lib/supabase';

type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkSession: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,
  
  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        set({ 
          user: { 
            id: data.user.id, 
            email: data.user.email || '',
          },
          error: null 
        });
      }
    } catch (error) {
      set({ error: (error as Error).message, user: null });
    } finally {
      set({ loading: false });
    }
  },
  
  signUp: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        set({ 
          user: { 
            id: data.user.id, 
            email: data.user.email || '',
          },
          error: null
        });
      }
    } catch (error) {
      set({ error: (error as Error).message, user: null });
    } finally {
      set({ loading: false });
    }
  },
  
  signOut: async () => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, error: null });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  
  checkSession: async () => {
    try {
      set({ loading: true, error: null });
      
      // First try to get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        // If there's an error getting the session, clear the state
        set({ user: null, error: null });
        return;
      }

      if (!session) {
        // No session found, clear the state
        set({ user: null, error: null });
        return;
      }

      // Valid session exists
      set({ 
        user: { 
          id: session.user.id, 
          email: session.user.email || '',
        },
        error: null
      });
      
    } catch (error) {
      // Handle any unexpected errors by clearing the state
      console.error('Session check error:', error);
      set({ 
        user: null, 
        error: 'Session verification failed. Please sign in again.'
      });
    } finally {
      set({ loading: false });
    }
  },
}));