import { useCallback, useMemo, useState } from "react";
import { useStorage } from "@/hooks/useStorage";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { areArrayEqual, cn } from "@/lib/utils";
import { Globe, X } from "lucide-react";

export function ManageExcludedSites() {
  const { excludedSites, updateExcludedSites } = useStorage();
  const [openItem, setOpenItem] = useState<string>(excludedSites.join(", "));

  return (
    <div className="mt-12">
      <h1 className="text-xl font-bold text-white">Excluded Sites</h1>

      <Accordion
        type="single"
        collapsible
        className="mt-6"
        value={openItem}
        onValueChange={setOpenItem}
      >
        <AccordionItem value={"excludedSites"}>
          <AccordionTrigger className="py-3 px-4 bg-neutral-800 rounded-md border border-neutral-700 hover:bg-neutral-700 transition">
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span className="text-base text-white">
                Configure sites you don't want to see the "Summarize with AI Button"
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="mt-1 py-3 px-2 bg-neutral-800 rounded-md  shadow-md">
            <SitesForm sites={excludedSites} onSave={updateExcludedSites} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

// Types
interface ManageExcludedSiteProps {
  sites: string[];
  onSave: (data: string[]) => void;
}

// Components
const SitesForm = ({ sites, onSave }: ManageExcludedSiteProps) => {
  const [excludedSites, setExcludedSites] = useState<string[]>((sites || []).filter(Boolean)
  );  const [newSite, setNewSite] = useState("");

  const hasChanged = useMemo(() => {
    return !areArrayEqual(sites, excludedSites);
  }, [sites, excludedSites]);

  const handleAddSite = useCallback(() => {
    if (newSite && !excludedSites.includes(newSite)) {
      setExcludedSites([newSite, ...excludedSites]);
      setNewSite("");
    }
  }, [excludedSites, newSite]);

  const handleEditSite = useCallback((e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newSites = [...excludedSites];
    newSites[index] = e.target.value;
    setExcludedSites(newSites);
  }, [excludedSites])

  const handleRemoveSite = useCallback((index: number) => {
    setExcludedSites(excludedSites.filter((_, i) => i !== index));
  }, [excludedSites]);

  return (
    <div className="flex flex-col space-y-4 rounded-md space-x-2">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddSite();
        }}
        className="flex items-center px-2"
      >
        <input
          type="text"
          value={newSite}
          onChange={(e) => setNewSite(e.target.value)}
          placeholder='Enter "domain.com" and press enter'
          className="flex-1 py-3 px-3 bg-neutral-800 rounded-md text-white font-mono placeholder-neutral-500 focus:outline-none border border-neutral-700"
        />
      </form>

      {excludedSites.length > 0 && <div className="max-h-[400px] overflow-y-auto">
        {excludedSites.map((site, index) => (
          <div key={index} className="group flex items-center bg-neutral-800 rounded-md">
            <input
              type="text"
              value={site}
              onChange={(e) => handleEditSite(e, index)}
              className="flex-1 py-1 px-3 bg-transparent rounded-md text-white font-mono focus:bg-neutral-700 focus:outline-none transition-colors"
            />
            <button
              onClick={() => handleRemoveSite(index)}
              className="p-2 mr-1"
            >
              <X className="w-5 h-5 text-neutral-500 hover:text-red-500 transition-colors" />
            </button>
          </div>
        ))}
      </div>}

      <div className="flex justify-start px-2 border-t border-neutral-700">
        <button
          disabled={!hasChanged}
          onClick={() => onSave(excludedSites)}
          className={cn(
            "mt-4 px-4 py-2 text-white font-semibold rounded-md transition duration-200",
            hasChanged ? "bg-green-600 hover:bg-green-500" : "bg-gray-600"
          )}
        >
          Save
        </button>
      </div>
    </div>
  );
};
