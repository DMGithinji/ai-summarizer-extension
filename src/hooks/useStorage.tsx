import { useState, useEffect, useCallback } from 'react';
import { PRECONFIGURED_PROMPTS } from '@/config/prompts';
import { AI_SERVICES } from '@/config/ai-services';
import { AiServiceType, Prompt, StorageData } from '@/config/types';

interface StorageReturnType {
  prompts: Prompt[];
  aiUrl: string;
  loading: boolean;
  error: Error | null;
  addPrompt: (prompt: Omit<Prompt, 'id'>) => Promise<void>;
  editPrompt: (id: string, updates: Partial<Prompt>) => Promise<void>;
  deletePrompt: (id: string) => Promise<void>;
  setDefaultPrompt: (id: string) => Promise<void>;
  getDefaultPrompt: () => Promise<Prompt>;
  getAiUrl: () => Promise<string>;
  setAiUrl: (url: string) => Promise<void>;
  resetToDefaults: () => Promise<void>;
}

// Default values
export const DEFAULT_AI_SERVICE = AI_SERVICES[AiServiceType.DEEPSEEK];

export function useStorage(): StorageReturnType {
  const [prompts, setPrompts] = useState<Prompt[]>(PRECONFIGURED_PROMPTS);
  const [aiUrl, setAiUrlState] = useState<string>(DEFAULT_AI_SERVICE.url);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load settings from storage
  useEffect(() => {
    const loadStorage = async () => {
      try {
        const result = await chrome.storage.sync.get({
          prompts: PRECONFIGURED_PROMPTS,
          aiUrl: DEFAULT_AI_SERVICE.url,
        });
        setPrompts(result.prompts);
        setAiUrlState(result.aiUrl);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load settings'));
        setLoading(false);
      }
    };

    loadStorage();
  }, []);

  // Helper function to save current state to storage
  const saveToStorage = useCallback(async (data: Partial<StorageData>) => {
    try {
      await chrome.storage.sync.set(data);
    } catch (err) {
      throw new Error(`Failed to save settings: ${err}`);
    }
  }, []);

  const addPrompt = useCallback(async (prompt: Omit<Prompt, 'id'>) => {
    setLoading(true);
    try {
      const newPrompt: Prompt = {
        ...prompt,
        id: `custom-${Date.now()}`,
        isDefault: false
      };

      const updatedPrompts = [...prompts, newPrompt];
      await saveToStorage({ prompts: updatedPrompts });
      setPrompts(updatedPrompts);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add prompt'));
    } finally {
      setLoading(false);
    }
  }, [prompts, saveToStorage]);

  const editPrompt = useCallback(async (id: string, updates: Partial<Prompt>) => {
    setLoading(true);
    try {
      const updatedPrompts = prompts.map(prompt =>
        prompt.id === id ? { ...prompt, ...updates } : prompt
      );
      await saveToStorage({ prompts: updatedPrompts });
      setPrompts(updatedPrompts);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to edit prompt'));
    } finally {
      setLoading(false);
    }
  }, [prompts, saveToStorage]);

  const deletePrompt = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const promptToDelete = prompts.find(p => p.id === id);
      if (promptToDelete?.isDefault) {
        throw new Error('Cannot delete the default prompt');
      }

      const updatedPrompts = prompts.filter(prompt => prompt.id !== id);
      await saveToStorage({ prompts: updatedPrompts });
      setPrompts(updatedPrompts);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete prompt'));
    } finally {
      setLoading(false);
    }
  }, [prompts, saveToStorage]);

  const setDefaultPrompt = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const updatedPrompts = prompts.map(prompt => ({
        ...prompt,
        isDefault: prompt.id === id
      }));
      await saveToStorage({ prompts: updatedPrompts });
      setPrompts(updatedPrompts);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to set default prompt'));
    } finally {
      setLoading(false);
    }
  }, [prompts, saveToStorage]);

  const getDefaultPrompt = useCallback(async () => {
    try {
      const result = await chrome.storage.sync.get({
        prompts: PRECONFIGURED_PROMPTS
      });
      const selected = result.prompts.find((prompt: Prompt) => prompt.isDefault);
      return selected || PRECONFIGURED_PROMPTS[0];
    } catch (err) {
      console.error('Failed to get default prompt:', err);
      return undefined;
    }
  }, []);

  // New function to get AI URL directly from storage
  const getAiUrl = useCallback(async () => {
    try {
      const result = await chrome.storage.sync.get({
        aiUrl: DEFAULT_AI_SERVICE.url
      });
      return result.aiUrl;
    } catch (err) {
      console.error('Failed to get AI URL:', err);
      return DEFAULT_AI_SERVICE.url;
    }
  }, []);

  const setAiUrl = useCallback(async (url: string) => {
    setLoading(true);
    try {
      await saveToStorage({ aiUrl: url });
      setAiUrlState(url);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to set AI URL'));
    } finally {
      setLoading(false);
    }
  }, [saveToStorage]);

  const resetToDefaults = useCallback(async () => {
    setLoading(true);
    try {
      await saveToStorage({
        prompts: PRECONFIGURED_PROMPTS,
        aiUrl: DEFAULT_AI_SERVICE.url
      });
      setPrompts(PRECONFIGURED_PROMPTS);
      setAiUrlState(DEFAULT_AI_SERVICE.url);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to reset to defaults'));
    } finally {
      setLoading(false);
    }
  }, [saveToStorage]);

  return {
    prompts,
    aiUrl,
    loading,
    error,
    addPrompt,
    editPrompt,
    deletePrompt,
    setDefaultPrompt,
    getDefaultPrompt,
    getAiUrl,
    setAiUrl,
    resetToDefaults
  };
}
