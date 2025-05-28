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
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
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
      
      // Delete user data first (RLS policies will handle this)
      const { error: deleteError } = await supabase
        .from('tone_profiles')
        .delete()
        .eq('user_id', supabase.auth.getUser());
      
      if (deleteError) throw deleteError;

      // Delete the user account
      const { error } = await supabase.auth.admin.deleteUser(
        (await supabase.auth.getUser()).data.user?.id || ''
      );
      
      if (error) throw error;

      // Clear local state
      set({ user: null, error: null });
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));