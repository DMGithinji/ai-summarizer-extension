import { createRoot } from 'react-dom/client'
import { WebSummarizer } from './components/WebSummarizer'

// Wrap everything in an IIFE to avoid global scope pollution
;(function() {
  function init() {
    const root = document.createElement('div')
    root.id = 'web-summarizer-root'
    document.body.appendChild(root)

    createRoot(root).render(<WebSummarizer />)
  }

  // Initialize after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})();
