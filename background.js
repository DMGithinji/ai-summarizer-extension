chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.includes('claude.ai/chat')) {
    chrome.tabs.sendMessage(tabId, { action: 'pasteText' });
  }
});