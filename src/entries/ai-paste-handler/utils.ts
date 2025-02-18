import { AiServiceType } from "@/config/types";

const SUBMIT_DELAY = 750; // ms to wait before submitting

// Editor selectors for different AI services
const EDITOR_SELECTORS = {
  [AiServiceType.CLAUDE]: 'div[contenteditable="true"].ProseMirror',
  [AiServiceType.CHATGPT]: 'div[contenteditable="true"].ProseMirror',
  [AiServiceType.GEMINI]: 'div[contenteditable="true"][class*="textarea"]',
  [AiServiceType.DEEPSEEK]: "#chat-input",
  [AiServiceType.GROK]: "textarea",
} as const;

export function getAIChatBot(url: string): AiServiceType {
  const urlObj = new URL(url);
  if (urlObj.hostname.includes("claude")) return AiServiceType.CLAUDE;
  if (urlObj.hostname.includes("chatgpt")) return AiServiceType.CHATGPT;
  if (urlObj.hostname.includes("gemini")) return AiServiceType.GEMINI;
  if (urlObj.hostname.includes("deepseek")) return AiServiceType.DEEPSEEK;
  if (urlObj.hostname.includes("grok")) return AiServiceType.GROK;

  throw new Error("Invalid chatbot url");
}

export async function pasteToEditor(
  service: AiServiceType,
  text: string
): Promise<void> {
  try {
    // Get editor element
    const editor = document.querySelector(
      EDITOR_SELECTORS[service]
    ) as HTMLElement | null;
    if (!editor) {
      throw new Error("Editor not found");
    }

    // Uses TextArea Element
    if ((service === AiServiceType.GROK, AiServiceType.DEEPSEEK)) {
      const textareaEditor = editor as HTMLTextAreaElement;
      textareaEditor.value = text;
      clickSubmit(textareaEditor);
    }

    // Uses Quill Rich Text Editor
    if ([AiServiceType.GEMINI].includes(service)) {
      editor.textContent = text;
      clickSubmit(editor);
      const sendButton = document.querySelector('button[data-testid="send-button"]');
      if (sendButton) {
        (sendButton as HTMLButtonElement).click();
        return;
      }
      return;
    }

    // Handle Claude/ChatGPT ProseMirror editors
    // Clear any placeholder text
    const placeholder = editor.querySelector("p.is-empty");
    if (placeholder) {
      editor.innerHTML = "";
    }

    // Create and insert content
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    editor.appendChild(paragraph);
    clickSubmit(editor);
  } catch (error) {
    console.error("Paste error:", error);
    throw new Error("Paste error");
  }
}

// Submit the form using button or keyboard event
function clickSubmit(editor: HTMLElement) {
  // Trigger update events
  editor.dispatchEvent(
    new InputEvent("input", { bubbles: true, cancelable: true })
  );
  editor.dispatchEvent(
    new Event("change", { bubbles: true, cancelable: true })
  );

  setTimeout(() => {
    const enterEvent = createEnterEvent();
    editor.dispatchEvent(enterEvent);
    document.dispatchEvent(enterEvent);
  }, SUBMIT_DELAY);
}

// Create keyboard enter event
function createEnterEvent(): KeyboardEvent {
  return new KeyboardEvent("keydown", {
    key: "Enter",
    code: "Enter",
    keyCode: 13,
    which: 13,
    bubbles: true,
    cancelable: true,
    composed: true,
    shiftKey: false,
    metaKey: false,
    ctrlKey: false,
  });
}
