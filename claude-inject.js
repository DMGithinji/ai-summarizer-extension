function waitForElement(selector) {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(mutations => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}

async function pasteToInput() {
  try {
    // Get text from clipboard
    const text = await navigator.clipboard.readText();

    // Set the value and dispatch input event
    inputElement.value = text;
    inputElement.dispatchEvent(new Event('input', { bubbles: true }));

    // Flash the textarea to indicate successful paste
    const originalBackground = inputElement.style.backgroundColor;
    inputElement.style.backgroundColor = '#e8f5e9';
    setTimeout(() => {
      inputElement.style.backgroundColor = originalBackground;
    }, 500);
  } catch (error) {
    console.error('Error pasting text:', error);
  }
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'pasteText') {
    pasteToInput();
  }
});

// If we're on a new chat page, trigger the paste
if (window.location.pathname === '/new') {
  // Wait a bit for the page to properly initialize
  setTimeout(pasteToInput, 2000);
}
