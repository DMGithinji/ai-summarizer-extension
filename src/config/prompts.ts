import { Prompt } from "./types";

export const PRECONFIGURED_PROMPTS: Prompt[] = [
  {
    id: 'eli5',
    name: 'Explain Like I\'m 12',
    content: "Explain the following text to me like I am 12 years old.\nBreak the text up using relevant dynamic emojis.\nDon't explain obvious stuff.\n",
    isDefault: true
  },
  {
    id: 'surprise-me',
    name: 'Surprise Me',
    content: 'Summarize this in an interesting way that I will love to read.\nBreak up the text up using relevant dynamic emojis.\nSurprise me 😉\n'
  },
  {
    id: 'default-summary',
    name: 'Default Summary',
    content: `Please provide a summary of the following content:

1. First, give a concise one-sentence summary that captures the core message/theme
2. Then, provide key points as bullet points (use suitable emojis for each point)
3. Expound briefly on each bullet point if there's need
4. Include any notable quotes or statistics
5. End with a brief takeaway
`,
  },
]
