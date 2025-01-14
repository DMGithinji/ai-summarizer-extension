import { Prompt } from "./types";

export const PRECONFIGURED_PROMPTS: Prompt[] = [
  {
    id: 'default-summary',
    name: 'Default Summary',
    content: `Please provide a summary of the following content:

1. First, give a concise one-sentence summary that captures the core message/theme
2. Then, provide key points as bullet points (use suitable emojis for each point)
3. Expound briefly on each bullet point if there's need
4. Include any notable quotes or statistics
5. End with a brief takeaway

Content to summarize: ➡️➡️➡️`,
    isDefault: true
  },
  {
    id: 'simple-summary',
    name: 'Simple Summary',
    content: 'Summarize the following content in 5-10 bullet points:\n\n'
  },
  {
    id: 'eli5',
    name: 'Explain Like I\'m 12',
    content: 'Explain the following text to me like I am 12 years old:\n\n'
  }
]