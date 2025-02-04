import { useCallback, useState } from 'react'
import { getDefaultPrompt, getSummaryServiceData, useStorage } from '@/hooks/useStorage'
import { FloatingButton } from './FloatingButton'
import { captureText } from '../utils/captureText'
import { fitTextToContextLimit } from '@/lib/adaptiveTextSampling';
import { AI_SERVICES } from '@/config/ai-services';

export function WebSummarizer() {
  const { currentAi } = useStorage();
  const [aiUrlName, setAiUrlName] = useState<string>(currentAi.name);
  const getCurrentAiName = useCallback(async () => {
    const { aiUrl } = await getSummaryServiceData();
    const name = Object.values(AI_SERVICES).find(ai => ai.url === aiUrl)?.name || 'ChatGPT';
    setAiUrlName(name);
  }, []);


  const captureAndNavigate = useCallback(async () => {
    try {
      const { shouldLimitContext, aiUrl } = await getSummaryServiceData();

      // Get and process prompt
      const defaultPrompt = await getDefaultPrompt();
      const capturedText = await captureText();

      const disclaimer = 'End with a brief disclaimer that the output given is a summary of the content and doesn’t cover every detail or nuance'
      const content = shouldLimitContext ? fitTextToContextLimit(capturedText) : capturedText;
      const pasteContent = `${defaultPrompt.content}${disclaimer}\n\nContent: ${content}`
      const processedPrompt = shouldLimitContext ? fitTextToContextLimit(pasteContent) : `${pasteContent}`

      // Copy to clipboard
      await navigator.clipboard.writeText('')
      await navigator.clipboard.writeText(processedPrompt)

      // Open AI service in new tab
      const aiUrlWithParam = `${aiUrl}?justTLDR`
      window.open(aiUrlWithParam, '_blank')
    } catch (err) {
      console.error('Failed to capture text:', err)
    }
  }, [])

  const handleClose = useCallback(() => {
    const rootElement = document.getElementById('web-summarizer-root')
    if (rootElement) {
      rootElement.remove()
    }
  }, [])

  return <FloatingButton
    onCapture={captureAndNavigate}
    onClose={handleClose}
    onGetAiName={getCurrentAiName}
    aiUrlName={aiUrlName}
  />
}
