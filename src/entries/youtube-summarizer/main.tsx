import { createRoot } from 'react-dom/client';
import { YTSummarizerRoot } from './components/YTSummarizerRoot';

export const ROOT_ID = 'youtube-summarizer-root';

class YoutubeInitializer {
  private static instance: YoutubeInitializer;
  private observer: MutationObserver | null = null;
  private root: HTMLElement | null = null;
  private reactRoot: ReturnType<typeof createRoot> | null = null;
  private lastUrl: string | null = null;
  private mountTimeout: number | null = null;

  private constructor() {
    this.setupNavigationHandler();
  }

  public static getInstance(): YoutubeInitializer {
    if (!YoutubeInitializer.instance) {
      YoutubeInitializer.instance = new YoutubeInitializer();
    }
    return YoutubeInitializer.instance;
  }

  private setupNavigationHandler(): void {
    if (window.location.hostname === 'm.youtube.com') {
      // Mobile YouTube navigation handling
      window.addEventListener('popstate', () => {
        this.handleNavigation();
      });

      if ('navigation' in window && window.navigation) {
        (window.navigation as any).addEventListener('navigate', () => {
          this.handleNavigation();
        });
      }

      const titleElement = document.querySelector('head > title');
      if (titleElement) {
        this.observer = new MutationObserver(() => {
          const currentUrl = window.location.href;
          if (this.lastUrl !== currentUrl) {
            this.lastUrl = currentUrl;
            this.handleNavigation();
          }
        });

        this.observer.observe(titleElement, { subtree: true, childList: true });
      }
    } else {
      // Desktop YouTube navigation handling
      window.addEventListener('yt-navigate-finish', () => {
        this.handleNavigation();
      });
    }

    // Handle initial page load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.handleNavigation());
    } else {
      this.handleNavigation();
    }
  }

  private isVideoPage(): boolean {
    const url = new URL(window.location.href);
    const isMobile = window.location.hostname === 'm.youtube.com';

    // Check for video pages on both mobile and desktop
    if (isMobile) {
      // Mobile YouTube video pages have a 'v' parameter
      return url.searchParams.has('v');
    } else {
      // Desktop YouTube video pages either start with /watch or /shorts
      return url.pathname === '/watch';
    }
  }

  private handleNavigation() {
    // Always unmount first when navigation occurs
    this.unmountComponent();

    if (this.isVideoPage()) {
      // Clear any existing timeout
      if (this.mountTimeout) {
        window.clearTimeout(this.mountTimeout);
      }

      this.mountComponent();
      this.mountTimeout = null;
    } else {
      // Clear timeout if navigating away
      if (this.mountTimeout) {
        window.clearTimeout(this.mountTimeout);
        this.mountTimeout = null;
      }
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
