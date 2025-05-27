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
          } 
        });
      }
    } catch (error) {
      set({ error: (error as Error).message });
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
          } 
        });
      }
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  
  signOut: async () => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  
  checkSession: async () => {
    try {
      set({ loading: true, error: null });
      const { data } = await supabase.auth.getSession();
      
      if (data.session?.user) {
        set({ 
          user: { 
            id: data.session.user.id, 
            email: data.session.user.email || '',
          } 
        });
      } else {
        set({ user: null });
      }
    } catch (error) {
      set({ error: (error as Error).message, user: null });
    } finally {
      set({ loading: false });
    }
  },
}));