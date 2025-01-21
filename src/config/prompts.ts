import { Prompt } from "./types";

export const PRECONFIGURED_PROMPTS: Prompt[] = [
  {
    id: 'detailed-summary',
    name: 'Summary with Key Points & Takeaways',
    isDefault: true,
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
    id: 'short-form',
    name: 'Shortform-Like Summary (Detailed)',
    content: `Summarize the following how Shortlist or Blinkist would.
Keep the tone of the content. Keep it conversational.
Don't skip any major topics throughout the content.
Use emojis on headers & subheaders to break up text.
Go beyond the title in giving the summary, look through entire content.`
},
{
  id: 'like-12',
  name: 'Simple language',
  content: `Explain the following text to me like I am 12 years old.
Break the text up using relevant dynamic emojis.
Don't explain obvious stuff.`,
},
  {
    id: '5-10-points',
    name: '5-10 Key Points',
    content: `Please provide the 5-10 most important points from the text.
Use bullet points and emojis to break up the text.
Focus on the key points and avoid summarizing everything.
Don't include any additional information, focus on the key points.`,
  },
]
