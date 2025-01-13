import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { TranscriptSegment } from "@/config/types";
import { formatTimestamp } from "@/lib/utils";

import { Sparkle, Copy, Settings, Loader2 } from "lucide-react";
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
      } catch (err) {
        console.error("Failed to copy transcript:", err);
      }
    },
    [retrieveTranscript]
  );

  return (
    <div className="relative z-50 mb-2 mt-2 px-1">
      <Accordion
        type="single"
        collapsible
        className="w-full"
        onValueChange={handleAccordionChange}
      >
        <AccordionItem
          value="transcript"
          className="border-0 bg-black rounded-lg overflow-hidden w-full"
        >
          <AccordionTrigger className="py-0 px-2">
            <div className="flex  items-center justify-between w-full px-4 h-14">
              <span className="text-2xl font-medium text-white">
                Transcript
              </span>

              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:text-white bg-transparent hover:bg-transparent mr-2 text-xl"
                  onClick={generateSummary}
                  disabled={isLoading}
                >
                  <Sparkle className="h-16 w-16 mr-2" />
                  Summarize
                </Button>
                <button
                  className="p-2 text-gray-300 hover:text-white rounded-full transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyTranscript();
                  }}
                >
                  {isOpen ? (
                    <Copy className="h-6 w-6" />
                  ) : (
                    <Settings className="h-6 w-6" />
                  )}
                </button>
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
                    <span className="text-xl text-gray-400 w-12 flex-shrink-0">
                      {formatTimestamp(entry.start)}
                    </span>
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
