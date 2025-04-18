import { useStorage } from "@/hooks/useStorage";
import { AI_SERVICES } from "@/config/ai-services";
import { AiServiceId } from "@/config/types";

export function AISelector() {
  const { aiService, setAiService, premiumServices, setIsProUser } = useStorage();

  return (
    <div className="space-y-4 w-full">
      <h1 className="text-xl font-bold text-white">Configure AI Summary</h1>
      <p className="text-neutral-400 text-lg">
        Select which AI service to use for getting summaries.
      </p>

      <div className="flex flex-wrap sm:flex-nowrap gap-4 w-full max-w-6xl mx-auto">
      {Object.values(AI_SERVICES).map((service) => (
          <button
            key={service.id}
            onClick={() => setAiService(service.id)}
            className={`relative flex flex-col items-center p-4 bg-neutral-800/50 rounded-lg border transition-all flex-1 hover:bg-neutral-800 ${
              aiService.url === service.url
                ? "border-green-500 bg-neutral-800"
                : "border-neutral-700 hover:border-neutral-600"
            }`}
          >
            <img
              src={service.icon}
              alt={service.name}
              className="w-8 h-8 mb-2"
            />
            <span className="text-white text-base">{service.name}</span>
            {aiService.url === service.url && (
              <div className="absolute inset-0 border border-green-500/30 rounded-lg animate-pulse" />
            )}
          </button>
        ))}
      </div>

      {/* Show Premium Selection Option */}
      {[
          AI_SERVICES[AiServiceId.CHATGPT].name,
          AI_SERVICES[AiServiceId.CLAUDE].name,
          AI_SERVICES[AiServiceId.GEMINI].name,
        ].includes(aiService.name) && (
        <div className="mt-8 space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={premiumServices[aiService.id]}
              onChange={(e) => setIsProUser({ [aiService.id]: e.target.checked })}
              className="w-4 h-4 rounded cursor-pointer"
            />
            <span className="text-white text-base">{aiService.name} Plus User</span>
          </label>
          <p className="text-neutral-400 text-sm">
            {aiService.name} has a character limit on the free tier.
            <br />
            For longer content, the extension strategically samples the text to
            preserve the context and meaning.
            <br />
            If you're a plus user or the content is within the limit, the entire
            text will be used for the most comprehensive summary possible!
          </p>
        </div>
      )}
    </div>
  );
}
