import { Prompt } from "./types";

export const PRECONFIGURED_PROMPTS: Prompt[] = [
  {
    id: "key-points-summary",
    name: "Summary with Key Points & Takeaways",
    isDefault: true,
    content: `Please provide a summary of the following content:
1. First, give a concise one-sentence summary that captures the core message/theme
2. Then, share a breakdown of the main topics discussed. For each topic:
    - Use suitable emojis for the subtitle of each topic
    - Expound very briefly on what was discussed on each topic
    - Include any notable quotes or statistics
    - Keep the tone of the content. Be conversational. How a friend would give the summary.
3. End with a brief takeaways
4. Don't start the text with "Let me...", or "Here is the summary...". Just give the results.`,
  },
  {
    id: "short-form",
    name: "Shortform-Like Summary (Detailed)",
    content: `Summarize the following how Shortlist or Blinkist would.
Keep the tone of the content. Keep it conversational.
Break the headers using relevant dynamic emojis.
Go beyond the title in giving the summary, look through entire content.
Sprinkle in quotes or excerpts to better link the summary to the content.
Don't start the text with "Let me...", or "Here is the summary...". Just give the results.`,
  },
  {
    id: "youtube",
    name: "For Youtube",
    content: `For each chapter highlighted, provide a summary on what was discussed based on the transcript.
For each chapter summary;
- Start each topic subtitle with a relevant emoji
- Expound very briefly on what was discussed on each topic
- Include any notable quotes or statistics
- Keep the tone of the content. Be conversational.
Otherwise (if no chapters), share a breakdown of the main topics discussed. For each topic:
    - Start each topic subtitle with a relevant emoji
    - Expound very briefly on what was discussed on each topic
    - Include any notable quotes or statistics
    - Keep the tone of the content.`,
  },
  {
    id: "simple",
    name: "Simple language",
    content: `Explain the following text with language:
- Simple and clear language with a conversational tone.
- Cover all the major and interesting topics discussed.
- Break the headers using relevant dynamic emojis.
- Don't start the text with "Let me...", or "Here is the summary...". Just give the results.`,
  },
  {
    id: "5-10-points",
    name: "5-10 Key Points",
    content: `Please provide the 5-10 most important points from the text.
Use bullet points and emojis to break up the text.
Focus on the key points and avoid summarizing everything.
Don't include any additional information, focus on the key points.`,
  },
];
