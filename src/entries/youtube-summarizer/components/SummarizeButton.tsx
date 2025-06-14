import { useEffect, useRef, useState } from "react";
import { ChevronDown, Sparkles, Check } from "lucide-react";
import Spinner from '@/components/ui/spinner';
import { AI_SERVICES } from '@/config/ai-services';
import { useStorage } from '@/hooks/useStorage';

const AiSelectButton = ({
  onSummarize,
  noTranscript,
  loading,
}: {
  onSummarize: (e: React.MouseEvent) => Promise<void>,
  noTranscript?: boolean
  loading: boolean
}) => {
  const { aiService, setAiService } = useStorage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-flex" ref={dropdownRef}>
      <div className="inline-flex h-11 items-stretch rounded-md hover:bg-neutral-800/50 font-medium transition-colors">
        {/* Main Button Section */}
        <button
          title={noTranscript ? 'No transcript found' : `Summarize with ${aiService?.name}`}
          onClick={onSummarize}
          disabled={loading}
          className="flex gap-3 items-center px-4 text-neutral-100 hover:text-white transition-colors text-[14px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {
            loading ? <Spinner size="sm" /> : <Sparkles size={16} />
          }
          <span>Summarize</span>
        </button>

        {/* Divider */}
        <div className="h-full w-[1px] bg-neutral-700/50" />

        {/* Dropdown Trigger */}
        <button
          title='Select AI Provider'
          onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen) }}
          className="px-2 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
        >
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="fixed z-[9999] min-w-[140px] py-1 rounded-md border border-neutral-700 bg-neutral-900 shadow-lg"
          style={{
            top: dropdownRef.current ?
              `${dropdownRef.current.getBoundingClientRect().bottom + 4}px` : '0',
            left: dropdownRef.current ?
              `${dropdownRef.current.getBoundingClientRect().left}px` : '0'
          }}
        >
          {Object.values(AI_SERVICES).map((ai) => (
            <button
              key={ai.name}
              onClick={(e) => {
                e.stopPropagation();
                setAiService(ai.id);
                setIsOpen(false);
              }}
              className="relative flex w-full items-center px-3 py-3 text-md text-white hover:bg-neutral-800 transition-colors z-[9999]"
            >
              <span className="pl-4 text-[14px] font-normal">{ai.name}</span>
              {ai.url === aiService.url && (
                <span className="absolute right-4 text-green-500">
                  <Check className="h-6 w-6" />
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AiSelectButton;