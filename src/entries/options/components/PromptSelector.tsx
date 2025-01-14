import { useEffect, useMemo, useRef, useState } from "react";
import { useStorage } from "@/hooks/useStorage";
import { Prompt } from "@/config/types";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Edit, Trash, Plus, CircleCheckBig, Circle } from "lucide-react";

export function PromptSelector() {
  const { prompts, addPrompt, editPrompt, deletePrompt, setDefaultPrompt } =
    useStorage();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPrompt, setNewPrompt] = useState(false);
  const orderedPrompts = useMemo(() => prompts.sort((a, b) => {
    if (a.isDefault === b.isDefault) return 0;
    return a.isDefault ? -1 : 1;
  }), [prompts]);

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Prompt Templates</h1>
        <button
          onClick={() => setNewPrompt(true)}
          className="flex items-center px-4 py-2 text-[16px] font-semibold bg-green-600 text-white rounded-md hover:bg-green-500 transition duration-200 shadow"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </button>
      </div>

      <Accordion type="single" collapsible className="space-y-4">
        {orderedPrompts.map((prompt) => (
          <AccordionItem key={prompt.id} value={prompt.id}>
            <AccordionTrigger className="text-lg font-medium flex justify-between items-center py-3 px-4 bg-neutral-800 rounded-md border border-neutral-700 hover:bg-neutral-700 transition">
              <div className="flex items-center space-x-2">
                {prompt.isDefault ? (
                  <CircleCheckBig
                    onClick={(event) => {
                      event.stopPropagation();
                    }}
                    className="h-5 w-5 cursor-pointer text-green-500"
                  />
                ) : (
                  <Circle
                    onClick={(event) => {
                      event.stopPropagation();
                      setDefaultPrompt(prompt.id);
                    }}
                    className="h-5 w-5 cursor-pointer text-neutral-300"
                  />
                )}

                <span className="text-white">{prompt.name}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="py-3 bg-neutral-900 rounded-b-md">
              {editingId === prompt.id ? (
                <PromptForm
                  prompt={prompt}
                  onSave={(data) => {
                    editPrompt(prompt.id, data);
                    setEditingId(null);
                  }}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div>
                  <pre className="p-3 bg-neutral-800 rounded-md text-neutral-300 font-mono max-h-[400px] text-wrap overflow-y-scroll">
                    {prompt.content}
                  </pre>
                  <div className="flex space-x-3 mt-4">
                    <button
                      onClick={() => setEditingId(prompt.id)}
                      className="flex items-center px-4 py-2 font-semibold text-white bg-green-600 rounded-md"
                    >
                      <Edit className="mr-2 h-4 w-4 text-[16px]" />
                      Edit
                    </button>
                    {!prompt.isDefault && (
                      <button
                        onClick={() => deletePrompt(prompt.id)}
                        className="flex items-center px-4 py-2 font-semibold bg-red-700 text-white rounded-md"
                      >
                        <Trash className="mr-2 h-4 w-4 text-[16px]" />
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}

        {newPrompt && (
          <AccordionItem value="new">
            <AccordionTrigger className="text-lg font-medium flex justify-between items-center py-3 px-4 bg-neutral-800 rounded-md border border-neutral-700 hover:bg-neutral-700 transition">
              <span className="text-white">New Prompt</span>
            </AccordionTrigger>
            <AccordionContent className="py-3 bg-neutral-900 rounded-b-md px-0">
              <PromptForm
                onSave={(data) => {
                  addPrompt(data as Omit<Prompt, "id">);
                  setNewPrompt(false);
                }}
                onCancel={() => setNewPrompt(false)}
              />
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
}


const PromptForm = ({
  prompt,
  onSave,
  onCancel,
}: {
  prompt?: Prompt;
  onSave: (data: Partial<Prompt>) => void;
  onCancel: () => void;
}) => {
  const [name, setName] = useState(prompt?.name || "");
  const [content, setContent] = useState(prompt?.content || "");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set to scrollHeight
    }
  }, [content]);

  return (
    <div className="space-y-4 rounded-md">
      <input
        type="text"
        placeholder="Enter prompt name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-3 mx-[2px] bg-neutral-800 rounded-md text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-green-500"
      />
      <textarea
        ref={textareaRef}
        placeholder="Enter your prompt template"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={6}
        className="w-full p-3 mx-[2px] bg-neutral-800 rounded-md text-white font-mono placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-green-500 max-h-[400px] overflow-x-hidden"
      />
      <div className="flex justify-start space-x-2">
        <button
          onClick={() => onSave({ name, content })}
          className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-500 transition duration-200"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-neutral-700 font-semibold text-neutral-300 rounded-md hover:bg-neutral-600 transition duration-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};