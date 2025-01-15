import { TranscriptSegment } from "@/config/types";

export const getVideoTranscript = async (url: string) => {
  const videoId = getYoutubeVideoId(url);
  const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
  const youtubeHtml = await response.text();

  // Match URL pattern between the starting and ending markers
  const transcriptLinkPattern = /https:\/\/www\.youtube\.com\/api\/timedtext\?v.*?lang=en/;
  const match = youtubeHtml.match(transcriptLinkPattern);

  if (!match) return null;

  // Normalize the URL by replacing Unicode-escaped ampersands
  const normalizedTranscriptUrl = match[0].replace(/\\u0026/g, '&');
  const transcriptSegments = await fetchAndParseTranscript(normalizedTranscriptUrl);
  const transcript = resegmentTranscript(transcriptSegments)

  return transcript;
};

export function getYoutubeVideoId(url: string) {
  const urlObj = new URL(url);
  const videoId = urlObj.searchParams.get('v');
  if (!videoId) {
    throw new Error('Could not find video ID');
  }
  return videoId;
}

async function fetchAndParseTranscript(url: string) {
  try {
    const response = await fetch(url);
    const xmlText = await response.text();
    return parseXMLTranscript(xmlText);
  } catch (error) {
    console.error('Error fetching transcript:', error);
    return [];
  }
};

function resegmentTranscript(
  transcriptData: TranscriptSegment[],
  segmentDuration: number = 15 // seconds
): TranscriptSegment[] {
  if (!transcriptData.length) return [];

  const segments: TranscriptSegment[] = [];
  let currentSegment = {
    start: transcriptData[0].start,
    end: transcriptData[0].start + segmentDuration,
    text: [] as string[]
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
        text: currentSegment.text.join(' ').trim()
      });

      // Start new segment
      currentSegment = {
        start: currentSegment.end,
        end: currentSegment.end + segmentDuration,
        text: []
      };
    }

    // Add text to current segment
    currentSegment.text.push(section.text);
  }

  // Add the last segment if it has any text
  if (currentSegment.text.length > 0) {
    segments.push({
      start: currentSegment.start,
      end: currentSegment.end,
      text: currentSegment.text.join(' ').trim()
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
    const textNodes = xmlDoc.getElementsByTagName('text');

    // Convert to array and map to desired format
    return Array.from(textNodes).map(node => {
      const start = parseFloat(node.getAttribute('start') || '0');
      const duration = parseFloat(node.getAttribute('dur') || '0');

      return {
        start,
        text: node.textContent || '',
        end: start + duration
      };
    });
  } catch (error) {
    console.error('Error parsing transcript XML:', error);
    return [];
  }
};
