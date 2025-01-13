import { useCallback, useState } from "react";
import { useStorage } from "@/hooks/useStorage";
import { fetchTranscript } from "@/lib/getTranscript";
import { FloatingButton } from "./FloatingButton";
import "@/styles/index.css";
import type { DisplayMode } from "../main";
import { TranscriptSegment } from "@/config/types";
import { TranscriptTab } from "./TranscriptTab";
import { formatTimestamp } from "@/lib/utils";

interface YTSummarizerProps {
  displayMode: DisplayMode;
}

export function YTSummarizer({ displayMode }: YTSummarizerProps) {
  const { getDefaultPrompt, getAiUrl } = useStorage();
  const [transcript, setTranscript] = useState<TranscriptSegment[] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getVideoTitle = () =>
    document.querySelector("h1.ytd-video-primary-info-renderer")?.textContent ||
    "Untitled Video";

  const retrieveTranscript = useCallback(async () => {
    if (transcript || isLoading) return transcript;

    setIsLoading(true);
    setError(null);

    try {
      const newTranscript = await fetchTranscript(window.location.href);
      setTranscript(newTranscript);
      return newTranscript;
    } catch (err) {
      const errorMessage = "Failed to fetch transcript. Please try again.";
      setError(errorMessage);
      console.error("Transcript error:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [transcript, isLoading]);

  const generateSummary = useCallback(
    async (e?: React.MouseEvent) => {
      e?.stopPropagation();
      const currentTranscript = await retrieveTranscript();
      if (!currentTranscript) return;

      try {
        const [defaultPrompt, aiUrl] = await Promise.all([
          getDefaultPrompt(),
          getAiUrl(),
        ]);

        const formattedTranscript = currentTranscript
          .map(
            (entry) =>
              `(${formatTimestamp(entry.start)} - ${formatTimestamp(
                entry.end
              )}) ${entry.text}`
          )
          .join("\n");

        const processedPrompt = defaultPrompt.content.replace(
          "{{content}}",
          `Video Title: ${getVideoTitle()}\n\nTranscript:\n${formattedTranscript}`
        );

        await navigator.clipboard.writeText("");
        await navigator.clipboard.writeText(processedPrompt);

        const aiUrlWithParam = `${aiUrl}?summarize-extension`;
        window.open(aiUrlWithParam, "_blank");
      } catch (err) {
        console.error("Failed to generate summary:", err);
      }
    },
    [retrieveTranscript, getDefaultPrompt, getAiUrl]
  );

  const handleClose = useCallback(() => {
    const rootElement = document.getElementById("youtube-summarizer-root");
    if (rootElement) {
      rootElement.remove();
    }
  }, []);

  if (displayMode === "floating") {
    return <FloatingButton onCapture={generateSummary} onClose={handleClose} />;
  }

  return (
    <TranscriptTab
      error={error}
      isLoading={isLoading}
      transcript={transcript}
      generateSummary={generateSummary}
      retrieveTranscript={retrieveTranscript}
    />
  );
}
