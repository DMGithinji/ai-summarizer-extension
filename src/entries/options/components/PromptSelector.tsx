import { useEffect, useMemo, useRef, useState } from "react";
import { useStorage } from "@/hooks/useStorage";
import { Prompt } from "@/config/types";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Plus, CircleCheckBig, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface PromptFormProps {
  prompt?: Prompt;
  onSave: (data: Partial<Prompt>) => void;
  onDelete?: (id: string) => Promise<void>;
}

// Components
const PromptForm = ({ prompt, onSave, onDelete }: PromptFormProps) => {
  const [name, setName] = useState(prompt?.name || "");
  const [content, setContent] = useState(prompt?.content || "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle textarea auto-resize
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [content]);

  const hasChanged = useMemo(() => {
    if (!prompt) return true;
    return prompt.name !== name || prompt.content !== content;
  }, [content, name, prompt]);

  return (
    <div className="flex-col rounded-md">
      <input
        type="text"
        placeholder="Enter prompt title"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-3 py-2 mx-[2px] bg-neutral-800 rounded-md text-white placeholder-neutral-500 focus:outline-none"
      />
      <hr className="border-t border-neutral-700" />
      <textarea
        ref={textareaRef}
        placeholder="Enter your prompt template"
        value={content}
        rows={4}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-3 mx-[2px] bg-neutral-800 rounded-md text-white font-mono placeholder-neutral-500 focus:outline-none max-h-[400px] overflow-x-hidden"
      />
      <div className="flex justify-start space-x-2 pt-2 px-2 border-t border-neutral-700">
        <button
          disabled={!hasChanged}
          onClick={() => onSave({ name, content })}
          className={cn(
            "px-4 py-2 text-white font-semibold rounded-md transition duration-200",
            hasChanged ? "bg-green-600 hover:bg-green-500" : "bg-gray-600"
          )}
        >
          Save
        </button>
        {onDelete && prompt?.id && (
          <button
            onClick={() => onDelete(prompt.id)}
            className="px-4 py-2 text-white font-semibold rounded-md bg-red-700 hover:bg-red-500"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export function PromptSelector() {
  const { prompts, addPrompt, editPrompt, deletePrompt, setDefaultPrompt } =
    useStorage();
  const [newPrompt, setNewPrompt] = useState(false);
  const [openItem, setOpenItem] = useState<string>();

  const orderedPrompts = useMemo(
    () =>
      [...prompts].sort((a, b) => Number(b.isDefault) - Number(a.isDefault)),
    [prompts]
  );

  const handleDefaultPromptClick = (
    event: React.MouseEvent,
    promptId: string,
    isDefault: boolean
  ) => {
    event.stopPropagation();
    if (!isDefault) {
      setDefaultPrompt(promptId);
    }
  };

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-white">Prompt Templates</h1>
        <button
          onClick={() => {
            setNewPrompt(true);
            setOpenItem("new");
          }}
          className="flex items-center px-4 py-2 text-base font-semibold bg-green-600 text-white rounded-md hover:bg-green-500 transition duration-200 shadow"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </button>
      </div>

      <Accordion
        type="single"
        collapsible
        className="space-y-4"
        value={openItem}
        onValueChange={setOpenItem}
      >
        {newPrompt && (
          <AccordionItem value="new" data-open>
            <AccordionTrigger className="text-lg font-medium flex justify-between items-center py-3 px-4 bg-neutral-800 rounded-md border border-neutral-700 hover:bg-neutral-700 transition">
              <span className="text-white text-base">New Prompt</span>
            </AccordionTrigger>
            <AccordionContent className="mt-1 py-3 px-2 bg-neutral-800 rounded-md shadow-md">
              <PromptForm
                onSave={(data) => {
                  addPrompt(data as Omit<Prompt, "id">);
                  setNewPrompt(false);
                }}
              />
            </AccordionContent>
          </AccordionItem>
        )}

        {orderedPrompts.map((prompt) => (
          <AccordionItem key={prompt.id} value={prompt.id}>
            <AccordionTrigger className="text-lg font-medium flex justify-between items-center py-3 px-4 bg-neutral-800 rounded-md border border-neutral-700 hover:bg-neutral-700 transition">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={(e) =>
                    handleDefaultPromptClick(e, prompt.id, !!prompt.isDefault)
                  }
                  className="focus:outline-none"
                >
                  {prompt.isDefault ? (
                    <CircleCheckBig className="h-5 w-5 cursor-pointer text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 cursor-pointer text-neutral-300" />
                  )}
                </button>
                <span className="text-white text-base">{prompt.name}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="mt-1 py-3 px-2 bg-neutral-800 rounded-md  shadow-md">
              <PromptForm
                prompt={prompt}
                onDelete={deletePrompt}
                onSave={(data) => editPrompt(prompt.id, data)}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
