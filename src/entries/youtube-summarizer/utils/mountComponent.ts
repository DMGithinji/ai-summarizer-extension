export const setupMobileRoot = (root: HTMLElement) => {
  root.style.position = "fixed";
  root.style.bottom = "20px";
  root.style.right = "20px";
  root.style.zIndex = "999999";

  // Ensure it's in the body
  if (root.parentElement !== document.body) {
    document.body.appendChild(root);
  }
};

export const setupDesktopRoot = (root: HTMLElement) => {
  resetRootStyles(root);

  const observer = new MutationObserver((_, obs) => {
    if (mountToSecondaryContainer(root)) {
      obs.disconnect();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Cleanup observer after 5 seconds if mounting hasn't succeeded
  const observerTimeout = setTimeout(() => observer.disconnect(), 5000);

  return () => {
    observer.disconnect();
    clearTimeout(observerTimeout);
  };
};

const resetRootStyles = (root: HTMLElement) => {
  root.style.position = "";
  root.style.bottom = "";
  root.style.right = "";
  root.style.zIndex = "";
};

/**
 * Mounts the root to the secondary container if possible.
 * 
 * This is the container above the suggested play-next videos
 */
const mountToSecondaryContainer = (root: HTMLElement): boolean => {
  const secondary = document.querySelector(
    "div#secondary.style-scope.ytd-watch-flexy"
  );

  if (secondary) {
    if (secondary.firstChild) {
      secondary.insertBefore(root, secondary.firstChild);
    } else {
      secondary.appendChild(root);
    }
    return true;
  }
  return false;
};
