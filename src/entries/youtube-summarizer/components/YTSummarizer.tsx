import { useCallback } from "react";
import { useStorage } from "@/hooks/useStorage";
import { fetchTranscript } from "@/lib/getTranscript";
import { FloatingButton } from "./FloatingButton";

export function YTSummarizer() {
  const { getDefaultPrompt, aiUrl } = useStorage();

  console.log(window.location.href);

  const captureAndNavigate = useCallback(async () => {
    try {
      const defaultPrompt = getDefaultPrompt() || { content: "" };

      // Get and process prompt
      const videoTitle =
        document.querySelector("h1.ytd-video-primary-info-renderer")
          ?.textContent || "Untitled Video";

      const transcript = await fetchTranscript(window.location.href);

      const processedPrompt = defaultPrompt.content.replace(
        "{{content}}",
        `Video Title: ${videoTitle}\n\nTranscript:\n${transcript}`
      );

      // Copy to clipboard
      await navigator.clipboard.writeText("");
      await navigator.clipboard.writeText(processedPrompt);

      // Open AI service in new tab
      const aiUrlWithParam = `${aiUrl}?summarize-extension`;
      window.open(aiUrlWithParam, "_blank");
    } catch (err) {
      console.error("Failed to capture text:", err);
    }
  }, [getDefaultPrompt, aiUrl]);

  const handleClose = useCallback(() => {
    const rootElement = document.getElementById("youtube-summarizer-root");
    if (rootElement) {
      rootElement.remove();
    }
  }, []);

  return (
    <FloatingButton onCapture={captureAndNavigate} onClose={handleClose} />
  );
}
