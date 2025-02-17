export const captureText = async () => {
  // Select all relevant elements
  const excludedParents = "nav, aside, header, footer, button, script, style";
  const elementSelectors = [
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "p",
    "li",
    "td",
    "div:not(:empty)",
  ];

  // Combine selectors
  const selector = elementSelectors
    .map((tag) => `${tag}:not(${excludedParents}):not(${excludedParents} *)`)
    .join(", ");

  const elements = document.querySelectorAll(selector);

  // Extract and format text content
  let capturedText = "";
  for (const element of elements) {
    if (
      (element as HTMLElement).offsetHeight === 0 ||
      element.closest(excludedParents) ||
      !element.textContent?.trim()
    ) {
      continue;
    }

    const parent = element.parentElement;
    if (
      parent &&
      (parent.matches("h1, h2, h3, h4, h5, h6, div, span, p, li") ||
        parent.closest("h1, h2, h3, h4, h5, h6, div, span, p, li"))
    ) {
      continue;
    }

    let text = (element as HTMLElement).innerText.trim();
    text = text.replace(/<[^>]+>/g, "").trim();

    if (text) {
      const tag = element.tagName.toLowerCase();
      switch (tag) {
        case "h1":
          capturedText += `# ${text}\n`;
          break;
        case "h2":
          capturedText += `## ${text}\n`;
          break;
        case "h3":
          capturedText += `### ${text}\n`;
          break;
        case "h4":
        case "h5":
        case "h6":
          capturedText += `#### ${text}\n`;
          break;
        case "li":
          capturedText += `• ${text}\n`;
          break;
        default:
          capturedText += `${text}\n`;
      }
    }
  }
  return capturedText.replace(/\n{2,}/g, '\n');
};

