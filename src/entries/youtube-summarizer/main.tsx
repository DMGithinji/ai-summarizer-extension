import { createRoot } from 'react-dom/client';
import { YTSummarizerRoot } from './components/YTSummarizerRoot';

export const ROOT_ID = 'youtube-summarizer-root';

class YoutubeInitializer {
  private static instance: YoutubeInitializer;
  private observer: MutationObserver | null = null;
  private root: HTMLElement | null = null;
  private reactRoot: ReturnType<typeof createRoot> | null = null;

  private constructor() {
    this.setupNavigationHandler();
  }

  public static getInstance(): YoutubeInitializer {
    if (!YoutubeInitializer.instance) {
      YoutubeInitializer.instance = new YoutubeInitializer();
    }
    return YoutubeInitializer.instance;
  }

  private setupNavigationHandler() {
    // Handle YouTube's custom navigation event
    window.addEventListener('yt-navigate-finish', () => {
      this.handleNavigation();
    });

    // Handle initial page load and direct URL navigation
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.handleNavigation());
    } else {
      this.handleNavigation();
    }
  }

  private mountTimeout: number | null = null;

  private handleNavigation() {
    const isVideoPage = window.location.pathname === '/watch';

    if (isVideoPage) {
      // Clear any existing timeout
      if (this.mountTimeout) {
        window.clearTimeout(this.mountTimeout);
      }

      // Set new timeout for mounting
      this.mountTimeout = window.setTimeout(() => {
        this.mountComponent();
        this.mountTimeout = null;
      }, 2000); // 2 second delay
    } else {
      // Clear timeout if navigating away
      if (this.mountTimeout) {
        window.clearTimeout(this.mountTimeout);
        this.mountTimeout = null;
      }
      this.unmountComponent();
    }
  }

  private mountComponent() {
    // Prevent multiple instances
    if (this.root) return;

    this.root = document.createElement('div');
    this.root.id = ROOT_ID;
    document.body.appendChild(this.root);
    this.reactRoot = createRoot(this.root);
    this.reactRoot.render(<YTSummarizerRoot />);
  }

  private unmountComponent() {
    if (this.reactRoot) {
      this.reactRoot.unmount();
      this.reactRoot = null;
    }
    if (this.root) {
      this.root.remove();
      this.root = null;
    }
  }

  public cleanup() {
    if (this.mountTimeout) {
      window.clearTimeout(this.mountTimeout);
      this.mountTimeout = null;
    }
    this.unmountComponent();
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}

// Initialize the singleton
YoutubeInitializer.getInstance();
