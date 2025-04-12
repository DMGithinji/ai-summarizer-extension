import { AiServiceId } from "@/config/types";

const SUBMIT_DELAY = 750; // ms to wait before submitting

// Editor selectors for different AI services
const EDITOR_SELECTORS = {
  [AiServiceId.CLAUDE]: 'div[contenteditable="true"].ProseMirror',
  [AiServiceId.CHATGPT]: 'div[contenteditable="true"].ProseMirror',
  [AiServiceId.GEMINI]: 'div[contenteditable="true"][class*="textarea"]',
  [AiServiceId.DEEPSEEK]: "#chat-input",
  [AiServiceId.GROK]: "textarea",
} as const;

export function getAIChatBot(url: string): AiServiceId {
  const urlObj = new URL(url);
  if (urlObj.hostname.includes("claude")) return AiServiceId.CLAUDE;
  if (urlObj.hostname.includes("chatgpt")) return AiServiceId.CHATGPT;
  if (urlObj.hostname.includes("gemini")) return AiServiceId.GEMINI;
  if (urlObj.hostname.includes("deepseek")) return AiServiceId.DEEPSEEK;
  if (urlObj.hostname.includes("grok")) return AiServiceId.GROK;

  throw new Error("Invalid chatbot url");
}

export async function pasteToEditor(
  serviceId: AiServiceId,
  text: string
): Promise<void> {
  try {
    // Get editor element
    const editor = document.querySelector(
      EDITOR_SELECTORS[serviceId]
    ) as HTMLElement | null;
    if (!editor) {
      throw new Error("Editor not found");
    }

    switch (serviceId) {
      case AiServiceId.GROK:
      case AiServiceId.DEEPSEEK: {
        // These use TextArea Element
        const textareaEditor = editor as HTMLTextAreaElement;
        textareaEditor.value = text;
        clickSubmit(textareaEditor);
        break;
      }
      case AiServiceId.GEMINI: {
        editor.textContent = text;
        clickSubmit(editor);
        const sendButton = document.querySelector(
          'button[data-testid="send-button"]'
        );
        if (sendButton) {
          (sendButton as HTMLButtonElement).click();
        }
        break;
      }
      case AiServiceId.CLAUDE:
      case AiServiceId.CHATGPT: {
        // Clear any previous text
        const placeholder = editor.querySelector("p.is-empty");
        if (placeholder) {
          editor.innerHTML = "";
        }
        // Create and insert content
        const paragraph = document.createElement("p");
        paragraph.textContent = text;
        editor.appendChild(paragraph);
        clickSubmit(editor);
        break;
      }
    }
  } catch (error) {
    console.error("Paste error:", error);
    alert("Oops! We encountered a small hiccup while trying to paste your text. Could you please try once more?");    throw new Error("Paste error");
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
