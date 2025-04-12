import React, { useCallback, useState } from "react";
import { getDefaultPrompt, getSummaryServiceData } from "@/hooks/useStorage";
import {
  formatTimestamp,
  getVideoTitle,
  getVideoInfo,
} from "../utils/getVideoData";
import { FloatingButton } from "./FloatingButton";
import "@/styles/index.css";
import { TranscriptSegment, VideoInfo } from "@/config/types";
import { TranscriptTab } from "./TranscriptTab";
import { PRECONFIGURED_PROMPTS } from "@/config/prompts";
import { fitTextToContextLimit } from "@/lib/adaptiveTextSampling";

export function YTSummarizer({
  displayMode,
}: {
  displayMode: "tab" | "floating";
}) {
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [noTranscript, setNoTranscript] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const retrieveTranscript = useCallback(async () => {
    if (videoInfo || isLoading) return videoInfo;

    setIsLoading(true);
    setError(null);

    try {
      const videoData = await getVideoInfo();
      setVideoInfo(videoData);
      return videoData;
    } catch (err) {
      const errorMessage = "Failed to fetch transcript.";
      setError(errorMessage);
      console.error("Transcript error:", err);
      alert(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [videoInfo, isLoading]);

  const generateSummary = useCallback(
    async (e?: React.MouseEvent) => {
      e?.stopPropagation();
      const videoData = await retrieveTranscript();
      if (!videoData?.transcript) {
        setNoTranscript(true);
        return;
      }

      try {
        const { url, characterLimit } = await getSummaryServiceData();
        const defaultPrompt = await getDefaultPrompt();

        const title = videoData.title
          ? `Title: ${videoData.title}`
          : getVideoTitle();
        const chapters = videoData.chapters.length
          ? `Chapters:\n${videoData.chapters}\n`
          : "";
        const transcriptString = videoData.transcript
          .map((entry: TranscriptSegment) => {
            return `(${formatTimestamp(entry.start)}) ${entry.text}`;
          })
          .join(" ");

        const prompt =
          defaultPrompt?.content || PRECONFIGURED_PROMPTS[0].content;
        const disclaimer =
          'End with a brief disclaimer that the output given is a summary of the youtube video and doesn’t cover every detail or nuance.\nAdd sth along the lines of "To get more insights, ask follow up questions or watch full video."';
        const outputLangInstruction =
          "VERY VERY IMPORTANT: Your output should only be in the transcript language. If transcript is in English, output in English. If transcript is in Arabic, output in Arabic etc. Do not output in any other language.";
        const transcriptWithPrompt = `First, carefully analyze the following transcript. Then: ${prompt}\n${disclaimer}\n${outputLangInstruction}\n\n${title}\n${chapters}Transcript: "${transcriptString}"`;
        const textToSummarize =
          characterLimit && transcriptString.length > characterLimit
            ? fitTextToContextLimit(transcriptWithPrompt, { characterLimit })
            : transcriptWithPrompt;

        await chrome.runtime.sendMessage({
          type: "STORE_TEXT",
          text: textToSummarize,
        });

        const aiUrlWithParam = `${url}?justTLDR`;
        window.open(aiUrlWithParam, "_blank");
      } catch (err) {
        console.error("Failed to generate summary:", err);
      }
    },
    [retrieveTranscript]
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
      transcript={videoInfo?.transcript || []}
      generateSummary={generateSummary}
      retrieveTranscript={retrieveTranscript}
      noTranscript={noTranscript}
    />
  );
}
