const defaultPrompt = `Please provide a summary of the following content:

- First, give a concise one-sentence summary that captures the core message/theme
- Then, provide key points as bullet points (use suitable emojis for each point)
- Expound briefly on each bullet point if there's need.
- Include any notable quotes or statistics
- End with a brief "Bottom Line" takeaway

Content to analyze:
{{content}}`;

const defaultAI = "https://chatgpt.com?summarize-extension";

async function processTemplate(template, content) {
  const variables = {
    content: content,
  };

  return template.replace(/\{\{(\w+)\}\}/g, (match, variable) => {
    return variables[variable] || match;
  });
}

function createFloatingButton() {
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.bottom = "20px";
  container.style.right = "20px";
  container.style.zIndex = "9999";

  const button = document.createElement("button");
  button.className = "text-capture-btn";
  button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.75">
      <path d="M15 4L18 7" stroke-linecap="round"/>
      <path d="M8.5 15.5L2 22" stroke-linecap="round"/>
      <path d="M12.5 11.5L4.5 19.5" stroke-linecap="round"/>
      <path d="M14 6L6 14" stroke-linecap="round"/>
      <path d="M19 9L11 17" stroke-linecap="round"/>
      <path d="M20.5 3.5L22 5" stroke-linecap="round"/>
      <path d="M20 2L20.5 2.5" stroke-linecap="round"/>
      <path d="M2 9L3.5 10.5" stroke-linecap="round"/>
      <path d="M2 2L3.5 3.5" stroke-linecap="round"/>
      <path d="M9 2L10.5 3.5" stroke-linecap="round"/>
    </svg>
    <button class="close-button" title="Remove button">×</button>
  `;

  // Add tooltip to main button
  button.setAttribute("title", "Summarize with AI");

  // Add click handler for summarization
  button.addEventListener("click", captureText);

  // Add click handler for close button
  const closeButton = button.querySelector('.close-button');
  closeButton.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent triggering the main button's click event
    container.remove(); // Remove the entire container
  });

  container.appendChild(button);
  document.body.appendChild(container);
}

async function captureText() {
  try {
    // Get the configured AI service URL
    const settings = await chrome.storage.sync.get({
      aiUrl: defaultAI,
      promptTemplate: defaultPrompt,
    });

    // Select all relevant elements
    const elements = document.querySelectorAll("h1, h2, h3, h4, h5, h6, p, li");

    // Extract and format text content
    let capturedText = "";
    elements.forEach((element) => {
      const text = element.textContent.trim();
      if (text) {
        const tag = element.tagName.toLowerCase();
        // Add appropriate formatting based on tag
        switch (tag) {
          case "h1":
            capturedText += `# ${text}\n\n`;
            break;
          case "h2":
            capturedText += `## ${text}\n\n`;
            break;
          case "h3":
            capturedText += `### ${text}\n\n`;
            break;
          case "h4":
          case "h5":
          case "h6":
            capturedText += `#### ${text}\n\n`;
            break;
          case "li":
            capturedText += `• ${text}\n`;
            break;
          default:
            capturedText += `${text}\n\n`;
        }
      }
    });

    const copiedText = await processTemplate(
      settings.promptTemplate,
      capturedText
    );

    // Copy to clipboard
    await navigator.clipboard.writeText(copiedText);

    console.log({ settings });

    // Extract base URL for service name
    const serviceUrl = new URL(settings.aiUrl);
    let serviceName = "ChatGPT";
    if (serviceUrl.hostname.includes("claude")) {
      serviceName = "Claude";
    } else if (serviceUrl.hostname.includes("chatgpt")) {
      serviceName = "ChatGPT";
    } else if (serviceUrl.hostname.includes("gemini")) {
      serviceName = "Gemini";
    }

    // Ensure the summarize-extension parameter is present
    const aiUrl = settings.aiUrl.includes("summarize-extension")
      ? settings.aiUrl
      : `${settings.aiUrl}${
          settings.aiUrl.includes("?") ? "&" : "?"
        }summarize-extension`;

    // Open the configured AI service in a new tab
    window.open(aiUrl, "_blank");
  } catch (err) {
    console.error("Failed to capture text: ", err);
    showNotification("Failed to capture text. Please try again.", "error");
  }
}

// Add CSS animation for notification
const style = document.createElement("style");
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
