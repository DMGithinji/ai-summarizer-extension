import { AISelector } from './AISelector';
import { PromptSelector } from './PromptSelector';

export function Options() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <AISelector />
        <PromptSelector />
      </div>
    </div>
  );
}
