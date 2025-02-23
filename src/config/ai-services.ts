import { AiService, AiServiceId } from "./types";

export const AI_SERVICES: Record<AiServiceId, AiService> = {
  [AiServiceId.CHATGPT]: {
    id: AiServiceId.CHATGPT,
    name: 'ChatGPT',
    url: 'https://chatgpt.com',
    icon: '/assets/icons/chatgpt-logo.png',
    characterLimit: 20000,
    premiumCharacterLimit: 200000
  },
  [AiServiceId.CLAUDE]: {
    id: AiServiceId.CLAUDE,
    name: 'Claude',
    url: 'https://claude.ai/new',
    icon: '/assets/icons/claude-logo.svg',
    characterLimit: 50000,
    premiumCharacterLimit: 250000
  },
  [AiServiceId.DEEPSEEK]: {
    id: AiServiceId.DEEPSEEK,
    name: 'DeepSeek',
    url: 'https://chat.deepseek.com',
    icon: '/assets/icons/deepseek-logo.png',
    characterLimit: 200000,
    premiumCharacterLimit: 200000
  },
  [AiServiceId.GEMINI]: {
    id: AiServiceId.GEMINI,
    name: 'Gemini',
    url: 'https://gemini.google.com/app',
    icon: '/assets/icons/gemini-logo.png',
    characterLimit: 32000,
    premiumCharacterLimit: 250000
  },
  [AiServiceId.GROK]: {
    id: AiServiceId.GROK,
    name: 'Grok',
    url: 'https://grok.com',
    icon: '/assets/icons/grok-logo.png',
    characterLimit: 250000,
    premiumCharacterLimit: 250000
  },
};
