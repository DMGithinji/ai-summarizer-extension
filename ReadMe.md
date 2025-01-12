# Free YouTube & Web AI Summarizer

A browser extension that helps you summarize web content and YouTube videos using your existing AI accounts (ChatGPT, Claude, or Gemini). No additional subscription required!

## Features

- 🌐 **Web Content Summarization**: Summarize any webpage with one click
- 🎥 **YouTube Integration**: Get quick summaries of YouTube video transcripts
- 🤖 **Multiple AI Services**: Works with:
  - OpenAI's ChatGPT
  - Anthropic's Claude
  - Google's Gemini
- ✨ **Customizable Prompts**: Create and manage your own summarization templates
- 🎯 **Non-intrusive UI**: Minimal floating button that appears only when needed

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd youtube-web-ai-summarizer-extension
```

2. Install dependencies:
```bash
npm install
```

3. Build the extension:
```bash
npm run build
```

This will create a `dist` directory containing the built extension.

4. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the `dist` directory

## Development

The project uses the following tech stack:
- Chrome Extension Manifest V3
- React 18
- TypeScript
- Vite
- TailwindCSS

### Project Structure

```
src/
├── background/         # Background service worker
├── components/        # Reusable React components
├── config/           # Configuration files
├── entries/         # Extension entry points
│   ├── ai-paste-handler/   # AI service integration
│   ├── options/            # Extension options page
│   ├── web-summarizer/     # Web content summarizer
│   └── youtube-summarizer/ # YouTube content summarizer
├── hooks/           # Custom React hooks
├── lib/            # Utility functions
└── styles/        # Global styles
```

## Usage

1. **Web Summarization**:
   - Visit any webpage
   - Click the floating summarize button
   - The content will be extracted, opened in your selected AI service and summarized

2. **YouTube Summarization**:
   - Go to any YouTube video
   - Click the floating summarize button
   - The video transcript will be retrieved, opened in your selected AI service and summarized

3. **Customizing Prompts**:
   - Open extension options
   - Click "Add New" under Prompt Templates
   - Create your custom summarization prompt
   - Use {{content}} placeholder for the text to be summarized

4. **Selecting AI Service**:
   - Open extension options
   - Choose your preferred AI service (ChatGPT, Claude, or Gemini)
   - The extension will use this service for all summarizations

## Privacy

This extension:
- Does not collect any personal data
- Does not track user behavior
- Only accesses webpage content when explicitly requested
- Requires permissions only for essential functionality

---

Made with ❤️ for the open-source community