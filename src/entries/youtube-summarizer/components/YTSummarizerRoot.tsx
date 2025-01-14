import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { YTSummarizer } from './YTSummarizer';
import useMobile from '../hooks/useMobile';
import { getCurrentVideoId } from '@/lib/utils';

export const YTSummarizerRoot: React.FC = () => {
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const isMobile = useMobile();

  // Try to mount to secondary
  const mountToSecondary = (desktopRoot: HTMLElement): boolean => {
    const secondary = document.querySelector('#secondary');
    if (secondary) {
      if (secondary.firstChild) {
        secondary.insertBefore(desktopRoot, secondary.firstChild);
      } else {
        secondary.appendChild(desktopRoot);
      }
      setMountNode(desktopRoot);
      return true;
    }
    // No #secondary element found yet
    return false;
  };

  // Handle mounting location based on mobile/desktop
  useEffect(() => {
    // Cleanup previous observer if it exists
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (isMobile) {
      const mobileRoot = document.createElement('div');
      mobileRoot.id = 'yt-summarizer-root';
      document.body.appendChild(mobileRoot);
      setMountNode(mobileRoot);

      return () => mobileRoot.remove();
    } else {
      const desktopRoot = document.createElement('div');
      desktopRoot.id = 'yt-summarizer-root';

      // Initial mount attempt
      if (!mountToSecondary(desktopRoot)) {
        // Set up observer for #secondary
        observerRef.current = new MutationObserver(() => {
          if (mountToSecondary(desktopRoot)) {
            observerRef.current?.disconnect();
          }
        });

        observerRef.current.observe(document.body, {
          childList: true,
          subtree: true
        });

        // Additional check for #secondary after a short delay
        setTimeout(() => {
          if (!mountNode && mountToSecondary(desktopRoot)) {
            observerRef.current?.disconnect();
          }
        }, 1000);

        // Cleanup if mounting fails
        const timeout = setTimeout(() => {
          if (observerRef.current) {
            observerRef.current.disconnect();
            observerRef.current = null;
          }
        }, 5000);

        return () => {
          if (observerRef.current) {
            observerRef.current.disconnect();
            observerRef.current = null;
          }
          clearTimeout(timeout);
          desktopRoot.remove();
        };
      }

      return () => desktopRoot.remove();
    }
  }, [isMobile]);

  // Additional effect to handle YouTube's dynamic loading
  useEffect(() => {
    if (!isMobile && !mountNode) {
      const checkSecondary = () => {
        const secondary = document.querySelector('#secondary');
        if (secondary && !mountNode) {
          const desktopRoot = document.createElement('div');
          desktopRoot.id = 'yt-summarizer-root';
          mountToSecondary(desktopRoot);
        }
      };

      // Check multiple times with increasing delays
      const checks = [100, 500, 1000, 2000];
      checks.forEach(delay => {
        setTimeout(checkSecondary, delay);
      });
    }
  }, [isMobile, mountNode]);

  // Update videoId when URL changes
  useEffect(() => {
    const handleNavigation = () => {
      setVideoId(getCurrentVideoId());
    };

    window.addEventListener('yt-navigate-finish', handleNavigation);
    setVideoId(getCurrentVideoId()); // Initial video ID

    return () => {
      window.removeEventListener('yt-navigate-finish', handleNavigation);
    };
  }, []);

  // Only render when we have a mount node
  return mountNode ? createPortal(
    <YTSummarizer
      key={videoId} // Force reset on video change
      displayMode={isMobile ? 'floating' : 'tab'}
    />,
    mountNode
  ) : null;
};
