import { useState, useEffect, useCallback, useMemo } from 'react';
import { PRECONFIGURED_PROMPTS } from '@/config/prompts';
import { AI_SERVICES } from '@/config/ai-services';
import { AiService, AiServiceType, Prompt, StorageData } from '@/config/types';

interface StorageReturnType {
  prompts: Prompt[];
  addPrompt: (prompt: Omit<Prompt, 'id'>) => Promise<void>;
  editPrompt: (id: string, updates: Partial<Prompt>) => Promise<void>;
  deletePrompt: (id: string) => Promise<void>;
  setDefaultPrompt: (id: string) => Promise<void>;
  currentAi: AiService;
  setAiUrl: (url: string) => Promise<void>;
  isPremiumUser: boolean;
  setIsProUser: (isPremiumUser: boolean) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  error: Error | null;
}

export const DEFAULT_AI_SERVICE = AI_SERVICES[AiServiceType.CHATGPT];

export function useStorage(): StorageReturnType {
  const [prompts, setPrompts] = useState<Prompt[]>(PRECONFIGURED_PROMPTS);
  const [aiUrl, setAiUrlState] = useState<string>(DEFAULT_AI_SERVICE.url);
  const [isPremiumUser, seIsPremiumUser] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const currentAi = useMemo(() => Object.values(AI_SERVICES).find(ai => ai.url === aiUrl) || DEFAULT_AI_SERVICE, [aiUrl]);

  // Load settings from storage
  useEffect(() => {
    const loadStorage = async () => {
      try {
        const result = await chrome.storage.sync.get({
          prompts: PRECONFIGURED_PROMPTS,
          aiUrl: DEFAULT_AI_SERVICE.url,
          isPremiumUser: false,
        });
        setPrompts(result.prompts);
        setAiUrlState(result.aiUrl);
        seIsPremiumUser(result.isPremiumUser);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load settings'));
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
    }
  }, [prompts, saveToStorage]);

  const editPrompt = useCallback(async (id: string, updates: Partial<Prompt>) => {
    try {
      const updatedPrompts = prompts.map(prompt =>
        prompt.id === id ? { ...prompt, ...updates } : prompt
      );
      await saveToStorage({ prompts: updatedPrompts });
      setPrompts(updatedPrompts);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to edit prompt'));
    }
  }, [prompts, saveToStorage]);

  const deletePrompt = useCallback(async (id: string) => {
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
    }
  }, [prompts, saveToStorage]);

  const setDefaultPrompt = useCallback(async (id: string) => {
    try {
      const updatedPrompts = prompts.map(prompt => ({
        ...prompt,
        isDefault: prompt.id === id
      }));
      await saveToStorage({ prompts: updatedPrompts });
      setPrompts(updatedPrompts);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to set default prompt'));
    }
  }, [prompts, saveToStorage]);

  const setAiUrl = useCallback(async (url: string) => {
    try {
      await saveToStorage({ aiUrl: url });
      setAiUrlState(url);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to set AI URL'));
    }
  }, [saveToStorage]);

  const setIsProUser = useCallback(async (isPremiumUser: boolean) => {
    try {
      await saveToStorage({ isPremiumUser });
      seIsPremiumUser(isPremiumUser);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to set AI URL'));
    }
  }, [saveToStorage]);


  const resetToDefaults = useCallback(async () => {
    try {
      await saveToStorage({
        prompts: PRECONFIGURED_PROMPTS,
        aiUrl: DEFAULT_AI_SERVICE.url,
      });
      setPrompts(PRECONFIGURED_PROMPTS);
      setAiUrlState(DEFAULT_AI_SERVICE.url);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to reset to defaults'));
    }
  }, [saveToStorage]);

  return {
    prompts,
    currentAi,
    addPrompt,
    editPrompt,
    deletePrompt,
    setDefaultPrompt,

    setAiUrl,

    resetToDefaults,

    isPremiumUser,
    setIsProUser,

    error,
  };
}

export const getSummaryServiceData = async () => {
  try {
    const result = await chrome.storage.sync.get({
      isPremiumUser: false,
      aiUrl: AI_SERVICES[AiServiceType.CHATGPT].url,
    });

    const shouldLimitContext = !result.isPremiumUser && [AI_SERVICES[AiServiceType.CHATGPT].url].includes(result.aiUrl)
    return { aiUrl: result.aiUrl, shouldLimitContext };
  } catch (err) {
    console.error('Failed to get AI URL:', err);
    return { aiUrl: DEFAULT_AI_SERVICE.url, shouldLimitContext: true};
  }
};

export const getDefaultPrompt = async () => {
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
};
