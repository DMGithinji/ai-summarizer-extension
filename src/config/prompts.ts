import { Prompt } from "./types";

export const PRECONFIGURED_PROMPTS: Prompt[] = [
  {
    id: 'short-form',
    name: 'Shortform',
    isDefault: true,
    content: `Summarize the following how Shortlist or Blinkist would.
Keep the tone of the content. Keep it conversational.
Don't skip any major topics throughout the content.
Use emojis on headers & subheaders to break up text.
Go beyond the title in giving the summary, look through entire content.`
},
{
  id: 'detailed-summary',
  name: 'Detailed Summary',
  content: `Please provide a summary of the following content:
1. First, give a concise one-sentence summary that captures the core message/theme
2. Then, provide key points as bullet points (use suitable emojis for each point)
3. Expound briefly on each bullet point if there's need
4. Include any notable quotes or statistics
5. End with a brief takeaway
6. Use emojis on headers & subheaders to break up text
`,
  },
{
  id: 'like-12',
  name: 'Simple language',
  content: `Explain the following text to me like I am 12 years old.
Break the text up using relevant dynamic emojis.
Don't explain obvious stuff.`,
},
]
