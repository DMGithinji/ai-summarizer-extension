export interface Prompt {
  id: string;
  name: string;
  content: string;
  isDefault?: boolean;
}

export interface StorageData {
  prompts: Prompt[];
  aiUrl: string;
  isPremiumUser: boolean;
}

export enum AiServiceType {
  CLAUDE = 'claude',
  CHATGPT = 'chatgpt',
  GEMINI = 'gemini',
  DEEPSEEK = 'deepseek'
}

export interface AiService {
  type: AiServiceType;
  name: string;
  url: string;
  icon: string;
}

export interface TranscriptSegment {
  text: string;
  start: number;
  end: number
}

export interface TranscriptData {
  data: {
    transcript: TranscriptSegment[]
  }
}
