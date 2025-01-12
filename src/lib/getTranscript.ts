import { TranscriptData } from "@/config/types";

export async function fetchTranscript(url: string) {
  const videoId = getYoutubeVideoId(url);
  if (!videoId) {
    throw new Error('Could not find video ID');
  }

  try {
    const response = await fetch(`http://127.0.0.1:5000/get_transcript_fast?video_id=${videoId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch transcript');
    }
    const transcriptData =  await response.json();
    const formattedTranscript = formatTranscript(transcriptData);
    return formattedTranscript;
  } catch (error) {
    console.error('Error fetching transcript:', error);
    throw error;
  }
}

function getYoutubeVideoId(url: string) {
  const urlObj = new URL(url);
  return urlObj.searchParams.get('v');
}

function formatTranscript(data: TranscriptData) {
  const formattedTranscript = data.data.transcript.map(entry => `(${entry.start.toFixed(2)}-${entry.end.toFixed(2)}) ${entry.text}`).join('\n');
  return formattedTranscript
}
