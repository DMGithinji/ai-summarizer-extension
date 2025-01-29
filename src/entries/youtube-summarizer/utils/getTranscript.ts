import { TranscriptSegment } from "@/config/types";

export const getVideoTranscript = async (url: string) => {
  const videoId = getYoutubeVideoId(url);

  const isMobileYouTube = window.location.hostname === "m.youtube.com";
  const baseUrl = isMobileYouTube
    ? "https://m.youtube.com"
    : "https://www.youtube.com";
  const videoUrl = `${baseUrl}/watch?v=${videoId}`;

  const response = await fetch(videoUrl, {
    mode: "same-origin",
    credentials: "include",
    headers: {
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.5",
      ...(isMobileYouTube && {
        "User-Agent": navigator.userAgent,
        "X-Requested-With": "XMLHttpRequest",
      }),
    },
  });

  if (!response.ok) {
    throw new Error("Transcript query failed. Failed to fetch video page");
  }

  const youtubeHtml = await response.text();

  // Match URL pattern between the starting and ending markers
  const transcriptLinkPattern =
    /(?:https:\/\/(?:www|m)\.youtube\.com)?\/api\/timedtext\?[^"']+lang=en[^"']*/;
  const match = youtubeHtml.match(transcriptLinkPattern);

  if (!match) return null;

  let transcriptUrl = match[0];

  // If it's a relative URL (like when on mobile), use the same domain we made the original request to
  if (transcriptUrl.startsWith("/")) {
    transcriptUrl = `${baseUrl}${transcriptUrl}`;
  }
  // Normalize the URL by replacing Unicode-escaped ampersands
  transcriptUrl = match[0].replace(/\\u0026/g, "&");

  const xmlText = await fetchXMLTranscript(transcriptUrl, isMobileYouTube);
  const transcriptSegments = parseXMLTranscript(xmlText);
  const transcript = resegmentTranscript(transcriptSegments);

  return transcript;
};

export function getYoutubeVideoId(url: string) {
  const urlObj = new URL(url);
  const videoId = urlObj.searchParams.get("v");
  if (!videoId) {
    throw new Error("Could not find video ID");
  }
  return videoId;
}

async function fetchXMLTranscript(
  normalizedTranscriptUrl: string,
  includeAgent: boolean
) {
  try {
    const transcriptResponse = await fetch(normalizedTranscriptUrl, {
      mode: "same-origin",
      credentials: "include",
      headers: {
        Accept: "*/*",
        "Accept-Language": "en-US,en;q=0.5",
        ...(includeAgent && {
          "User-Agent": navigator.userAgent,
          "X-Requested-With": "XMLHttpRequest",
        }),
      },
    });

    if (!transcriptResponse.ok) {
      throw new Error("Failed to fetch transcript");
    }
    return await transcriptResponse.text();
  } catch (error) {
    throw Error(`Error fetching transcript: ${error}`);
  }
}

function resegmentTranscript(
  transcriptData: TranscriptSegment[],
  segmentDuration: number = 15 // seconds
): TranscriptSegment[] {
  if (!transcriptData.length) return [];

  const segments: TranscriptSegment[] = [];
  let currentSegment = {
    start: transcriptData[0].start,
    end: transcriptData[0].start + segmentDuration,
    text: [] as string[],
  };

  for (const section of transcriptData) {
    const startTime = section.start;

    // If the current section starts beyond current segment's end,
    // save current segment and start a new one
    if (startTime >= currentSegment.end) {
      // Join the accumulated text and add to segments
      segments.push({
        start: currentSegment.start,
        end: currentSegment.end,
        text: currentSegment.text.join(" ").trim(),
      });

      // Start new segment
      currentSegment = {
        start: currentSegment.end,
        end: currentSegment.end + segmentDuration,
        text: [],
      };
    }

    // Add text to current segment
    const cleanedText = section.text.replace(/&#39;/g, "'");
    currentSegment.text.push(cleanedText);
  }

  // Add the last segment if it has any text
  if (currentSegment.text.length > 0) {
    segments.push({
      start: currentSegment.start,
      end: currentSegment.end,
      text: currentSegment.text.join(" ").trim(),
    });
  }

  return segments;
}

const parseXMLTranscript = (xmlText: string) => {
  try {
    // Create a DOM parser
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");

    // Get all text nodes
    const textNodes = xmlDoc.getElementsByTagName("text");

    // Convert to array and map to desired format
    return Array.from(textNodes).map((node) => {
      const start = parseFloat(node.getAttribute("start") || "0");
      const duration = parseFloat(node.getAttribute("dur") || "0");

      return {
        start,
        text: node.textContent || "",
        end: start + duration,
      };
    });
  } catch (error) {
    console.error("Error parsing transcript XML:", error);
    return [];
  }
};

export const getCurrentVideoId = (): string | null => {
  const url = new URL(window.location.href);

  // Both mobile and desktop YouTube use 'v' parameter for regular videos
  const videoId = url.searchParams.get('v');
  if (videoId) return videoId;

  // Handle YouTube Shorts format (only on desktop)
  if (window.location.hostname !== 'm.youtube.com' && url.pathname.startsWith('/shorts/')) {
    const shortsId = url.pathname.split('/')[2];
    if (shortsId) return shortsId;
  }

  return null;
};

export const getVideoTitle = (): string => {
  if (window.location.hostname === 'm.youtube.com') {
    // Mobile YouTube title selector
    const mobileTitle = document.querySelector(
      'h2.slim-video-information-title.slim-video-metadata-title-modern .yt-core-attributed-string'
    )?.textContent;
    return mobileTitle ? `Video Title: ${mobileTitle}` : "";
  } else {
    // Desktop YouTube title selector
    const desktopTitle = document.querySelector(
      "h1.ytd-video-primary-info-renderer"
    )?.textContent;
    return desktopTitle ? `Video Title: ${desktopTitle}` : "";
  }
};


export function formatTimestamp(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${hours ? `${hours.toString()}:` : ''}${minutes
    .toString()
    .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}
