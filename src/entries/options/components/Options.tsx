import { AISelector } from "./AISelector";
import { ManageExcludedSites } from "./ManageExcludedSites";
import MenuBar from "./MenuBar";
import { PromptSelector } from "./PromptSelector";

export function Options() {
  return (
    <div id="summarizer-root" className="w-full h-full relative">
      <MenuBar />
      <div className="min-h-screen w-full bg-neutral-900 text-white">
        <div className="max-w-4xl mx-auto pt-8 pb-12 px-4 space-y-8">
          <AISelector />
          <PromptSelector />
          <ManageExcludedSites />
        </div>
      </div>
    </div>
  );
}