import { createRoot } from 'react-dom/client';
import { YTSummarizerRoot } from './components/YTSummarizerRoot';

// Simple initialization
function init() {
  const existingRoot = document.getElementById('yt-summarizer-app-root');
  if (existingRoot) return;

  const root = document.createElement('div');
  root.id = 'yt-summarizer-app-root';
  document.body.appendChild(root);
  createRoot(root).render(<YTSummarizerRoot />);
}

// Initialize on video pages and handle navigation
if (window.location.pathname === '/watch') {
  init();
}

window.addEventListener('yt-navigate-finish', () => {
  const existingRoot = document.getElementById('yt-summarizer-app-root');
  if (window.location.pathname === '/watch') {
    if (!existingRoot) init();
  } else {
    existingRoot?.remove();
  }
});
