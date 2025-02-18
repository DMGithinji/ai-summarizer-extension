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
  excludedSites: string[];
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
  characterLimit?: number;
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
