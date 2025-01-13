import { createRoot } from 'react-dom/client';
import { YTSummarizer } from './components/YTSummarizer';

export type DisplayMode = 'tab' | 'floating';

class YouTubeSummarizerInitializer {
  private root: HTMLDivElement | null = null;
  private reactRoot: ReturnType<typeof createRoot> | null = null;
  private observer: MutationObserver | null = null;
  private mountAttempts = 0;
  private readonly MAX_MOUNT_ATTEMPTS = 10;
  private readonly MOUNT_ATTEMPT_DELAY = 1000;
  private readonly MOBILE_BREAKPOINT = 1020;
  private displayMode: DisplayMode;

  constructor() {
    // Set display mode once at initialization
    this.displayMode = this.determineInitialDisplayMode();

    // Bind methods
    this.init = this.init.bind(this);
    this.cleanup = this.cleanup.bind(this);
    this.handleNavigation = this.handleNavigation.bind(this);
    this.mountComponent = this.mountComponent.bind(this);
    this.setupNavigationListeners = this.setupNavigationListeners.bind(this);
  }

  private determineInitialDisplayMode(): DisplayMode {
    const isMobileWidth = window.innerWidth < this.MOBILE_BREAKPOINT;
    return isMobileWidth ? 'floating' : 'tab';
  }

  private createRootElement(): HTMLDivElement {
    const root = document.createElement('div');
    root.id = 'youtube-summarizer-root';

    if (this.displayMode === 'tab') {
      root.style.width = '100%';
      root.style.minHeight = '50px';
    }

    return root;
  }

  private async mountComponent(): Promise<boolean> {
    if (this.mountAttempts >= this.MAX_MOUNT_ATTEMPTS) {
      console.warn('Max mount attempts reached for YouTube Summarizer');
      this.renderFloatingButton();
      return true;
    }

    if (!this.root) {
      this.root = this.createRootElement();
    }

    if (this.displayMode === 'floating') {
      document.body.appendChild(this.root);
      this.renderComponent();
      return true;
    }

    // For tab mode, try to mount in #secondary
    const secondary = document.querySelector('#secondary');
    if (secondary) {
      if (secondary.firstChild) {
        secondary.insertBefore(this.root, secondary.firstChild);
      } else {
        secondary.appendChild(this.root);
      }
      this.renderComponent();
      return true;
    }

    this.mountAttempts++;
    await new Promise(resolve => setTimeout(resolve, this.MOUNT_ATTEMPT_DELAY));
    return this.mountComponent();
  }

  private renderFloatingButton(): void {
    if (!this.root) {
      this.root = this.createRootElement();
      document.body.appendChild(this.root);
    }
    this.renderComponent();
  }

  private renderComponent(): void {
    if (!this.root) return;

    if (!this.reactRoot) {
      this.reactRoot = createRoot(this.root);
    }
    this.reactRoot.render(<YTSummarizer displayMode={this.displayMode} />);
  }

  private setupNavigationListeners(): void {
    const originalPushState = history.pushState;
    history.pushState = (...args) => {
      originalPushState.apply(history, args);
      this.handleNavigation();
    };

    window.addEventListener('popstate', this.handleNavigation);
    window.addEventListener('yt-navigate-finish', this.handleNavigation);
  }

  private async handleNavigation(): Promise<void> {
    this.cleanup();
    this.mountAttempts = 0;
    await this.init();
  }

  private cleanup(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    if (this.reactRoot) {
      this.reactRoot.unmount();
      this.reactRoot = null;
    }

    if (this.root && this.root.parentNode) {
      this.root.remove();
      this.root = null;
    }
  }

  public async init(): Promise<void> {
    this.observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          const secondary = document.querySelector('#secondary');

          if (secondary && !document.getElementById('youtube-summarizer-root')) {
            this.mountComponent();
            break;
          }
        }
      }
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false
    });

    await this.mountComponent();

    if (!window.YTSummarizerInitialized) {
      this.setupNavigationListeners();
      window.YTSummarizerInitialized = true;
    }
  }
}

declare global {
  interface Window {
    YTSummarizerInitialized?: boolean;
  }
}

const initializer = new YouTubeSummarizerInitializer();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initializer.init());
} else {
  initializer.init();
}
