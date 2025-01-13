import { AiService, AiServiceType } from "./types";

export const AI_SERVICES: Record<AiServiceType, AiService> = {
  [AiServiceType.CLAUDE]: {
    type: AiServiceType.CLAUDE,
    name: 'Claude',
    url: 'https://claude.ai/new',
    icon: '/assets/icons/claude-logo.svg'
  },
  [AiServiceType.CHATGPT]: {
    type: AiServiceType.CHATGPT,
    name: 'ChatGPT',
    url: 'https://chatgpt.com',
    icon: '/assets/icons/chatgpt-logo.png'
  },
  [AiServiceType.GEMINI]: {
    type: AiServiceType.GEMINI,
    name: 'Gemini',
    url: 'https://gemini.google.com/app',
    icon: '/assets/icons/gemini-logo.png'
  }
};
