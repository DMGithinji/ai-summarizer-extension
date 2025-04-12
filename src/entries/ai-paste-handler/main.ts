import { AiServiceId } from "@/config/types";
import { getAIChatBot, pasteToEditor } from "./utils";

interface PasteMessage {
  type: "FROM_BACKGROUND";
  action: "pasteText";
  data: {
    tabId: number;
    url: string;
  };
}

// Main message handler
chrome.runtime.onMessage.addListener((message: PasteMessage) => {
  if (message.type === "FROM_BACKGROUND" && message.action === "pasteText") {
    const chatbot = getAIChatBot(message.data.url);

    // Add a small delay to ensure editor is ready
    setTimeout(async () => {
      const prompt = await chrome.runtime.sendMessage({ type: "RETRIEVE_TEXT" });
      if (!prompt?.text) {
        throw new Error("No text found for transfer");
      }
      await pasteToEditor(chatbot, prompt.text);
    }, chatbot === AiServiceId.GROK ? 1500 : 500);
  }
});
