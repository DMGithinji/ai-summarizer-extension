# Free YouTube & Web AI Summarizer

A browser extension that helps you summarize web content and YouTube videos using your existing AI accounts (ChatGPT, Claude, or Gemini). No additional subscription required!

Download latest version: [v2025.01.29](https://github.com/DMGithinji/ai-summarizer-extension/releases/tag/v2025.01.29)

## Features

- 🌐 **Web Content Summarization**: Summarize any webpage with one click
- 🎥 **YouTube Integration**: Get quick summaries of YouTube video transcripts
- 🤖 **Multiple AI Services**: Works with:
  - OpenAI's ChatGPT
  - Anthropic's Claude
  - DeepSeek's DeepSeek
  - Google's Gemini
- ✨ **Customizable Prompts**: Create and manage your own summarization templates
- 🎯 **Non-intrusive UI**: Minimal floating button that appears only when needed

💡 **Mobile Usage**: Want to use this extension on mobile? Install [Kiwi Browser](https://play.google.com/store/apps/details?id=com.kiwibrowser.browser&pcampaignid=web_share) from the Play Store - it supports Chrome extensions on Android! Enjoy! 😉

## Quick Installation Guide

1. Download the extension zip file from the link above
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the folder where you unzipped the extension
5. The extension icon should now appear in your Chrome toolbar!

## How to Use

1. **Web Summarization**:
   - Visit any webpage
   - Click the floating summarize button at the bottom right
   - The content will be extracted, opened in your selected AI service and summarized

2. **YouTube Summarization**:
   - Go to any YouTube video
   - There is a transcript tab added to the right of all videos
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

### Tech Stack
- Chrome Extension Manifest V3
- React 18
- TypeScript
- Vite
- TailwindCSS

---

Built to maximize the potential of the common AI tools we're given for free. 🚀
