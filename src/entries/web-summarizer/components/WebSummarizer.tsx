import { useCallback, useMemo, useState } from 'react'
import { getDefaultPrompt, getSummaryServiceData, useStorage } from '@/hooks/useStorage'
import { FloatingButton } from './FloatingButton'
import { captureText } from '../utils/captureText'
import { fitTextToContextLimit } from '@/lib/adaptiveTextSampling';
import { AI_SERVICES } from '@/config/ai-services';

export function WebSummarizer() {
  const { hasLoaded, currentAi, excludedSites, updateExcludedSites } = useStorage();
  const [aiUrlName, setAiUrlName] = useState<string>(currentAi.name);
  const getCurrentAiName = useCallback(async () => {
    const { aiUrl } = await getSummaryServiceData();
    const name = Object.values(AI_SERVICES).find(ai => ai.url === aiUrl)?.name || 'ChatGPT';
    setAiUrlName(name);
  }, []);

  const showButton = useMemo(() => {
    const currentDomain = getBaseDomain();
    return !excludedSites.includes(currentDomain)
  }, [excludedSites])

  const captureAndNavigate = useCallback(async () => {
    try {
      const { characterLimit, aiUrl } = await getSummaryServiceData();
      const defaultPrompt = await getDefaultPrompt();
      const capturedText = await captureText();

      const disclaimer = 'End with a brief disclaimer that the output given is a summary of the content and doesn’t cover every detail or nuance. Add sth along the lines of "To get more insights, ask follow up questions or full watch video."'
      const content = characterLimit ? fitTextToContextLimit(capturedText) : capturedText;
      const pasteContent = `${defaultPrompt.content}${disclaimer}\n\nContent: ${content}`
      const processedPrompt = characterLimit ? fitTextToContextLimit(pasteContent, { characterLimit }) : `${pasteContent}`

      await chrome.runtime.sendMessage({
        type: 'STORE_TEXT',
        text: processedPrompt
      });

      const aiUrlWithParam = `${aiUrl}?justTLDR`
      window.open(aiUrlWithParam, '_blank')
    } catch (err) {
      console.error('Failed to capture text:', err)
    }
  }, [])

  const handleClose = useCallback(async () => {
    const rootElement = document.getElementById('web-summarizer-root')
    if (rootElement) {
      rootElement.remove()
    }
    const domain = getBaseDomain();
    await updateExcludedSites(domain);
    alert(`"Summarize with AI" button removed on ${domain}. You can re-enable it anytime in the extension settings.`)
  }, [updateExcludedSites]);

  const openOptions = useCallback(() => {
    chrome.runtime.sendMessage({ type: "OPEN_OPTIONS_PAGE" });
  }, []);

  if (!hasLoaded || !showButton) return;

  return <FloatingButton
    onCapture={captureAndNavigate}
    onClose={handleClose}
    onSettings={openOptions}
    onGetAiName={getCurrentAiName}
    aiUrlName={aiUrlName}
  />
}

function getBaseDomain() {
  const url = window.location.href;
  const { hostname, port } = new URL(url);

  if (hostname === 'localhost') {
    return port ? `localhost:${port}` : 'localhost';
  }

  return hostname.replace(/^www\./, '');
}
