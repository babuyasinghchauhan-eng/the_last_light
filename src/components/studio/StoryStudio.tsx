import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Square,
  RotateCcw,
  Copy,
  Check,
  Save,
  Edit3,
  Trash2,
  AlertCircle,
  Cpu,
  Feather,
  Info,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { GenerationMode, GenerationTone, Memory, GeneratedWriting } from '../../types/memory';
import { webllmService } from '../../services/ai/webllmEngine';
import { buildPromptForMemory } from '../../services/ai/safety';
import { generateTemplateDraft } from '../../services/ai/fallbackWriter';

interface StoryStudioProps {
  memories: Memory[];
  selectedMemory: Memory | null;
  onSelectMemory: (mem: Memory | null) => void;
  onSaveWritingToMemory: (memoryId: string, writing: GeneratedWriting) => Promise<void>;
  aiStatus: {
    state: string;
    modelName?: string;
  };
  onOpenSettings: () => void;
}

export const StoryStudio: React.FC<StoryStudioProps> = ({
  memories,
  selectedMemory,
  onSelectMemory,
  onSaveWritingToMemory,
  aiStatus,
  onOpenSettings,
}) => {
  // Input fields
  const [personName, setPersonName] = useState(selectedMemory?.personName || '');
  const [relationship, setRelationship] = useState(selectedMemory?.relationship || '');
  const [title, setTitle] = useState(selectedMemory?.title || '');
  const [story, setStory] = useState(selectedMemory?.story || '');
  const [favoriteFood, setFavoriteFood] = useState(selectedMemory?.favoriteFood || '');
  const [favoriteSong, setFavoriteSong] = useState(selectedMemory?.favoriteSong || '');
  const [favoritePlace, setFavoritePlace] = useState(selectedMemory?.favoritePlace || '');
  const [sayings, setSayings] = useState(selectedMemory?.sayings || '');
  const [customFocus, setCustomFocus] = useState('');

  // Generation options
  const [mode, setMode] = useState<GenerationMode>('remembrance');
  const [tone, setTone] = useState<GenerationTone>('tender');

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState('');
  const [isEditingOutput, setIsEditingOutput] = useState(false);
  const [outputLabel, setOutputLabel] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const outputRef = useRef<HTMLDivElement | null>(null);

  // Sync when selected memory changes
  useEffect(() => {
    if (selectedMemory) {
      setPersonName(selectedMemory.personName || '');
      setRelationship(selectedMemory.relationship || '');
      setTitle(selectedMemory.title || '');
      setStory(selectedMemory.story || '');
      setFavoriteFood(selectedMemory.favoriteFood || '');
      setFavoriteSong(selectedMemory.favoriteSong || '');
      setFavoritePlace(selectedMemory.favoritePlace || '');
      setSayings(selectedMemory.sayings || '');
    }
  }, [selectedMemory]);

  const modeDescriptions: Record<GenerationMode, { label: string; desc: string }> = {
    remembrance: {
      label: 'First-Person Remembrance',
      desc: 'An evocative first-person poetic monologue spoken in the warmth of memory.',
    },
    letter: {
      label: 'Gentle Letter',
      desc: 'A quiet, heartfelt letter addressed to the person expressing gratitude and love.',
    },
    ghost_story: {
      label: 'Autumn Fireside Story',
      desc: 'A gentle, atmospheric gothic tale woven from the details you provide.',
    },
    poem: {
      label: 'Poem of Remembrance',
      desc: 'A 4–6 stanza lyric preserving tactile details, places, and melodies.',
    },
    family_history: {
      label: 'Family Chronicle',
      desc: 'An archival family record formatted for preservation across generations.',
    },
  };

  const tones: { id: GenerationTone; label: string }[] = [
    { id: 'tender', label: 'Tender' },
    { id: 'nostalgic', label: 'Nostalgic' },
    { id: 'hopeful', label: 'Hopeful' },
    { id: 'mysterious', label: 'Mysterious' },
    { id: 'poetic', label: 'Poetic' },
  ];

  const handleGenerate = async () => {
    if (!story.trim() && !personName.trim()) {
      setErrorMessage('Please provide at least a name and a few sentences of memory.');
      return;
    }

    setErrorMessage(null);
    setIsGenerating(true);
    setSaveSuccess(false);

    const memoryPayload: Partial<Memory> = {
      personName,
      relationship,
      title,
      story,
      favoriteFood,
      favoriteSong,
      favoritePlace,
      sayings,
    };

    // If WebLLM engine is loaded and ready, run real open-weight in-browser inference!
    if (aiStatus.state === 'ready') {
      try {
        setGeneratedOutput('');
        setOutputLabel(`WebLLM Open-Weight Model (${webllmService.getCurrentModelId() || 'Qwen 2.5'})`);

        const { system, user } = buildPromptForMemory(memoryPayload, mode, tone, customFocus);

        const result = await webllmService.generateStory(system, user, (token, accumulated) => {
          setGeneratedOutput(accumulated);
          if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
          }
        });

        setGeneratedOutput(result);
      } catch (err) {
        console.error('Inference error:', err);
        setErrorMessage(
          err instanceof Error
            ? err.message
            : 'Generation failed. You may retry or generate a local structured template.'
        );
      } finally {
        setIsGenerating(false);
      }
    } else {
      // Model not loaded yet or WebGPU unsupported:
      // Produce an honest, clearly labeled non-AI template draft, and offer model setup!
      setIsGenerating(false);
      const fallback = generateTemplateDraft(memoryPayload, mode, tone);
      setGeneratedOutput(fallback.content);
      setOutputLabel(fallback.label);
    }
  };

  const handleStop = () => {
    webllmService.stopGeneration();
    setIsGenerating(false);
  };

  const handleCopy = () => {
    if (!generatedOutput) return;
    navigator.clipboard.writeText(generatedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToMemory = async () => {
    if (!generatedOutput.trim()) return;

    let targetMemoryId = selectedMemory?.id;

    if (!targetMemoryId) {
      setErrorMessage('Select an existing memory or create one to attach this writing.');
      return;
    }

    const writing: GeneratedWriting = {
      id: `writing-${Date.now()}`,
      memoryId: targetMemoryId,
      mode,
      tone,
      prompt: customFocus || `${mode.replace('_', ' ')} in ${tone} tone`,
      content: generatedOutput.trim(),
      createdAt: new Date().toISOString(),
      modelUsed: outputLabel || 'WebLLM Local Engine',
      isEdited: isEditingOutput,
    };

    try {
      await onSaveWritingToMemory(targetMemoryId, writing);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to attach writing to memory:', err);
      setErrorMessage('Failed to save to memory record.');
    }
  };

  const handleClear = () => {
    setGeneratedOutput('');
    setOutputLabel(null);
    setErrorMessage(null);
    setIsEditingOutput(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Studio Header & Privacy Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[rgba(242,232,216,0.08)]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#B89A61]">
            Local Storytelling Studio
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#F2E8D8] mt-1">
            Let the Memory Speak
          </h1>
          <p className="text-xs sm:text-sm text-[#A39686] mt-1 max-w-2xl">
            Transform personal recollections into gentle remembrances, letters, autumn ghost stories, or poems using private in-browser AI.
          </p>
        </div>

        {/* Local model status indicator */}
        <div className="flex items-center gap-3 bg-[#15120F] border border-[#382E24] p-3 rounded-lg text-xs">
          <div className="p-2 rounded bg-[#241B12] text-[#F4B75E]">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-medium text-[#F2E8D8]">
              <span>Engine:</span>
              <span className={aiStatus.state === 'ready' ? 'text-emerald-400' : 'text-[#F4B75E]'}>
                {aiStatus.state === 'ready'
                  ? 'Qwen 2.5 (Active Local)'
                  : aiStatus.state === 'downloading'
                  ? 'Downloading Weights...'
                  : aiStatus.state === 'unsupported'
                  ? 'WebGPU Unsupported'
                  : 'Weights Unloaded'}
              </span>
            </div>
            <button
              onClick={onOpenSettings}
              className="text-[#A39686] hover:text-[#F4B75E] underline text-[11px] block text-left"
            >
              {aiStatus.state === 'ready' ? 'Manage Model' : 'Load Local AI Model →'}
            </button>
          </div>
        </div>
      </div>

      {/* Ethical Statement Callout */}
      <div className="p-4 rounded-lg bg-[#191512] border border-[#B89A61]/30 flex items-start gap-3 text-xs text-[#F2E8D8]/90">
        <ShieldCheck className="w-5 h-5 text-[#B89A61] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-medium text-[#F4B75E] block">Ethical Remembrance Commitment</span>
          <p className="text-[#A39686] leading-relaxed">
            The Last Light never pretends the AI is communicating with deceased souls. Generated passages are poetic, fictionalized creative interpretations anchored strictly in the memories you record. No data ever leaves your device.
          </p>
        </div>
      </div>

      {/* Main Workspace Split: Input & Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Memory Input & Style Controls */}
        <div className="lg:col-span-5 space-y-5 bg-[#15120F] border border-[#382E24] p-5 rounded-xl">
          {/* Quick memory selector */}
          {memories.length > 0 && (
            <div>
              <label htmlFor="memorySelect" className="block text-xs uppercase tracking-wider text-[#B89A61] mb-1">
                Load from Memory Archive
              </label>
              <select
                id="memorySelect"
                value={selectedMemory?.id || ''}
                onChange={(e) => {
                  const found = memories.find((m) => m.id === e.target.value) || null;
                  onSelectMemory(found);
                }}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-[#1C1814] border border-[#382E24] rounded-md text-[#F2E8D8] focus:outline-hidden focus:border-[#F4B75E]"
              >
                <option value="">-- Write Custom / Scratchpad --</option>
                {memories.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.personName} — {m.title} {m.isFictionalSample ? '(Sample)' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Core Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="studioPersonName" className="block text-[11px] uppercase tracking-wider text-[#A39686] mb-1">
                Subject Name *
              </label>
              <input
                id="studioPersonName"
                type="text"
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                placeholder="e.g. Abuela Sofía"
                className="w-full px-3 py-1.5 text-xs bg-[#1C1814] border border-[#382E24] rounded text-[#F2E8D8] focus:outline-hidden focus:border-[#F4B75E]"
              />
            </div>
            <div>
              <label htmlFor="studioRelationship" className="block text-[11px] uppercase tracking-wider text-[#A39686] mb-1">
                Relationship
              </label>
              <input
                id="studioRelationship"
                type="text"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                placeholder="e.g. Grandmother"
                className="w-full px-3 py-1.5 text-xs bg-[#1C1814] border border-[#382E24] rounded text-[#F2E8D8] focus:outline-hidden focus:border-[#F4B75E]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="studioStory" className="block text-[11px] uppercase tracking-wider text-[#A39686] mb-1">
              The Memory in Your Words *
            </label>
            <textarea
              id="studioStory"
              rows={4}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Record the details: a quiet conversation, morning rituals, laughter, how they looked at dusk..."
              className="w-full px-3 py-2 text-xs bg-[#1C1814] border border-[#382E24] rounded text-[#F2E8D8] leading-relaxed focus:outline-hidden focus:border-[#F4B75E]"
            />
          </div>

          {/* Sensory Touchstones accordion / pills */}
          <div className="space-y-2 border-t border-[rgba(242,232,216,0.06)] pt-3">
            <span className="text-[11px] uppercase tracking-wider text-[#B89A61] block">
              Sensory Touchstones (Anchors)
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <input
                type="text"
                value={favoriteFood}
                onChange={(e) => setFavoriteFood(e.target.value)}
                placeholder="Favorite Food"
                className="px-2.5 py-1.5 text-xs bg-[#1C1814] border border-[#382E24] rounded text-[#F2E8D8]"
              />
              <input
                type="text"
                value={favoriteSong}
                onChange={(e) => setFavoriteSong(e.target.value)}
                placeholder="Favorite Song"
                className="px-2.5 py-1.5 text-xs bg-[#1C1814] border border-[#382E24] rounded text-[#F2E8D8]"
              />
              <input
                type="text"
                value={favoritePlace}
                onChange={(e) => setFavoritePlace(e.target.value)}
                placeholder="Favorite Place"
                className="px-2.5 py-1.5 text-xs bg-[#1C1814] border border-[#382E24] rounded text-[#F2E8D8]"
              />
              <input
                type="text"
                value={sayings}
                onChange={(e) => setSayings(e.target.value)}
                placeholder="Memorable Words"
                className="px-2.5 py-1.5 text-xs bg-[#1C1814] border border-[#382E24] rounded text-[#F2E8D8]"
              />
            </div>
          </div>

          {/* Formats / Modes */}
          <div className="border-t border-[rgba(242,232,216,0.06)] pt-3">
            <label className="block text-[11px] uppercase tracking-wider text-[#B89A61] mb-2">
              Writing Form
            </label>
            <div className="space-y-1.5">
              {(Object.keys(modeDescriptions) as GenerationMode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                    mode === m
                      ? 'bg-[#241B12] border-[#F4B75E] text-[#F2E8D8]'
                      : 'bg-[#191512] border-[#2C241D] text-[#A39686] hover:text-[#F2E8D8] hover:border-[#3D3227]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#F4B75E]">
                      {modeDescriptions[m].label}
                    </span>
                    {mode === m && <div className="w-1.5 h-1.5 rounded-full bg-[#F4B75E]" />}
                  </div>
                  <p className="text-[11px] text-[#A39686] mt-0.5 line-clamp-1">
                    {modeDescriptions[m].desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Tone Selector */}
          <div className="border-t border-[rgba(242,232,216,0.06)] pt-3">
            <label className="block text-[11px] uppercase tracking-wider text-[#B89A61] mb-1.5">
              Emotional Tone
            </label>
            <div className="flex flex-wrap gap-1.5">
              {tones.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTone(t.id)}
                  className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                    tone === t.id
                      ? 'bg-[#F4B75E] text-[#090807]'
                      : 'bg-[#191512] text-[#A39686] hover:text-[#F2E8D8] border border-[#2C241D]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div className="pt-2">
            {isGenerating ? (
              <button
                type="button"
                onClick={handleStop}
                className="w-full py-2.5 px-4 text-xs sm:text-sm font-medium text-white bg-red-800 hover:bg-red-700 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Stop Generation</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGenerate}
                className="w-full py-2.5 px-4 text-xs sm:text-sm font-semibold text-[#090807] bg-[#F4B75E] hover:bg-[#F2E8D8] rounded-lg flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99]"
              >
                <Sparkles className="w-4 h-4 text-[#B34415]" />
                <span>
                  {aiStatus.state === 'ready'
                    ? 'Generate with Local AI'
                    : 'Compose Passage'}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Literary Output Panel */}
        <div className="lg:col-span-7 bg-[#15120F] border border-[#382E24] p-6 rounded-xl flex flex-col min-h-[560px]">
          {/* Output Toolbar */}
          <div className="flex items-center justify-between pb-3 border-b border-[rgba(242,232,216,0.08)] flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Feather className="w-4 h-4 text-[#F4B75E]" />
              <span className="font-serif text-lg font-medium text-[#F2E8D8]">
                {modeDescriptions[mode].label}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {generatedOutput && (
                <>
                  <button
                    onClick={() => setIsEditingOutput(!isEditingOutput)}
                    className="p-1.5 text-[#A39686] hover:text-[#F2E8D8] transition-colors"
                    title={isEditingOutput ? 'Finish editing' : 'Edit passage'}
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleCopy}
                    className="p-1.5 text-[#A39686] hover:text-[#F2E8D8] transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  {selectedMemory && (
                    <button
                      onClick={handleSaveToMemory}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-[#F4B75E] hover:text-[#F2E8D8] bg-[#241B12] rounded border border-[#F4B75E]/30 transition-colors"
                      title="Save this writing permanently to the selected memory"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{saveSuccess ? 'Saved!' : 'Save to Memory'}</span>
                    </button>
                  )}

                  <button
                    onClick={handleClear}
                    className="p-1.5 text-[#736555] hover:text-red-400 transition-colors"
                    title="Clear editor"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Model badge info */}
          {outputLabel && (
            <div className="py-2 text-[11px] text-[#A39686] border-b border-[rgba(242,232,216,0.05)] flex items-center justify-between">
              <span>Origin: {outputLabel}</span>
              {isEditingOutput && <span className="text-[#F4B75E]">Editing Mode</span>}
            </div>
          )}

          {/* Error notice if any */}
          {errorMessage && (
            <div className="my-3 p-3 rounded-md bg-red-950/40 border border-red-800 text-xs text-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Reading / Editing Canvas */}
          <div
            ref={outputRef}
            className="flex-1 py-6 overflow-y-auto max-h-[600px] font-serif text-base sm:text-lg leading-relaxed text-[#F2E8D8]/95 whitespace-pre-line"
          >
            {isGenerating && !generatedOutput && (
              <div className="h-64 flex flex-col items-center justify-center text-center p-8 space-y-3">
                <Loader2 className="w-8 h-8 text-[#F4B75E] animate-spin" />
                <p className="text-sm font-sans text-[#A39686]">
                  Listening to the memory and gathering words...
                </p>
                <p className="text-xs font-sans text-[#736555]">
                  Streaming local tokens through browser WebGPU shaders.
                </p>
              </div>
            )}

            {!isGenerating && !generatedOutput && (
              <div className="h-64 flex flex-col items-center justify-center text-center p-8 space-y-3 border border-dashed border-[#2B231C] rounded-lg">
                <Feather className="w-10 h-10 text-[#473B2E] stroke-1" />
                <p className="font-serif text-lg text-[#A39686]">
                  The page is resting in quiet expectation.
                </p>
                <p className="text-xs font-sans text-[#736555] max-w-sm">
                  Record your details on the left, select a style, and select{' '}
                  <strong className="text-[#F4B75E]">Compose Passage</strong> to let the memory take shape.
                </p>
              </div>
            )}

            {generatedOutput && (
              <>
                {isEditingOutput ? (
                  <textarea
                    rows={16}
                    value={generatedOutput}
                    onChange={(e) => setGeneratedOutput(e.target.value)}
                    className="w-full h-full p-4 bg-[#1C1814] border border-[#382E24] rounded-md text-[#F2E8D8] font-serif text-base sm:text-lg leading-relaxed focus:outline-hidden focus:border-[#F4B75E]"
                  />
                ) : (
                  <div className="p-2 space-y-4">
                    {generatedOutput}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Bottom helper tip */}
          {generatedOutput && !isGenerating && (
            <div className="pt-4 border-t border-[rgba(242,232,216,0.06)] text-xs text-[#A39686] flex items-center justify-between">
              <span>
                {selectedMemory
                  ? `Attached target: ${selectedMemory.personName}`
                  : 'Passage can be copied or attached to a memory.'}
              </span>
              <button
                onClick={handleGenerate}
                className="inline-flex items-center gap-1 text-[#F4B75E] hover:underline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-compose</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
