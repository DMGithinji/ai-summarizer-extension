import { useState, useCallback, useRef, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Spinner from "@/components/ui/spinner";
import {
  Copy,
  Settings,
  ChevronDown,
  CopyCheck,
  ScrollText,
  Crosshair,
} from "lucide-react";
import { TranscriptSegment, VideoInfo } from "@/config/types";
import { formatTimestamp } from "../utils/getVideoData";
import AiSelectButton from "./SummarizeButton";

export const TranscriptTab = ({
  error,
  isLoading,
  transcript,
  generateSummary,
  retrieveTranscript,
  noTranscript
}: {
  error: string | null;
  isLoading: boolean;
  transcript: TranscriptSegment[];
  generateSummary: (e?: React.MouseEvent) => Promise<void>;
  retrieveTranscript: () => Promise<VideoInfo | null>;
  noTranscript?: boolean
}) => {
  const accordionContentRef = useRef<HTMLDivElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const getVideoTitle = () =>
    document.querySelector("h1.ytd-video-primary-info-renderer")?.textContent ||
    "Untitled Video";

  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fixes issue where element is embedded on DOM while content is loading
  // Hacky: during loading phase, the secondary element's width has no max width
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        setIsVisible(width <= 450);
        if (isVisible) {
          resizeObserver.disconnect();
        }
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  const handleAccordionChange = useCallback(
    async (value: string) => {
      setIsOpen(value === "transcript");
      // Set max height of content as always equal to video
      const ytPlayer = document.querySelector(".style-scope.ytd-player");
      if (ytPlayer && accordionContentRef.current) {
        const height = ytPlayer.getBoundingClientRect().height;
        const adjustedHeight = height - 60;
        accordionContentRef.current.style.maxHeight = `${adjustedHeight}px`;
      }
      if (value === "transcript" && !error) {
        await retrieveTranscript();
      }
    },
    [error, retrieveTranscript]
  );

  useEffect(() => {
    if (!!error && !isOpen && triggerRef.current) {
      triggerRef.current?.click();
    }
  }, [error, isOpen, handleAccordionChange]);

  const copyTranscript = useCallback(
    async (e?: React.MouseEvent) => {
      e?.stopPropagation();
      const videoInfo = await retrieveTranscript();
      const currentTranscript = videoInfo?.transcript;

      if (!currentTranscript) return;

      try {
        const formattedTranscript = currentTranscript
          .map((entry) => `${formatTimestamp(entry.start)} ${entry.text}`)
          .join("\n");

        await navigator.clipboard.writeText(
          `Video Title: ${getVideoTitle()}\n\nTranscript:\n${formattedTranscript}`
        );
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
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
    const video = document.querySelector("video");
    if (video) {
      video.currentTime = seconds;
      video.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const scrollToCurrentTime = useCallback(() => {
    const video = document.querySelector("video");
    if (!video || !transcript || !transcriptRef.current) return;

    const currentTime = video.currentTime;

    // Find the current segment and its index
    const currentIndex = transcript.findIndex((segment, index) => {
      const nextSegment = transcript[index + 1];
      return (
        currentTime >= segment.start &&
        (!nextSegment || currentTime < nextSegment.start)
      );
    });

    if (currentIndex === -1) return;

    // Get the element directly by index
    const segmentElements = transcriptRef.current.children;
    const segmentElement = segmentElements[currentIndex];

    if (segmentElement) {
      segmentElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      // Add highlight to current segment
      segmentElement.classList.add("bg-blue-500/20");
      // Remove highlight after 5 seconds
      setTimeout(() => {
        segmentElement.classList.remove("bg-blue-500/20");
      }, 5000);
    }
  }, [transcript]);

  return (
    <div
      ref={containerRef}
      className="relative z-50 mb-4 px-1 max-w-[500px]"
      style={{ visibility: isVisible ? "visible" : "hidden" }}
    >
      <Accordion
        type="single"
        collapsible
        onValueChange={handleAccordionChange}
      >
        <AccordionItem
          value="transcript"
          className="border-0 bg-neutral-800/60 rounded-[8px] overflow-hidden w-full"
        >
          <AccordionTrigger ref={triggerRef} className="py-1 pl-1">
            <div className="flex  items-center justify-between w-full px-4 h-14">
              <div className="flex items-center gap-3">
                <ScrollText className="text-white h-[18px] w-[18px]" />
                <span className="text-2xl font-semibold text-white">
                  Transcript
                </span>
              </div>

              <div className="flex items-center gap-3">
                <AiSelectButton
                  loading={isLoading}
                  onSummarize={generateSummary}
                  noTranscript={noTranscript}
                />
                {isOpen ? (
                  <button
                    title="Go to current timestamp"
                    className="p-2 text-gray-300 hover:text-white rounded-full transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      scrollToCurrentTime();
                    }}
                  >
                    <Crosshair className="h-6 w-6" />
                  </button>
                ) : null}
                {isOpen ? (
                  <button
                    title={copied ? "Copied!" : "Copy transcript"}
                    className="p-2 text-gray-200 hover:text-white rounded-full transition-colors"
                    onClick={copyTranscript}
                  >
                    {copied ? (
                      <CopyCheck className="h-7 w-7 text-blue-500" />
                    ) : (
                      <Copy className="h-7 w-7" />
                    )}
                  </button>
                ) : (
                  <button
                    title="Extension settings"
                    className="p-2 text-gray-200 hover:text-white rounded-full transition-colors"
                    onClick={openOptions}
                  >
                    <Settings className="h-7 w-7" />
                  </button>
                )}
                <div className="text-gray-300">
                  <ChevronDown
                    className={`h-8 w-8 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                      }`}
                  />
                </div>
              </div>
            </div>
          </AccordionTrigger>

          <AccordionContent className="px-4 py-4">
            <div ref={accordionContentRef} className="overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Spinner size="lg" />
                </div>
              ) : error ? (
                <div className="flex flex-col justify-center py-3">
                  <p className="text-center text-lg text-red-400 px-4">{error}</p>
                  <div className="pt-4 flex justify-center">
                    <button className="text-lg p-2 text-orange-400 hover:text-orange-500 rounded-full transition-colors shadow" onClick={retrieveTranscript}>Try again</button>
                  </div>
                </div>
              ) : transcript?.length > 0 ? (
                <div
                  ref={transcriptRef}
                  className="text-md text-gray-200 space-y-4"
                >
                  {transcript.map((entry, index) => (
                    <div
                      key={index}
                      data-index={index}
                      className="flex gap-3 px-2 transition-all duration-300" // Add transition
                    >
                      <a
                        title="Jump to timestamp"
                        onClick={() => handleTimestampClick(entry.start)}
                        className="text-[14px] leading-[1.5] underline w-16 cursor-pointer flex-shrink-0"
                      >
                        {formatTimestamp(entry.start)}
                      </a>
                      <p className="pl-1 text-[14px] leading-[1.4] flex-1">
                        {entry.text}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col justify-center py-3">
                  <p className="text-center text-lg text-red-400 px-4">Oops! Something went wrong.<br />Please reload and try again or report the issue.</p>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
