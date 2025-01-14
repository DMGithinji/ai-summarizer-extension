import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TranscriptSegment } from "@/config/types";
import { formatTimestamp } from "@/lib/utils";

import { Copy, Settings, Loader2, ChevronDown, Sparkles, CopyCheck } from "lucide-react";
import { useState, useCallback } from "react";

export const TranscriptTab = ({
  error,
  isLoading,
  transcript,
  generateSummary,
  retrieveTranscript,
}: {
  error: string | null;
  isLoading: boolean;
  transcript: TranscriptSegment[] | null;
  generateSummary: (e?: React.MouseEvent) => Promise<void>;
  retrieveTranscript: () => Promise<TranscriptSegment[] | null>;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const getVideoTitle = () =>
    document.querySelector("h1.ytd-video-primary-info-renderer")?.textContent ||
    "Untitled Video";

  const handleAccordionChange = useCallback(
    async (value: string) => {
      setIsOpen(value === "transcript");
      if (value === "transcript") {
        await retrieveTranscript();
      }
    },
    [retrieveTranscript]
  );

  const copyTranscript = useCallback(
    async (e?: React.MouseEvent) => {
      e?.stopPropagation();
      const currentTranscript = await retrieveTranscript();
      if (!currentTranscript) return;

      try {
        const formattedTranscript = currentTranscript
          .map((entry) => `${formatTimestamp(entry.start)} ${entry.text}`)
          .join("\n");

        await navigator.clipboard.writeText(
          `Video Title: ${getVideoTitle()}\n\nTranscript:\n${formattedTranscript}`
        );
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy transcript:", err);
      }
    },
    [retrieveTranscript]
  );

  const openOptions = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    chrome.runtime.sendMessage({ type: "OPEN_OPTIONS_PAGE" });
  }, []);

  const handleTimestampClick = (seconds: number) => {
    // Get the video element
    const video = document.querySelector('video');
    if (video) {
      video.currentTime = seconds;
      // Optional: Scroll video into view if needed
      video.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="relative z-50 mb-4 mt-2 px-1">
      <Accordion
        type="single"
        collapsible
        className="w-full"
        onValueChange={handleAccordionChange}
      >
        <AccordionItem
          value="transcript"
          className="border-0 bg-black rounded-[8px] overflow-hidden w-full"
        >
          <AccordionTrigger className="py-1 pl-1">
            <div className="flex  items-center justify-between w-full px-4 h-14">
              <span className="text-2xl font-medium text-white">
                Transcript
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={generateSummary}
                  disabled={isLoading}
                  className="flex gap-3 items-center text-gray-300 hover:text-white transition-colors p-2 text-[14px]"
                >
                  <Sparkles className="h-[16px] w-[16px]" />
                  Summarize
                </button>
                {isOpen ? (
                  <button
                  title={copied ? "Copied!" : "Copy transcript"}
                  className="p-2 text-gray-300 hover:text-white rounded-full transition-colors"
                    onClick={copyTranscript}
                  >
                    {copied ? (
    <CopyCheck className="h-8 w-8 text-green-500" />
  ) : (
    <Copy className="h-8 w-8" />
  )}
                  </button>
                ) : (
                  <button
                    title="Extension settings"
                    className="p-2 text-gray-300 hover:text-white rounded-full transition-colors"
                    onClick={openOptions}
                  >
                    <Settings className="h-8 w-8" />
                  </button>
                )}
                <div className="text-gray-300">
                  <ChevronDown
                    className={`h-8 w-8 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>
            </div>
          </AccordionTrigger>

          <AccordionContent className="px-4 py-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-12 w-12 animate-spin text-blue-400" />
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-400">{error}</div>
            ) : transcript ? (
              <div className="text-md text-gray-200 space-y-4 max-h-[500px] overflow-y-auto">
                {transcript.map((entry, index) => (
                  <div key={index} className="flex gap-4 px-2">
                    <a onClick={() => handleTimestampClick(entry.start) } className="text-xl text-blue-600 w-12 cursor-pointer flex-shrink-0">
                      {formatTimestamp(entry.start)}
                    </a>
                    <p className="text-xl px-2">{entry.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                Click to view transcript
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
