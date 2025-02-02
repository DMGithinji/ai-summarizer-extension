// Valid URL patterns for each AI service
const VALID_PATHS: Record<string, string> = {
  'claude.ai': '/new',
  'chatgpt.com': '/',
  'chat.deepseek.com': '/',
  'gemini.google.com': '/app',
};

// Check if a URL matches any of our AI services with the extension parameter
function isValidAiUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    const validPath = VALID_PATHS[domain];

    return Boolean(
      validPath &&
      urlObj.pathname === validPath &&
      urlObj.searchParams.has('justTLDR')
    );
  } catch {
    return false;
  }
}

// Handle clicking the extension icon
chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'OPEN_OPTIONS_PAGE') {
    chrome.runtime.openOptionsPage();
  }
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    try {
      // Check if this is one of our AI service URLs
      if (isValidAiUrl(tab.url)) {
        // Send message to inject-prompt script to paste text
        await chrome.tabs.sendMessage(tabId, {
          type: 'FROM_BACKGROUND',
          action: 'pasteText',
          data: {
            tabId,
            url: tab.url
          }
        });
      }
    } catch (err) {
      console.error('Error processing tab update:', err);
    }
  }
});

// Handle installation/update events
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Handle first installation
    chrome.runtime.openOptionsPage(); // Open options page on install
  } else if (details.reason === 'update') {
    // Handle extension update if needed
    const thisVersion = chrome.runtime.getManifest().version;
    console.log('Updated from', details.previousVersion, 'to', thisVersion);
  }
});
