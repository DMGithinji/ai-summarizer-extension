import { useStorage } from '@/hooks/useStorage';
import { AI_SERVICES } from '@/config/ai-services';

export function AISelector() {
  const { aiUrl, setAiUrl } = useStorage();

  return (
    <div className="space-y-4 w-full">
      <h1 className="text-2xl font-bold text-white">Configure AI Summary</h1>
      <p className="text-neutral-400 text-lg">
        Select which AI service to use for getting summaries.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full">
        {Object.values(AI_SERVICES).map((service) => (
          <button
            key={service.type}
            onClick={() => setAiUrl(service.url)}
            className={`relative flex flex-col items-center p-4 bg-neutral-800/50 rounded-lg border transition-all flex-1 hover:bg-neutral-800 ${
              aiUrl === service.url
                ? 'border-green-500 bg-neutral-800'
                : 'border-neutral-700 hover:border-neutral-600'
            }`}
          >
            <img
              src={service.icon}
              alt={service.name}
              className="w-8 h-8 mb-2"
            />
            <span className="text-white text-[18px]">{service.name}</span>
            {aiUrl === service.url && (
              <div className="absolute inset-0 border border-green-500/30 rounded-lg animate-pulse" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}