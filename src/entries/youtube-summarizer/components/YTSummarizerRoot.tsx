import { useEffect } from 'react';
import useMobile from '../hooks/useMobile';
import { ROOT_ID } from '../main';
import { YTSummarizer } from './YTSummarizer';
import { setupDesktopRoot, setupMobileRoot } from '../utils';

export const YTSummarizerRoot: React.FC = () => {
  const isMobile = useMobile();

  useEffect(() => {
    const root = document.getElementById(ROOT_ID);
    if (!root) return;

    if (isMobile) {
      setupMobileRoot(root);
    } else {
      return setupDesktopRoot(root);
    }
  }, [isMobile]);

  return (
    <YTSummarizer
      displayMode={isMobile ? 'floating' : 'tab'}
    />
  );
};

export default YTSummarizerRoot;
