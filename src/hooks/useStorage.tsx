import { useState, useEffect, useCallback } from 'react';
import { PRECONFIGURED_PROMPTS } from '@/config/prompts';
import { AI_SERVICES } from '@/config/ai-services';
import { AiService, AiServiceId, Prompt, StorageData } from '@/config/types';

interface StorageReturnType {
  prompts: Prompt[];
  addPrompt: (prompt: Omit<Prompt, 'id'>) => Promise<void>;
  editPrompt: (id: string, updates: Partial<Prompt>) => Promise<void>;
  deletePrompt: (id: string) => Promise<void>;
  setDefaultPrompt: (id: string) => Promise<void>;

  aiService: AiService;
  setAiService: (service: AiServiceId) => Promise<void>;

  premiumServices: {[id: string]: boolean};
  setIsProUser: (premiumConfig: {[id: string]: boolean}) => Promise<void>;

  excludedSites: string[];
  updateExcludedSites: (sites: string[] | string) => Promise<void>;

  resetToDefaults: () => Promise<void>;
  hasLoaded: boolean;
  error: Error | null;
}

export const DEFAULT_AI_SERVICE = AI_SERVICES[AiServiceId.CHATGPT];

export function useStorage(): StorageReturnType {
  const [prompts, setPrompts] = useState<Prompt[]>(PRECONFIGURED_PROMPTS);
  const [serviceId, setServiceId] = useState<keyof typeof AI_SERVICES>(AiServiceId.CHATGPT);
  const [premiumServices, setPremiumServices] = useState<{[id: string]: boolean}>({});
  const [excludedSites, setExcludedSites] = useState<string[]>([]);
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const aiService = AI_SERVICES[serviceId];

  // Load settings from storage
  useEffect(() => {
    const loadStorage = async () => {
      try {
        const result = await chrome.storage.sync.get<StorageData>({
          prompts: PRECONFIGURED_PROMPTS,
          aiServiceId: DEFAULT_AI_SERVICE.id,
          premiumServices: null,
          excludedSites: ['grok.com', 'chat.deepseek.com', 'gemini.google.com', 'chatgpt.com', 'claude.ai']
        });
        setPrompts(result.prompts);
        setServiceId(result.aiServiceId);
        setPremiumServices(result.premiumServices || {});
        setExcludedSites(result.excludedSites)
        setHasLoaded(true);
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

  const setAiService = useCallback(async (aiServiceId: AiServiceId) => {
    try {
      await saveToStorage({ aiServiceId });
      setServiceId(aiServiceId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to set AI URL'));
    }
  }, [saveToStorage]);

  const setIsProUser = useCallback(async (premiumConfig: {[id: string]: boolean}) => {
    try {
      await saveToStorage({ premiumServices: { ...premiumServices, ...premiumConfig } });
      setPremiumServices((prev) => ({ ...prev, ...premiumConfig }));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to set AI URL'));
    }
  }, [premiumServices, saveToStorage]);

  const updateExcludedSites = useCallback(async (latestExcludedSites: string[] | string) => {
    try {
      const excluded = Array.isArray(latestExcludedSites) ? latestExcludedSites : [...excludedSites, latestExcludedSites]
      await saveToStorage({ excludedSites: excluded });
      setExcludedSites(excluded);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update excluded sites'));
    }
  }, [excludedSites, saveToStorage]);


  const resetToDefaults = useCallback(async () => {
    try {
      await saveToStorage({
        prompts: PRECONFIGURED_PROMPTS,
        aiServiceId: DEFAULT_AI_SERVICE.id,
        premiumServices: {},
        excludedSites: []
      });
      setPrompts(PRECONFIGURED_PROMPTS);
      setServiceId(DEFAULT_AI_SERVICE.id);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to reset to defaults'));
    }
  }, [saveToStorage]);

  return {
    prompts,
    addPrompt,
    editPrompt,
    deletePrompt,
    setDefaultPrompt,

    aiService,
    setAiService,

    premiumServices,
    setIsProUser,

    excludedSites,
    updateExcludedSites,

    hasLoaded,
    error,
    resetToDefaults,
  };
}

export const getSummaryServiceData = async () => {
  try {
    const result = await chrome.storage.sync.get<StorageData>({
      premiumServices: null,
      aiServiceId: DEFAULT_AI_SERVICE.id,
    });
    const config = AI_SERVICES[result.aiServiceId as AiServiceId];
    const premiumServices = result.premiumServices || {} as {[id: string]: boolean};
    const characterLimit = premiumServices[result.aiServiceId] ? config?.premiumCharacterLimit : config?.characterLimit;
    return {
      ...config,
      characterLimit
    };
  } catch (err) {
    console.error('Failed to get AI Service:', err);
    return {
      ...DEFAULT_AI_SERVICE,
      characterLimit: DEFAULT_AI_SERVICE.characterLimit};
  }
};

export const getDefaultPrompt = async () => {
  try {
    const result = await chrome.storage.sync.get<StorageData>({
      prompts: PRECONFIGURED_PROMPTS
    });
    const selected = result.prompts.find((prompt: Prompt) => prompt.isDefault);
    return selected || PRECONFIGURED_PROMPTS[0];
  } catch (err) {
    console.error('Failed to get default prompt:', err);
    return PRECONFIGURED_PROMPTS[0];
  }
};
