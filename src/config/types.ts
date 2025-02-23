export interface Prompt {
  id: string;
  name: string;
  content: string;
  isDefault?: boolean;
}

export interface StorageData {
  prompts: Prompt[];
  aiServiceId: AiServiceId;
  premiumServices: {[id: string]: boolean} | null;
  excludedSites: string[];
}

export enum AiServiceId {
  CLAUDE = 'claude',
  CHATGPT = 'chatgpt',
  GEMINI = 'gemini',
  DEEPSEEK = 'deepseek',
  GROK = 'grok'
}

export interface AiService {
  id: AiServiceId;
  name: string;
  url: string;
  icon: string;
  characterLimit: number;
  premiumCharacterLimit: number;
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

export interface VideoInfo {
  title: string;
  chapters: string;
  transcript: TranscriptSegment[] | null;
}
