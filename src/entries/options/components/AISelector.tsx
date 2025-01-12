import { useStorage } from '@/hooks/useStorage';
import { AI_SERVICES } from '@/config/ai-services';

export function AISelector() {
  const { aiUrl, setAiUrl } = useStorage();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">Configure AI Summary</h1>
      <p className="text-gray-400 text-lg">
        Select which AI service to use for getting summaries.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Object.values(AI_SERVICES).map((service) => (
          <button
            key={service.type}
            onClick={() => setAiUrl(service.url)}
            className={`relative flex flex-col items-center p-4 bg-gray-800 rounded-lg border-2 transition-all ${
              aiUrl === service.url
                ? 'border-green-500 bg-gray-700'
                : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            <img
              src={service.icon}
              alt={service.name}
              className="w-8 h-8 mb-2"
            />
            <span className="text-white">{service.name}</span>
            {aiUrl === service.url && (
              <div className="absolute inset-0 border border-green-500/30 rounded-lg animate-pulse" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}