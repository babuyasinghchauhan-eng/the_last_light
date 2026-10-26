import React from 'react';
import { Search, Flame, SlidersHorizontal } from 'lucide-react';

export type SortOrder = 'newest' | 'oldest' | 'name' | 'altar';

interface MemoryFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedTag: string;
  onTagSelect: (tag: string) => void;
  availableTags: string[];
  sortOrder: SortOrder;
  onSortChange: (sort: SortOrder) => void;
  showOnlyAltar: boolean;
  onToggleAltarOnly: () => void;
  totalCount: number;
}

export const MemoryFilterBar: React.FC<MemoryFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedTag,
  onTagSelect,
  availableTags,
  sortOrder,
  onSortChange,
  showOnlyAltar,
  onToggleAltarOnly,
  totalCount,
}) => {
  return (
    <div className="space-y-4">
      {/* Top search & quick toggles row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A39686]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, place, song, or memory..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-[#15120F] border border-[#382E24] rounded-lg text-[#F2E8D8] placeholder-[#736555] focus:outline-hidden focus:border-[#F4B75E] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#A39686] hover:text-[#F2E8D8]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Right controls: Altar Filter & Sort */}
        <div className="flex items-center gap-2">
          {/* Altar only button */}
          <button
            onClick={onToggleAltarOnly}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
              showOnlyAltar
                ? 'bg-[#2B1F16] border-[#F4B75E] text-[#F4B75E]'
                : 'bg-[#15120F] border-[#382E24] text-[#A39686] hover:text-[#F2E8D8]'
            }`}
            title="Filter memories currently placed on the Ofrenda Altar"
          >
            <Flame className="w-3.5 h-3.5 text-[#E87932]" />
            <span>On Altar</span>
          </button>

          {/* Sort dropdown */}
          <div className="relative inline-flex items-center">
            <select
              value={sortOrder}
              onChange={(e) => onSortChange(e.target.value as SortOrder)}
              className="px-3 py-2 text-xs font-medium bg-[#15120F] border border-[#382E24] text-[#F2E8D8] rounded-lg focus:outline-hidden focus:border-[#F4B75E] cursor-pointer"
            >
              <option value="newest">Sort: Recently Updated</option>
              <option value="oldest">Sort: Oldest Added</option>
              <option value="name">Sort: Name (A–Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interactive tag tabs (functional buttons with click handlers) */}
      {availableTags.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => onTagSelect('all')}
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
              selectedTag === 'all'
                ? 'bg-[#F4B75E] text-[#090807]'
                : 'bg-[#191512] text-[#A39686] hover:text-[#F2E8D8] hover:bg-[#25201A]'
            }`}
          >
            All ({totalCount})
          </button>
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagSelect(tag)}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
                selectedTag === tag
                  ? 'bg-[#F4B75E] text-[#090807]'
                  : 'bg-[#191512] text-[#A39686] hover:text-[#F2E8D8] hover:bg-[#25201A]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
