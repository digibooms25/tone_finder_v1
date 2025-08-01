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
  deleteAccount: () => Promise<void>;
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
      
      if (error) {
        if (error.message === 'Email not confirmed') {
          throw new Error('Please check your email and confirm your account before signing in.');
        }
        throw error;
      }
      
      if (data.user) {
        set({ 
          user: { 
            id: data.user.id, 
            email: data.user.email || '',
            email_confirmed_at: data.user.email_confirmed_at
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
            email_confirmed_at: data.user.email_confirmed_at
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
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        await supabase.auth.signOut();
        set({ user: null, error: null });
        return;
      }

      if (!session) {
        set({ user: null, error: null });
        return;
      }

      set({ 
        user: { 
          id: session.user.id, 
          email: session.user.email || '',
          email_confirmed_at: session.user.email_confirmed_at
        },
        error: null
      });
      
    } catch (error) {
      console.error('Session check error:', error);
      set({ 
        user: null, 
        error: 'Session verification failed. Please sign in again.'
      });
    } finally {
      set({ loading: false });
    }
  },

  deleteAccount: async () => {
    try {
      set({ loading: true, error: null });
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session found');
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-user`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete account');
      }

      set({ user: null, error: null });
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));