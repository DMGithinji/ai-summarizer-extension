import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimestamp(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

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
    return mobileTitle ? `Title: ${mobileTitle}` : "";
  } else {
    // Desktop YouTube title selector
    const desktopTitle = document.querySelector(
      "h1.ytd-video-primary-info-renderer"
    )?.textContent;
    return desktopTitle ? `Title: ${desktopTitle}` : "";
  }
};
