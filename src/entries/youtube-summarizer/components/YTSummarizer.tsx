import React, { useCallback, useState } from "react";
import { useStorage } from "@/hooks/useStorage";
import { formatTimestamp, getVideoTitle, getVideoTranscript } from "../utils/getTranscript";
import { FloatingButton } from "./FloatingButton";
import "@/styles/index.css";
import { TranscriptSegment } from "@/config/types";
import { TranscriptTab } from "./TranscriptTab";
import { PRECONFIGURED_PROMPTS } from "@/config/prompts";
import { fitTextToContextLimit } from "@/lib/adaptiveTextSampling";

export function YTSummarizer({
  displayMode,
}: {
  displayMode: "tab" | "floating";
}) {
  const { getDefaultPrompt, getSummaryServiceData } = useStorage();
  const [transcript, setTranscript] = useState<TranscriptSegment[] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const retrieveTranscript = useCallback(async () => {
    if (transcript || isLoading) return transcript;

    setIsLoading(true);
    setError(null);

    try {
      const newTranscript = await getVideoTranscript(window.location.href);
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
        const {aiUrl, shouldLimitContext} = await getSummaryServiceData();
        const defaultPrompt = await getDefaultPrompt();

        const title = getVideoTitle();
        const transcriptString = currentTranscript
          .map(
            (entry) => {
              if (shouldLimitContext) return  entry.text;
              return `(${formatTimestamp(entry.start)} - ${formatTimestamp(entry.end)}) ${entry.text}`
            }
          )
          .join(" ");

        const textToSummarize = shouldLimitContext ? fitTextToContextLimit(transcriptString) : transcriptString

        const prompt = defaultPrompt?.content || PRECONFIGURED_PROMPTS[0].content;
        const disclaimer = 'End with a brief disclaimer that the output given is a summary of the youtube video and doesn’t cover every detail or nuance'
        const transcriptWithPrompt = `Carefully analyze the following transcript then, ${prompt} ${disclaimer}\n\n${title}\nTranscript: ${textToSummarize}`;

        await navigator.clipboard.writeText("");
        await navigator.clipboard.writeText(transcriptWithPrompt);

        const aiUrlWithParam = `${aiUrl}?justTLDR`;
        window.open(aiUrlWithParam, "_blank");
      } catch (err) {
        console.error("Failed to generate summary:", err);
      }
    },
    [retrieveTranscript, getDefaultPrompt, getSummaryServiceData]
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
