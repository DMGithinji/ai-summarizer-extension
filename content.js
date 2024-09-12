function createFloatingButton() {
  const button = document.createElement('button');
  button.className = 'text-capture-btn';
  button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
    </svg>
  `;

  button.addEventListener('click', captureText);
  document.body.appendChild(button);
}

async function captureText() {
  // Select all relevant elements
  const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li');

  // Extract and format text content
  let capturedText = '';
  elements.forEach(element => {
    const text = element.textContent.trim();
    if (text) {
      const tag = element.tagName.toLowerCase();
      // Add appropriate formatting based on tag
      switch (tag) {
        case 'h1':
          capturedText += `# ${text}\n\n`;
          break;
        case 'h2':
          capturedText += `## ${text}\n\n`;
          break;
        case 'h3':
          capturedText += `### ${text}\n\n`;
          break;
        case 'h4':
        case 'h5':
        case 'h6':
          capturedText += `#### ${text}\n\n`;
          break;
        case 'li':
          capturedText += `• ${text}\n`;
          break;
        default:
          capturedText += `${text}\n\n`;
      }
    }
  });

  try {
    // Copy to clipboard
    await navigator.clipboard.writeText(capturedText);

    // Open Claude in a new tab
    window.open('https://claude.ai/new', '_blank');

    // Show success message
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: #4CAF50;
      color: white;
      padding: 16px;
      border-radius: 4px;
      z-index: 10000;
      animation: fadeOut 2s forwards;
    `;
    notification.textContent = 'Text copied! Opening Claude...';
    document.body.appendChild(notification);

    // Remove notification after animation
    setTimeout(() => {
      notification.remove();
    }, 2000);
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
}

// Add CSS animation for notification
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeOut {
    0% { opacity: 1; }
    70% { opacity: 1; }
    100% { opacity: 0; }
  }
`;
document.head.appendChild(style);

// Initialize the floating button
createFloatingButton();