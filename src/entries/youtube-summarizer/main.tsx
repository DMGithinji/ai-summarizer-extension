import { createRoot } from 'react-dom/client'
import { YTSummarizer } from './components/YTSummarizer'

// Wrap everything in an IIFE to avoid global scope pollution
;(function() {
  function init() {
    const root = document.createElement('div')
    root.id = 'youtube-summarizer-root'
    document.body.appendChild(root)

    createRoot(root).render(<YTSummarizer />)
  }

  // Initialize after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})();