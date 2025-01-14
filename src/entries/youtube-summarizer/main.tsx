import { createRoot } from 'react-dom/client';
import { YTSummarizerRoot } from './components/YTSummarizerRoot';

export const ROOT_ID = 'youtube-summarizer-root';

// Simple initialization
function init() {
  const existingRoot = document.getElementById(ROOT_ID);
  if (existingRoot) return;

  const root = document.createElement('div');
  root.id = ROOT_ID;
  document.body.appendChild(root);
  createRoot(root).render(<YTSummarizerRoot />);
}

// Initialize on video pages and handle navigation
if (window.location.pathname === '/watch') {
  init();
}

window.addEventListener('yt-navigate-finish', () => {
  const existingRoot = document.getElementById(ROOT_ID);
  if (window.location.pathname === '/watch') {
    if (!existingRoot) init();
  } else {
    existingRoot?.remove();
  }
});
