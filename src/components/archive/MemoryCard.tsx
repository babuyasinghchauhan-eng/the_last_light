import React from 'react';
import { Sparkles, Edit2, Trash2, Heart, Share2, Flame } from 'lucide-react';
import { Memory } from '../../types/memory';

interface MemoryCardProps {
  memory: Memory;
  onOpen: (memory: Memory) => void;
  onEdit: (memory: Memory) => void;
  onDelete: (id: string) => void;
  onOpenStudio: (memory: Memory) => void;
  onToggleAltar: (memory: Memory) => void;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({
  memory,
  onOpen,
  onEdit,
  onDelete,
  onOpenStudio,
  onToggleAltar,
}) => {
  return (
    <article className="group relative rounded-xl bg-[#15120F] border border-[rgba(242,232,216,0.08)] hover:border-[#B89A61]/50 transition-all duration-300 flex flex-col overflow-hidden shadow-md hover:shadow-xl">
      {/* Photo Frame Container */}
      <div
        onClick={() => onOpen(memory)}
        className="relative aspect-4/3 w-full bg-[#110E0B] overflow-hidden cursor-pointer select-none"
      >
        {memory.photoUrl ? (
          <img
            src={memory.photoUrl}
            alt={memory.personName}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-radial from-[#221A13] to-[#0D0A08]">
            <span className="font-serif text-3xl font-normal text-[#F4B75E]/80 mb-1">
              {memory.personName.charAt(0)}
            </span>
            <span className="text-xs text-[#A39686] font-serif italic">
              {memory.relationship || 'In Remembrance'}
            </span>
          </div>
        )}

        {/* Scrim overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#15120F] via-transparent to-transparent opacity-80" />

        {/* Altar presence indicator */}
        {memory.onAltar && (
          <div
            className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#090807]/80 backdrop-blur-xs text-[11px] font-medium text-[#F4B75E] border border-[#F4B75E]/30"
            title="Present on Digital Ofrenda Altar"
          >
            <Flame className="w-3 h-3 text-[#E87932]" />
            <span>On Altar</span>
          </div>
        )}

        {/* Fictional Demonstration explicit notice */}
        {memory.isFictionalSample && (
          <div
            className="absolute top-3 right-3 px-2 py-0.5 rounded bg-[#090807]/80 backdrop-blur-xs text-[10px] text-[#A39686] tracking-wider uppercase border border-[rgba(242,232,216,0.1)]"
            title="Demonstration memory for testing and inspiration"
          >
            Sample
          </div>
        )}
      </div>

      {/* Card Content (Zero-Pill Discipline: unboxed metadata with · separators) */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata line */}
          <div className="flex items-center gap-2 text-xs text-[#A39686] mb-1.5 flex-wrap">
            <span className="text-[#B89A61] font-medium">{memory.personName}</span>
            {memory.relationship && (
              <>
                <span aria-hidden="true">·</span>
                <span>{memory.relationship}</span>
              </>
            )}
            {(memory.birthDate || memory.remembranceDate) && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums text-[11px]">
                  {memory.birthDate ? new Date(memory.birthDate).getFullYear() : '?'}–
                  {memory.remembranceDate ? new Date(memory.remembranceDate).getFullYear() : 'Present'}
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <h3
            onClick={() => onOpen(memory)}
            className="font-serif text-xl font-medium text-[#F2E8D8] hover:text-[#F4B75E] transition-colors cursor-pointer line-clamp-1"
          >
            {memory.title}
          </h3>

          {/* Story Snippet */}
          <p className="mt-2 text-xs text-[#A39686] leading-relaxed line-clamp-3">
            {memory.story}
          </p>

          {/* Sensory Touchstones quietly displayed */}
          {(memory.favoriteFood || memory.favoriteSong || memory.favoritePlace) && (
            <div className="mt-3 pt-3 border-t border-[rgba(242,232,216,0.06)] flex items-center gap-2 text-[11px] text-[#A39686] truncate">
              {memory.favoriteFood && (
                <span title={`Favorite food: ${memory.favoriteFood}`} className="truncate">
                  Food: <span className="text-[#F2E8D8]/80">{memory.favoriteFood}</span>
                </span>
              )}
              {memory.favoriteSong && (
                <>
                  <span aria-hidden="true">·</span>
                  <span title={`Favorite song: ${memory.favoriteSong}`} className="truncate">
                    Song: <span className="text-[#F2E8D8]/80">{memory.favoriteSong}</span>
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="mt-4 pt-3 border-t border-[rgba(242,232,216,0.06)] flex items-center justify-between gap-2">
          {/* Let It Speak button */}
          <button
            onClick={() => onOpenStudio(memory)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#F4B75E] bg-[#241B12] hover:bg-[#332619] border border-[#F4B75E]/30 rounded-md transition-colors"
            title="Open in Storytelling Studio to transform this memory"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E87932]" />
            <span>Let It Speak</span>
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onToggleAltar(memory)}
              className={`p-1.5 rounded-md transition-colors ${
                memory.onAltar
                  ? 'text-[#F4B75E] hover:text-[#F2E8D8]'
                  : 'text-[#736555] hover:text-[#A39686]'
              }`}
              title={memory.onAltar ? 'Remove from Ofrenda Altar' : 'Place on Ofrenda Altar'}
              aria-label="Toggle altar presence"
            >
              <Flame className="w-4 h-4" />
            </button>

            <button
              onClick={() => onEdit(memory)}
              className="p-1.5 text-[#A39686] hover:text-[#F2E8D8] rounded-md transition-colors"
              title="Edit memory"
              aria-label="Edit memory"
            >
              <Edit2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => onDelete(memory.id)}
              className="p-1.5 text-[#736555] hover:text-red-400 rounded-md transition-colors"
              title="Delete memory"
              aria-label="Delete memory"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
