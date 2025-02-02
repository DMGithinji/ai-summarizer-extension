# justTLDR: Free YouTube & Web AI Summarizer

A browser extension that helps you summarize web content and YouTube videos using your existing AI accounts (ChatGPT, Claude, or Gemini). No additional subscription required!

Install the extension from [chrome web store](https://chromewebstore.google.com/detail/justtldr-free-ai-summariz/cmnjpgpkkdmkkmpliipnmhbelgbiefpa)
or download latest version: [v2025.01.31](https://github.com/DMGithinji/ai-summarizer-extension/releases/tag/v2025.01.31) and install manually.

## Features

- 🌐 **Web Content Summarization**: Summarize any webpage with one click
- 🎥 **YouTube Integration**: Get quick summaries of YouTube video transcripts
- 🤖 **Multiple AI Services**: Works with:
  - OpenAI's ChatGPT
  - Anthropic's Claude
  - DeepSeek's DeepSeek
  - Google's Gemini
- ✨ **Adapts to free tier AI limits**: ChatGPT Free tier has character limit that extension navigates
- 🎯 **Non-intrusive UI**: Extension attempts to be unobtrusive and adapts to Youtube's design

💡 **Mobile Usage**: Want to use this extension on mobile? Install [Kiwi Browser](https://play.google.com/store/apps/details?id=com.kiwibrowser.browser&pcampaignid=web_share) from the Play Store - it supports Chrome extensions on Android! Enjoy! 😉

## How to Use

1. **Web Summarization**:
   - Visit any webpage
   - Click the floating summarize button at the bottom right
   - The content will be extracted, opened in your selected AI service and summarized

2. **YouTube Summarization**:
   - Go to any YouTube video
   - There is a transcript tab added to the right of all videos (Above suggested videos)
   - On clicking summarize, you'll be redirected to your selected AI service and get the summary based on your selected prompt
   - On expanding transcript tab, video transcript will be retrieved. You can use it to:
     - Skip to current video playback position in transcript
     - Navigate video by clicking on transcript timestamps

3. **Selecting AI Service**:
   - Open extension options
   - Choose your preferred AI service (ChatGPT, Claude, or Gemini)
   - The extension will use this service for all summarizations

4. **Customizing Prompts**:
   - Open extension options
   - Choose from the list of prompts
   - Or Edit/Add prompts to use in your summaries

## Privacy

This extension:
- Does not collect any personal data
- Does not track user behavior
- Only accesses webpage content when explicitly requested
- Requires permissions only for essential functionality

## For Developers

If you want to contribute to the development:

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-summarizer-extension
```

2. Install dependencies:
```bash
npm install
```

3. Build the extension:
```bash
npm run build
```

4. Install extension for testing

- Open Chrome and go to `chrome://extensions/`
- Enable "Developer mode" in the top right corner
- Click "Load unpacked" and select the dist file generated on running `npm run build`
- The extension's options page should be opened on your browser

### Project Structure

```
src/
├── background/         # Background service worker
├── components/         # Reusable react components
├── config/             # Extension configuration files
├── entries/            # Extension entry points
│   ├── ai-paste-handler/   # AI service integration
│   ├── options/            # Extension options page
│   ├── web-summarizer/     # Web content summarizer
│   └── youtube-summarizer/ # YouTube content summarizer
├── hooks/           # Has extension's state hook used by all services.
├── lib/             # Utility functions
└── styles/          # Global styles
```

### Tech Stack
- Chrome Extension Manifest V3
- React 18
- TypeScript
- Vite
- TailwindCSS

---

Built to increase productivity and maximize how we benefit from the AI tools we're given for free. 🚀
