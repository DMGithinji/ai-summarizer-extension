import { getTranscript, getYoutubeHtml } from "./youtubeRequests.";
import { extractBasicInfo } from "./metadataExtractor";

export const getVideoInfo = async () => {
  const url = window.location.href;
  const videoId = getYoutubeVideoId(url);
  const youtubeHtml = await getYoutubeHtml(videoId)
  const basicInfo = extractBasicInfo(youtubeHtml);
  const transcript = await getTranscript(youtubeHtml);
  return {
    ...basicInfo,
    transcript
  }
}

function getYoutubeVideoId(url: string) {
  const urlObj = new URL(url);
  const videoId = urlObj.searchParams.get("v");
  if (!videoId) {
    throw new Error("Could not find video ID");
  }
  return videoId;
}

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
