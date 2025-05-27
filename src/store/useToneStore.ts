import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase, ToneProfile } from '../lib/supabase';
import { generateToneSummary, generateToneExamples, OpenAIQuotaError } from '../lib/openai';

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
  isQuotaExceeded: boolean;
  pendingSave: boolean;
  
  generateContent: () => Promise<void>;
  saveTone: (name: string, userId: string) => Promise<void>;
  loadSavedTones: (userId: string) => Promise<void>;
  deleteTone: (toneId: string) => Promise<void>;
  duplicateTone: (toneId: string, userId: string) => Promise<void>;
  setCurrentToneTraits: (traits: Partial<typeof initialTraits>) => void;
  setCurrentToneFromProfile: (tone: ToneProfile) => void;
  updateTone: (toneId: string, updates: Partial<ToneProfile>) => Promise<void>;
  resetCurrentTone: () => void;
  clearError: () => void;
  hasUnsavedChanges: () => boolean;
  setPendingSave: (pendingSave: boolean) => void;
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
      isQuotaExceeded: false,
      pendingSave: false,
      
      setPendingSave: (pendingSave: boolean) => set({ pendingSave }),
      
      hasUnsavedChanges: () => {
        const { currentTone, savedTones } = get();
        
        // If there's no ID, it's a new tone
        if (!currentTone.id) return false;
        
        // Find the saved tone with matching ID
        const savedTone = savedTones.find(tone => tone.id === currentTone.id);
        if (!savedTone) return false;
        
        // Compare current values with saved values
        return (
          currentTone.formality !== savedTone.formality ||
          currentTone.brevity !== savedTone.brevity ||
          currentTone.humor !== savedTone.humor ||
          currentTone.warmth !== savedTone.warmth ||
          currentTone.directness !== savedTone.directness ||
          currentTone.expressiveness !== savedTone.expressiveness ||
          currentTone.title !== savedTone.name ||
          currentTone.summary !== savedTone.summary ||
          currentTone.prompt !== savedTone.prompt ||
          JSON.stringify(currentTone.examples) !== JSON.stringify(savedTone.examples)
        );
      },
      
      generateContent: async () => {
        try {
          set({ loading: true, error: null, isQuotaExceeded: false });
          const { currentTone } = get();
          const traits = {
            formality: currentTone.formality,
            brevity: currentTone.brevity,
            humor: currentTone.humor,
            warmth: currentTone.warmth,
            directness: currentTone.directness,
            expressiveness: currentTone.expressiveness,
          };
          
          const [summaryResult, examplesResult] = await Promise.all([
            generateToneSummary(traits),
            generateToneExamples(traits),
          ]);
          
          if (!summaryResult || !examplesResult) {
            throw new Error('Failed to generate content. Please try again.');
          }
          
          const updates = {
            title: summaryResult.title,
            summary: summaryResult.summary,
            prompt: summaryResult.prompt,
            examples: examplesResult,
          };
          
          // If we're in edit mode, auto-save the changes
          if (currentTone.id) {
            await get().updateTone(currentTone.id, {
              name: updates.title,
              summary: updates.summary,
              prompt: updates.prompt,
              examples: updates.examples,
              formality: traits.formality,
              brevity: traits.brevity,
              humor: traits.humor,
              warmth: traits.warmth,
              directness: traits.directness,
              expressiveness: traits.expressiveness,
            });
          }
          
          set((state) => ({
            currentTone: {
              ...state.currentTone,
              ...updates,
            },
          }));
        } catch (error) {
          if (error instanceof OpenAIQuotaError) {
            set({ 
              error: 'OpenAI API quota exceeded. Please try again in a few minutes.',
              isQuotaExceeded: true 
            });
          } else {
            set({ error: (error as Error).message });
          }
          throw error;
        } finally {
          set({ loading: false });
        }
      },
      
      clearError: () => {
        set({ error: null, isQuotaExceeded: false });
      },
      
      saveTone: async (name: string, userId: string) => {
        try {
          set({ loading: true, error: null });
          const { currentTone } = get();
          
          const { data, error } = await supabase
            .from('tone_profiles')
            .insert([{
              user_id: userId,
              name: name || currentTone.title,
              formality: currentTone.formality,
              brevity: currentTone.brevity,
              humor: currentTone.humor,
              warmth: currentTone.warmth,
              directness: currentTone.directness,
              expressiveness: currentTone.expressiveness,
              summary: currentTone.summary,
              prompt: currentTone.prompt,
              examples: currentTone.examples,
            }])
            .select()
            .single();
          
          if (error) throw error;
          
          if (data) {
            set((state) => ({
              savedTones: [...state.savedTones, data],
            }));
          }
        } catch (error) {
          set({ error: (error as Error).message });
          throw error;
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
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
          
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
      
      duplicateTone: async (toneId: string, userId: string) => {
        try {
          set({ loading: true, error: null });
          
          const toneToDuplicate = get().savedTones.find(tone => tone.id === toneId);
          if (!toneToDuplicate) throw new Error('Tone not found');
          
          const { data, error } = await supabase
            .from('tone_profiles')
            .insert([{
              user_id: userId,
              name: `${toneToDuplicate.name} (Copy)`,
              formality: toneToDuplicate.formality,
              brevity: toneToDuplicate.brevity,
              humor: toneToDuplicate.humor,
              warmth: toneToDuplicate.warmth,
              directness: toneToDuplicate.directness,
              expressiveness: toneToDuplicate.expressiveness,
              summary: toneToDuplicate.summary,
              prompt: toneToDuplicate.prompt,
              examples: toneToDuplicate.examples,
            }])
            .select()
            .single();
          
          if (error) throw error;
          
          if (data) {
            set((state) => ({
              savedTones: [...state.savedTones, data],
            }));
          }
        } catch (error) {
          set({ error: (error as Error).message });
          throw error;
        } finally {
          set({ loading: false });
        }
      },
      
      updateTone: async (toneId: string, updates: Partial<ToneProfile>) => {
        try {
          set({ loading: true, error: null });
          
          const { data, error } = await supabase
            .from('tone_profiles')
            .update(updates)
            .eq('id', toneId)
            .select()
            .single();
          
          if (error) throw error;
          
          if (data) {
            set((state) => ({
              savedTones: state.savedTones.map((tone) =>
                tone.id === toneId ? data : tone
              ),
            }));
          }
        } catch (error) {
          set({ error: (error as Error).message });
          throw error;
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
          error: null,
          isQuotaExceeded: false,
        });
      },
    }),
    {
      name: 'tone-data',
    }
  )
);