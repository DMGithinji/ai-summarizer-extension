const defaultPrompt = `Please provide a summary of the following content:

- First, give a concise one-sentence summary that captures the core message/theme
- Then, provide key points as bullet points (use suitable emojis for each point)
- Expound briefly on each bullet point if there's need.
- Include any notable quotes or statistics
- End with a brief "Bottom Line" takeaway

Content to summarize:
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
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <rect width="34" height="34" fill="url(#pattern0_35043_214)"/>
      <defs>
      <pattern id="pattern0_35043_214" patternContentUnits="objectBoundingBox" width="1" height="1">
      <use xlink:href="#image0_35043_214" transform="scale(0.0104167)"/>
      </pattern>
      <image id="image0_35043_214" width="96" height="96" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAALwUlEQVR4nO1dC6wcVRme+kJRfKKx4iPiK4iKivgKWhRK791zZv5/KovRRNEobYIaBSG+vRAS8UF5iCItoKL4utz9z94L8iiGVkQDUlONpQ80ELVQLGhrb4vVUq/5z8xtd/+ZnZ3ZnZ19fskkN3tn5/zzn3P+87/XcfoM7rR7tCa8WBFu0IS7+eK/FeFFXtV7dbfpG1iUJ8tP0gYuUwYe0wbn4q7gf3DJsSuXPbHb9A4e8wlvbcT4mIm4ZTQJOUIbuCwt8w9ecEmeNAwt3Gn3aCl2FOE9qup5XtU7jC+XELSBjXUTQLivRHhUt+nve2jCiyXzx24ce7q876TJ8jOUgU1CFK3oDtUDBEV4Ty1TebU3vLfq+UIM/bFYagcQinBXLVNZ5DS6l3eG2C27iqV2AKEI769h6H1J94KBZ4oJ2FEcpQMKTTiuCbeG13jivQbeIw7i9cVROuQ4ebL8bEX4J7EDvtFtuoYCeka/2LomhFU8UkMLQInwKEX4QIw1/PUixh9qeFXvMEW4OYb5Ny763mlP7jZ9Aw9t4PII8wl/NPIDFSX3DfxHTMBKZ85ZUMT4Qw9N+IUYF8UhQ8+YoqAJbxNuh4+OmJ8jxir+C5WBkiL8JLuWlYGqMvCbwOsJDyoD+2snoDS19CW135+YmHgcf18bwDHCl41EUwIWrVn0hFLVe4sm/Kw2cJMifDir/5+fUbdDDPxQWMX/UoS/0IRfLlW9d5Yny48f6h1Tniw/xfrxCa/RhP/MHnCpv+Tq1wb+2yRq9ndl4DulqveuoZqMcQOvtbFdwh3tMr3RBDA04Z1pv6sIH1IGvsXBH2dQ4Vb8xdGDExtfnO1g4A5FeKUi/JxLeKoy8A5V8V/jVb0XNJuAscnyc5WBCzThmtQ7jPB/ysBqt+K/2xkUaMJF2sBdKVbhDm2gog0sZyY3EwvNJkCCD2LXwIe0ge/zim9Kj4G1JQNvd/oV7rT70oChiS/5iDawShs4Masc5thA2jiBhD0jCN+mCS/UBrYl7Qht4FrecU6/gF+uZOATysBswov9Wht4P6ebtDqOVTFTxgmSwNoTB/ithpSwO1XV+6DT6yhNlp+fLOfhJrfiv9XpUaiKf4winApWfuxETMUlBPQENOHxbCA1IPzufpKnyuCxwS6NXURbek5b0gbeG+MYY2J38qHKYsnpM0ywJc1WOOefxokkAyc4vQBF+HHpFgjl/G3ssXT6HC4rE3FpkYR7XULdVeLYARaRl4EufV4/rvqGmHMWsPc1stAI95Yq/pjTDXAGQiRl0MCjquqd4gwoFGtLBh6VBqOu+G8s3p0gZSPh7oGyIBuArfHgbKt7961LKv5CpwgE2WfwZ3HY/psJc4YEil0i0Z1wayFiVxFeIcTOfkV+2RkyuIQQOROq3pmd9+uIQ5cPXGdIoQycK3gxCwZe1JnR5pwFysDvxIC/GipferxP6XbBkx87nQCLGamC2VDfkENNLX1F7XnAYqkjlrI2uE7M9AW5D9Kn0IRfFUrJtbkOMF713iRM8V1ckZLrIH2MIC2+RjUl3Ktn9OH51OFyBoJI/+Oa3KyZy66BjyjCGfusg/W9m/kz+78b1LOcgsBj5U0PZ24Id8U6G/hJW8ecpg53/kpbEG197QY+nSb+q/gewrNkdkOe6CQ9zJOmzzTwmDJwaSR1MlsdLmxMQ9DiWxY/lZNk0z0Taw/3n/N3W+RxIj387E7SE6nUbDwRq+smIVMdbgpjI1TPbs78subAS9+cp1VZFD28Y9I+k3dCqjrc0PWAmvCb7NtPk2HG2zxmSz+kDZzN+fx6Rh/KV4n/NnA25+i0MtFpkQs9hGc1GyfMR1oe8gqZd43qmJnnVpSnrcNNi/Jk+WnawD8E8XfyQdzoO0j4HJk5wQH7PERRXvTwM/hZrdIRW8fMykyWOtw0sCtAMJJjxc2+t6TiLwyyJOoIPL0dWnqNHitJ6p+3IVMdbspB6lNRCCda9a1owuvaoaXX6GHeisUwm/sE1Nb12kEq/jEZCHyDWCGZ8n16nR45AWwjOLK6sF0RpAj31A0yow/NpCoaQWCb6CV6OFoYJ4IuEofNxnbcDL30wr1EDx/sivCvkUOYVaGY2O4mbnzB2hBPxrwaqgwua6aGyi1fMvD6XhJBpQ7SExSF4DLLq6rnW21qRh/OWYA2g69+Mvcd8CbH+DGSDIhPNXnhKXH/uamZZeC8vA/hIulh2yUDHw/SwWYxt/lK9UWWW4lE4zIx0CNpAtZLKv5Cqa/noYYWSY9U6RtfcHXEsuZJsDuBcF+zB3hV71VZDR/ejr1kiGHO9KRxxgV1CnBGIsHhmbCCmx0FGc6wjbuOZOlEFecTseY94Tns+uAX4csNXN/nxJn+zURdFuRBTzPXSJIYD2sflres3Kjr1RH1OwN2JgUc8nB+OTkWXHfaGedX/OdxEWCCyLmr7ZfQhCRm9dsdcf8auKGn3NEp6OFiP8GbOs2Lx237BXTFP048dF+zwAwHM3j7pw6AVL0zOx2Q4THypIfLqerU+CCK+BXBq2tyeYHILjCwNg3DOLynq96HNeG0tTEMzIbXJi7A5v8VHZK0YwbF3y3TEy6wurQUy3xb+pT+zMxUvR6RdYQXOkMKHXXlP2wn18BkHY8q/sdyrQeIbNd+qJ/KGda6jfLBZobH9C/Nr5gj7MFwh9gFu7n83xkSKAMnSB8T1zPP2x0yZ5S1pFwJ4ICGIvyLIGCPMrDEGXBowvFIZrSBLfPRsqBWru5/2ztCiDvtvk7GEjghiZ1QuY5DNp663fZ2qHpeq5/ngRLh0mgtHDyoppYeOX8PV/WLhWmcTiGs1a1zXViVjHAir6RdVduQj3Brq5+3A34Xdp5Fc6ZgpwzwRMRzngdwHEoVX0V87sHL/5K1pnafr8VzW/28VXC6eVTVDNIzZVGK9fmLSRonfKXTaXANcMThdbAVwQfayfHRXZqAsEz1tLj30gb+FhfatEWLwiJ2ioJ14tX0bxCE3N1qCZNq0BMi6+fZG4zUZ4PX7Oz17BuLpdXAb8UCPN8pEhxBU4Q/iCU8LPXnKvQ8ekKojJ+nzgIX1r6g/6pGuUEyesaVRO60+3KnGwiCz3Fb98C1jgMli3qguSrnxdrik4TcWM6ia5asoAz8TEzA7cW9RSMXNvfmiauiPyhLtwV+dDixyGarNgJY9U7i/Myk3kFBASJ+NymLjsFx5kgTQcKlTs90IDGwOmE3zB1Q6Qh/yrunE+We9lCteqfwGJE63/hVP8OezlTvKMO53Da/1xrI8opjv3jyjsCOFbrxM1OMu59b6rA1m/q5VlOqf067uVUdBVuN3Ndf5l1qwYjkSnVcaR1e85Ut7EYmvCJJ02oiCrdrwq/VWrSp3uV6dUQktkC4pudWfxz4AHa52JnwStk2jK1JeT/LYY4npBAdJk5mSws1TE+/OkwjP6SVtpuRwD3hnq5pPm3HbCv+cZrwi8rA5yUDw6yylCkfQeqMzHpgPz0/245B+OZ2zpkwxnxdKzUEfQlFaNIyv0asVDpBi42Cya684aE9UC166t0ckZXGvUCPn69s4b85PBo5DHPuTxcG9iNiUBH+od2s8p6FIrxKqnhxNkOYWPZ7sQtW5UUH9wSK+7UO9gvJxuEDBW3gXqHiNWwTxv5/sTI3tzt+GOE63xZfR5l/70AznyFd3dyS2ElKkMopnZz9Wtz/tGFjV8L1aUqdBm4C/IT4qpwADh1mORj5PAl/c2BVUuNZTkpjNdQZBmgDW8S2d9OKoHASZsNOvZfbxnuEp7PzzSV8HzsElYHPWHuA74kVM3WMf6CnrdyiDuFyTMvjsNWCOITzucKkrS91ImWy56G5yXaUIWvZ7TCf1cwpMRwCzZ3xhPez8ZZ7Wkm/QScESRKYd19rPxIBG9lNzb93MJCGVSvAwBWxoRVXhP3dAMJTw7z/FUHEjlMH4SfWqWeLFOEMZnijUOMITujLSeOSIKQiE32HDop7dtrWmbBx3h1txQZ/lsGPP8III4wwwggjjDCC00X8H1Vmjv/Gr9X9AAAAAElFTkSuQmCC"/>
      </defs>
    </svg>
    <button class="close-button" title="Remove button">×</button>
  `;

  // Add tooltip to main button
  button.setAttribute("title", "Summarize with AI");

  // Add click handler for summarization
  button.addEventListener("click", captureText);

  // Add click handler for close button
  const closeButton = button.querySelector(".close-button");
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

    await navigator.clipboard.writeText('');
    await navigator.clipboard.writeText(copiedText);

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
      : `${settings.aiUrl}${settings.aiUrl.includes("?") ? "&" : "?"
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
