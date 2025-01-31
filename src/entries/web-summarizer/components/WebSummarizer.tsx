import { useCallback } from 'react'
import { useStorage } from '@/hooks/useStorage'
import { FloatingButton } from './FloatingButton'
import { captureText } from '../utils/captureText'

export function WebSummarizer() {
  const { getDefaultPrompt, aiUrl } = useStorage();

  const captureAndNavigate = useCallback(async () => {
    try {
      // Get and process prompt
      const defaultPrompt = await getDefaultPrompt();
      const capturedText = await captureText()
      const processedPrompt = `${defaultPrompt.content}\n\nContent: ${capturedText}`

      // Copy to clipboard
      await navigator.clipboard.writeText('')
      await navigator.clipboard.writeText(processedPrompt)

      // Open AI service in new tab
      const aiUrlWithParam = `${aiUrl}?summarize-extension`
      window.open(aiUrlWithParam, '_blank')
    } catch (err) {
      console.error('Failed to capture text:', err)
    }
  }, [getDefaultPrompt, aiUrl])

  const handleClose = useCallback(() => {
    const rootElement = document.getElementById('web-summarizer-root')
    if (rootElement) {
      rootElement.remove()
    }
  }, [])

  return <FloatingButton onCapture={captureAndNavigate} onClose={handleClose} />
}
