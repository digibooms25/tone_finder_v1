import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase, ToneProfile } from '../lib/supabase';
import { generateToneSummary, generateToneExamples } from '../lib/openai';

type ToneState = {
  currentTone: {
    id?: string;
    formality: number;
    brevity: number;
    humor: number;
    warmth: number;
    directness: number;
    expressiveness: number;
    title: string;
    summary: string;
    prompt: string;
    examples: string[];
  };
  savedTones: ToneProfile[];
  loading: boolean;
  error: string | null;
  
  generateSummary: () => Promise<void>;
  generateExamples: () => Promise<void>;
  saveTone: (name: string, userId: string) => Promise<void>;
  loadSavedTones: (userId: string) => Promise<void>;
  deleteTone: (toneId: string) => Promise<void>;
  setCurrentToneTraits: (traits: Partial<typeof initialTraits>) => void;
  setCurrentToneFromProfile: (tone: ToneProfile) => void;
  updateTone: (toneId: string, updates: Partial<ToneProfile>) => Promise<void>;
  resetCurrentTone: () => void;
};

const initialTraits = {
  formality: 0,
  brevity: 0,
  humor: 0,
  warmth: 0,
  directness: 0,
  expressiveness: 0,
};

const initialToneState = {
  ...initialTraits,
  title: '',
  summary: '',
  prompt: '',
  examples: [],
};

export const useToneStore = create<ToneState>()(
  persist(
    (set, get) => ({
      currentTone: { ...initialToneState },
      savedTones: [],
      loading: false,
      error: null,
      
      generateSummary: async () => {
        try {
          set({ loading: true, error: null });
          const { currentTone } = get();
          const traits = {
            formality: currentTone.formality,
            brevity: currentTone.brevity,
            humor: currentTone.humor,
            warmth: currentTone.warmth,
            directness: currentTone.directness,
            expressiveness: currentTone.expressiveness,
          };
          
          const { title, summary, prompt } = await generateToneSummary(traits);
          
          set((state) => ({
            currentTone: {
              ...state.currentTone,
              title,
              summary,
              prompt,
            },
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ loading: false });
        }
      },
      
      generateExamples: async () => {
        try {
          set({ loading: true, error: null });
          const { currentTone } = get();
          const traits = {
            formality: currentTone.formality,
            brevity: currentTone.brevity,
            humor: currentTone.humor,
            warmth: currentTone.warmth,
            directness: currentTone.directness,
            expressiveness: currentTone.expressiveness,
          };
          
          const examples = await generateToneExamples(traits);
          
          set((state) => ({
            currentTone: {
              ...state.currentTone,
              examples,
            },
          }));

          // If we're editing an existing tone, update it in the database
          if (currentTone.id) {
            await get().updateTone(currentTone.id, { examples });
          }
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ loading: false });
        }
      },
      
      saveTone: async (name: string, userId: string) => {
        try {
          set({ loading: true, error: null });
          const { currentTone } = get();
          
          const { data, error } = await supabase
            .from('tone_profiles')
            .insert([
              {
                user_id: userId,
                name,
                formality: currentTone.formality,
                brevity: currentTone.brevity,
                humor: currentTone.humor,
                warmth: currentTone.warmth,
                directness: currentTone.directness,
                expressiveness: currentTone.expressiveness,
                summary: currentTone.summary,
                prompt: currentTone.prompt,
                examples: currentTone.examples,
              },
            ])
            .select();
          
          if (error) throw error;
          
          if (data) {
            set((state) => ({
              savedTones: [...state.savedTones, data[0] as ToneProfile],
            }));
          }
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ loading: false });
        }
      },
      
      loadSavedTones: async (userId: string) => {
        try {
          set({ loading: true, error: null });
          
          const { data, error } = await supabase
            .from('tone_profiles')
            .select('*')
            .eq('user_id', userId);
          
          if (error) throw error;
          
          if (data) {
            set({ savedTones: data as ToneProfile[] });
          }
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ loading: false });
        }
      },
      
      deleteTone: async (toneId: string) => {
        try {
          set({ loading: true, error: null });
          
          const { error } = await supabase
            .from('tone_profiles')
            .delete()
            .eq('id', toneId);
          
          if (error) throw error;
          
          set((state) => ({
            savedTones: state.savedTones.filter((tone) => tone.id !== toneId),
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ loading: false });
        }
      },
      
      updateTone: async (toneId: string, updates: Partial<ToneProfile>) => {
        try {
          set({ loading: true, error: null });
          
          const { error } = await supabase
            .from('tone_profiles')
            .update(updates)
            .eq('id', toneId);
          
          if (error) throw error;
          
          set((state) => ({
            savedTones: state.savedTones.map((tone) =>
              tone.id === toneId ? { ...tone, ...updates } : tone
            ),
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ loading: false });
        }
      },
      
      setCurrentToneTraits: (traits) => {
        set((state) => ({
          currentTone: {
            ...state.currentTone,
            ...traits,
          },
        }));
      },
      
      setCurrentToneFromProfile: (tone) => {
        set({
          currentTone: {
            id: tone.id,
            formality: tone.formality,
            brevity: tone.brevity,
            humor: tone.humor,
            warmth: tone.warmth,
            directness: tone.directness,
            expressiveness: tone.expressiveness,
            title: tone.name,
            summary: tone.summary,
            prompt: tone.prompt,
            examples: tone.examples || [],
          },
        });
      },

      resetCurrentTone: () => {
        set({
          currentTone: { ...initialToneState },
        });
      },
    }),
    {
      name: 'tone-data',
    }
  )
);