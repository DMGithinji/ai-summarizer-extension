chrome.action.onClicked.addListener((tab) => {
  chrome.runtime.openOptionsPage();
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    try {
      const url = new URL(tab.url);

      const validUrls = {
        "claude.ai": "/new",
        "chatgpt.com": "/",
        "gemini.google.com": "/app",
      };

      const domain = url.hostname;
      const isValidUrl =
        validUrls[domain] === url.pathname &&
        url.searchParams.has("summarize-extension");
      if (isValidUrl) {
        chrome.tabs
          .sendMessage(tabId, {
            type: "FROM_BACKGROUND",
            action: "pasteText",
            data: {
              tabId: tabId,
              url: tab.url,
            },
          })
          .catch((err) => {
            console.error("Failed to send message:", err);
          });
      }
    } catch (err) {
      console.error("Error processing URL:", err);
    }
  }
});
