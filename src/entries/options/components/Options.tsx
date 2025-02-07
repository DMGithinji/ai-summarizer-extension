import { AISelector } from "./AISelector";
import { ManageExcludedSites } from "./ManageExcludedSites";
import { PromptSelector } from "./PromptSelector";

export function Options() {
  return (
    <div id="summarizer-root" className="w-full h-full">
      <div className="min-h-screen w-full bg-neutral-900 text-white">
        <div className="max-w-4xl mx-auto py-8 space-y-8">
          <AISelector />
          <PromptSelector />
          <ManageExcludedSites />
        </div>
      </div>
    </div>
  );
}