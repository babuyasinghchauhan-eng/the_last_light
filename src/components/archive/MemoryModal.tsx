import React, { useState } from 'react';
import { X, Sparkles, Flame, Edit2, Copy, Check, Download, BookOpen } from 'lucide-react';
import { Memory, GeneratedWriting } from '../../types/memory';

interface MemoryModalProps {
  memory: Memory | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (memory: Memory) => void;
  onOpenStudio: (memory: Memory) => void;
  onToggleAltar: (memory: Memory) => void;
}

export const MemoryModal: React.FC<MemoryModalProps> = ({
  memory,
  isOpen,
  onClose,
  onEdit,
  onOpenStudio,
  onToggleAltar,
}) => {
  const [copiedWritingId, setCopiedWritingId] = useState<string | null>(null);

  if (!isOpen || !memory) return null;

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedWritingId(id);
    setTimeout(() => setCopiedWritingId(null), 2500);
  };

  const handleDownloadKeepsake = () => {
    const textContent = `THE LAST LIGHT — ARCHIVAL MEMORY RECORD
==================================================
SUBJECT: ${memory.personName} ${memory.relationship ? `(${memory.relationship})` : ''}
DATES: ${memory.birthDate || 'Unknown'} — ${memory.remembranceDate || 'Present in memory'}
TITLE: ${memory.title}

MEMORY NARRATIVE:
${memory.story}

SENSORY TOUCHSTONES:
• Favorite Food: ${memory.favoriteFood || 'None specified'}
• Favorite Song: ${memory.favoriteSong || 'None specified'}
• Favorite Place: ${memory.favoritePlace || 'None specified'}
• Memorable Sayings: "${memory.sayings || 'None specified'}"

${
  memory.writings.length > 0
    ? `\nLITERARY REMEMBRANCES:\n` +
      memory.writings
        .map(
          (w, i) =>
            `--- [${i + 1}] Mode: ${w.mode.toUpperCase()} (${w.tone}) ---\n${w.content}\n`
        )
        .join('\n')
    : ''
}
==================================================
Preserved in local storage by The Last Light.
`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${memory.personName.replace(/\s+/g, '_')}_memorial.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-memory-title"
    >
      <div className="relative w-full max-w-4xl my-8 bg-[#15120F] border border-[#B89A61]/30 rounded-xl shadow-2xl text-[#F2E8D8] overflow-hidden">
        {/* Top curatorial header bar */}
        <div className="px-6 py-4 border-b border-[rgba(242,232,216,0.08)] bg-[#191512] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#B89A61]">
              ACCESSION #{memory.id.slice(-6).toUpperCase()}
            </span>
            {memory.isFictionalSample && (
              <span className="text-[10px] uppercase tracking-wider text-[#A39686] px-1.5 py-0.5 rounded border border-[rgba(242,232,216,0.1)]">
                Fictional Demonstration
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadKeepsake}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#A39686] hover:text-[#F2E8D8] rounded border border-[#382E24] hover:border-[#B89A61] transition-colors"
              title="Download keepsake text file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Text</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#A39686] hover:text-[#F2E8D8] rounded-md transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 md:p-8 max-h-[80vh] overflow-y-auto space-y-8">
          {/* Hero Split: Portrait & Archival Definition List */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Portrait column */}
            <div className="md:col-span-5">
              <div className="relative aspect-4/5 rounded-lg bg-[#110E0B] border border-[#382E24] overflow-hidden shadow-lg">
                {memory.photoUrl ? (
                  <img
                    src={memory.photoUrl}
                    alt={memory.personName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                    <span className="font-serif text-5xl font-normal text-[#F4B75E]/80 mb-2">
                      {memory.personName.charAt(0)}
                    </span>
                    <span className="text-xs text-[#A39686] font-serif italic">
                      {memory.relationship || 'In Remembrance'}
                    </span>
                  </div>
                )}
                {/* Subtle vintage border inside frame */}
                <div className="absolute inset-2 border border-[#B89A61]/20 pointer-events-none rounded" />
              </div>

              {/* Quick actions under photo */}
              <div className="mt-4 flex items-center justify-between gap-2">
                <button
                  onClick={() => onOpenStudio(memory)}
                  className="flex-1 py-2 px-3 text-xs font-medium text-[#090807] bg-[#F4B75E] rounded-md hover:bg-[#F2E8D8] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#B34415]" />
                  <span>Let Memory Speak</span>
                </button>
                <button
                  onClick={() => onToggleAltar(memory)}
                  className={`p-2 rounded-md border transition-colors ${
                    memory.onAltar
                      ? 'border-[#F4B75E] text-[#F4B75E] bg-[#221A12]'
                      : 'border-[#382E24] text-[#A39686] hover:text-[#F2E8D8]'
                  }`}
                  title={memory.onAltar ? 'Remove from Ofrenda Altar' : 'Place on Ofrenda Altar'}
                >
                  <Flame className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onEdit(memory)}
                  className="p-2 rounded-md border border-[#382E24] text-[#A39686] hover:text-[#F2E8D8] transition-colors"
                  title="Edit details"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Curatorial Metadata column */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <span className="text-xs font-serif italic text-[#B89A61]">
                  {memory.relationship || 'A Cherished Life'}
                </span>
                <h1 id="modal-memory-title" className="font-serif text-3xl sm:text-4xl font-normal text-[#F2E8D8] mt-0.5">
                  {memory.personName}
                </h1>
                <h2 className="text-sm font-medium text-[#F4B75E] mt-1">
                  {memory.title}
                </h2>
              </div>

              {/* Accession Data List (Museum Pattern B) */}
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 py-3 border-y border-[rgba(242,232,216,0.08)] text-xs">
                <div>
                  <dt className="text-[#A39686] uppercase tracking-wider text-[10px]">Birth Date</dt>
                  <dd className="font-mono text-[#F2E8D8] mt-0.5">{memory.birthDate || 'Not recorded'}</dd>
                </div>
                <div>
                  <dt className="text-[#A39686] uppercase tracking-wider text-[10px]">Remembrance Date</dt>
                  <dd className="font-mono text-[#F2E8D8] mt-0.5">{memory.remembranceDate || 'Present in memory'}</dd>
                </div>
                <div>
                  <dt className="text-[#A39686] uppercase tracking-wider text-[10px]">Altar Presence</dt>
                  <dd className="text-[#F2E8D8] mt-0.5">
                    {memory.onAltar ? 'Enshrined on Ofrenda' : 'Stored in Archive'}
                  </dd>
                </div>
                <div>
                  <dt className="text-[#A39686] uppercase tracking-wider text-[10px]">Tags</dt>
                  <dd className="text-[#F2E8D8] mt-0.5">{memory.tags.join(', ')}</dd>
                </div>
              </dl>

              {/* Dedication card if present */}
              {memory.altarDedication && (
                <div className="p-3 rounded bg-[#1C1814] border-l-2 border-[#F4B75E] text-xs font-serif italic text-[#F2E8D8]/90">
                  “{memory.altarDedication}”
                </div>
              )}
            </div>
          </div>

          {/* Narrative Reading Column (Museum Pattern: drop-cap & relaxed leading) */}
          <section className="border-t border-[rgba(242,232,216,0.08)] pt-6">
            <h3 className="text-xs uppercase tracking-widest text-[#B89A61] mb-3">
              The Recorded Memory
            </h3>
            <div className="font-serif text-lg leading-relaxed text-[#F2E8D8]/90 max-w-prose whitespace-pre-line first-letter:text-4xl first-letter:font-normal first-letter:mr-2 first-letter:float-left first-letter:text-[#F4B75E]">
              {memory.story}
            </div>
          </section>

          {/* Sensory Touchstones Detail Grid */}
          {(memory.favoriteFood || memory.favoriteSong || memory.favoritePlace || memory.sayings) && (
            <section className="border-t border-[rgba(242,232,216,0.08)] pt-6">
              <h3 className="text-xs uppercase tracking-widest text-[#B89A61] mb-4">
                Sensory Keepsakes & Living Traditions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {memory.favoriteFood && (
                  <div className="p-4 rounded-lg bg-[#191512] border border-[#382E24]/60">
                    <span className="text-[10px] uppercase tracking-wider text-[#A39686] block">
                      Favorite Recipe or Food
                    </span>
                    <span className="font-serif text-sm text-[#F2E8D8] mt-1 block">
                      {memory.favoriteFood}
                    </span>
                  </div>
                )}
                {memory.favoriteSong && (
                  <div className="p-4 rounded-lg bg-[#191512] border border-[#382E24]/60">
                    <span className="text-[10px] uppercase tracking-wider text-[#A39686] block">
                      Favorite Music or Song
                    </span>
                    <span className="font-serif text-sm text-[#F2E8D8] mt-1 block">
                      {memory.favoriteSong}
                    </span>
                  </div>
                )}
                {memory.favoritePlace && (
                  <div className="p-4 rounded-lg bg-[#191512] border border-[#382E24]/60">
                    <span className="text-[10px] uppercase tracking-wider text-[#A39686] block">
                      Sanctuary or Favorite Place
                    </span>
                    <span className="font-serif text-sm text-[#F2E8D8] mt-1 block">
                      {memory.favoritePlace}
                    </span>
                  </div>
                )}
                {memory.sayings && (
                  <div className="p-4 rounded-lg bg-[#191512] border border-[#382E24]/60">
                    <span className="text-[10px] uppercase tracking-wider text-[#A39686] block">
                      Enduring Sayings / Words
                    </span>
                    <span className="font-serif text-sm italic text-[#F2E8D8] mt-1 block">
                      “{memory.sayings}”
                    </span>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Generated Writings History */}
          <section className="border-t border-[rgba(242,232,216,0.08)] pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xs uppercase tracking-widest text-[#B89A61]">
                  Literary Remembrances & Stories ({memory.writings.length})
                </h3>
                <p className="text-xs text-[#A39686]">
                  Passages crafted by the local in-browser model based exclusively on these details.
                </p>
              </div>
              <button
                onClick={() => onOpenStudio(memory)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#F4B75E] hover:text-[#F2E8D8] border border-[#F4B75E]/30 rounded-md transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E87932]" />
                <span>Write New Passage</span>
              </button>
            </div>

            {memory.writings.length === 0 ? (
              <div className="p-6 rounded-lg bg-[#191512] border border-dashed border-[#382E24] text-center">
                <BookOpen className="w-8 h-8 mx-auto text-[#736555] mb-2" />
                <p className="text-xs text-[#A39686]">
                  No literary adaptations have been generated yet for this memory.
                </p>
                <button
                  onClick={() => onOpenStudio(memory)}
                  className="mt-3 px-3 py-1.5 text-xs text-[#F4B75E] hover:underline"
                >
                  Open in the Storytelling Studio →
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {memory.writings.map((writing) => (
                  <div
                    key={writing.id}
                    className="p-5 rounded-lg bg-[#191512] border border-[#382E24] space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between text-xs text-[#A39686]">
                      <div className="flex items-center gap-2">
                        <span className="text-[#F4B75E] uppercase tracking-wider font-medium text-[11px]">
                          {writing.mode.replace('_', ' ')}
                        </span>
                        <span>·</span>
                        <span className="capitalize">{writing.tone} Tone</span>
                        <span>·</span>
                        <span className="font-mono text-[11px]">
                          {new Date(writing.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopyText(writing.content, writing.id)}
                        className="p-1.5 text-[#A39686] hover:text-[#F2E8D8] transition-colors"
                        title="Copy passage"
                      >
                        {copiedWritingId === writing.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <div className="font-serif text-sm leading-relaxed text-[#F2E8D8]/90 whitespace-pre-line border-l border-[#B89A61]/30 pl-4 py-1 italic">
                      {writing.content}
                    </div>

                    <div className="text-[11px] text-[#736555] flex items-center justify-between pt-1">
                      <span>Model: {writing.modelUsed}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
