import React, { useState } from 'react';
import {
  Flame,
  Plus,
  RotateCcw,
  Sparkles,
  Info,
  Trash2,
  Volume2,
  VolumeX,
  Heart,
  ChevronDown,
} from 'lucide-react';
import { AltarItem, Memory } from '../../types/memory';
import { CandleMotif } from '../common/CandleMotif';
import { MarigoldMotif } from '../common/MarigoldMotif';
import { ambientSoundService } from '../../services/audio/ambientSound';

interface DigitalOfrendaProps {
  altarItems: AltarItem[];
  memories: Memory[];
  onOpenMemory: (memory: Memory) => void;
  onAddItem: (item: AltarItem) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
  onResetAltar: () => Promise<void>;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onCreateMemory: () => void;
}

export const DigitalOfrenda: React.FC<DigitalOfrendaProps> = ({
  altarItems,
  memories,
  onOpenMemory,
  onAddItem,
  onDeleteItem,
  onResetAltar,
  soundEnabled,
  onToggleSound,
  onCreateMemory,
}) => {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [selectedMemoryToAdd, setSelectedMemoryToAdd] = useState('');
  const [customDedication, setCustomDedication] = useState('');
  const [selectedTier, setSelectedTier] = useState<1 | 2 | 3>(2);
  const [activeItemForDetail, setActiveItemForDetail] = useState<AltarItem | null>(null);

  // Group items by tier (Tier 1 = Top/Heavens, Tier 2 = Earth/Memories, Tier 3 = Underworld/Offerings)
  const tier1Items = altarItems.filter((i) => i.tier === 1);
  const tier2Items = altarItems.filter((i) => i.tier === 2);
  const tier3Items = altarItems.filter((i) => i.tier === 3);

  const handleAddMemoryToAltar = async () => {
    if (!selectedMemoryToAdd) return;
    const mem = memories.find((m) => m.id === selectedMemoryToAdd);
    if (!mem) return;

    const newItem: AltarItem = {
      id: `altar-item-${Date.now()}`,
      memoryId: mem.id,
      type: 'photo',
      tier: selectedTier,
      posX: Math.floor(Math.random() * 60) + 20,
      photoUrl: mem.photoUrl,
      personName: mem.personName,
    };

    await onAddItem(newItem);
    setSelectedMemoryToAdd('');
    setShowAddMenu(false);
  };

  const handleAddObject = async (type: 'candle' | 'marigold' | 'bread') => {
    const newItem: AltarItem = {
      id: `altar-${type}-${Date.now()}`,
      type,
      tier: selectedTier,
      posX: Math.floor(Math.random() * 70) + 15,
      isLit: type === 'candle' ? true : undefined,
    };
    await onAddItem(newItem);
    setShowAddMenu(false);
  };

  const handleAddDedication = async () => {
    if (!customDedication.trim()) return;
    const newItem: AltarItem = {
      id: `altar-dedication-${Date.now()}`,
      type: 'dedication',
      tier: selectedTier,
      posX: 50,
      customText: customDedication.trim(),
    };
    await onAddItem(newItem);
    setCustomDedication('');
    setShowAddMenu(false);
  };

  const handleToggleCandleLit = (item: AltarItem) => {
    const updated: AltarItem = { ...item, isLit: !item.isLit };
    onAddItem(updated);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Altar Header & Curatorial Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[rgba(242,232,216,0.08)]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#B89A61]">
            El Altar De Los Recuerdos
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#F2E8D8] mt-1">
            The Digital Ofrenda
          </h1>
          <p className="text-xs sm:text-sm text-[#A39686] mt-1 max-w-xl">
            A sacred three-tiered sanctuary of light, marigolds, and treasured portraits. Click any candle to light or extinguish its flame.
          </p>
        </div>

        {/* Altar actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onToggleSound}
            className={`inline-flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
              soundEnabled
                ? 'bg-[#2B1F16] border-[#F4B75E] text-[#F4B75E]'
                : 'bg-[#15120F] border-[#382E24] text-[#A39686] hover:text-[#F2E8D8]'
            }`}
            title="Toggle peaceful candle crackle and ambient bells"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#F4B75E]" /> : <VolumeX className="w-4 h-4" />}
            <span>{soundEnabled ? 'Sound On' : 'Ambient Sound'}</span>
          </button>

          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-[#090807] bg-[#F4B75E] rounded-lg hover:bg-[#F2E8D8] transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Place on Altar</span>
          </button>

          <button
            onClick={onResetAltar}
            className="p-2 text-[#736555] hover:text-[#A39686] rounded-lg border border-transparent hover:border-[#382E24] transition-colors"
            title="Reset altar layout to default composition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cultural Reverence Note */}
      <div className="p-3.5 rounded-lg bg-[#15120F] border border-[rgba(242,232,216,0.06)] flex items-start gap-3 text-xs text-[#A39686]">
        <Info className="w-4 h-4 text-[#E87932] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-[#F2E8D8]">Living Cultural Tradition:</strong> In Mexican culture and throughout Latin America, the ofrenda is not a Halloween decoration or spooky display, but an enduring act of love, bridge of memory, and celebration of ancestral continuity.
        </p>
      </div>

      {/* Add Item Modal / Popover */}
      {showAddMenu && (
        <div className="p-5 rounded-xl bg-[#191512] border border-[#B89A61]/40 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-[rgba(242,232,216,0.08)] pb-2">
            <h3 className="font-serif text-lg font-medium text-[#F4B75E]">
              Add to the Remembrance Altar
            </h3>
            <button
              onClick={() => setShowAddMenu(false)}
              className="text-xs text-[#A39686] hover:text-[#F2E8D8]"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Add Memory Frame */}
            <div className="p-3 rounded-lg bg-[#14100D] border border-[#382E24] space-y-2">
              <span className="text-xs font-medium text-[#F2E8D8] block">Place a Memory Frame</span>
              <select
                value={selectedMemoryToAdd}
                onChange={(e) => setSelectedMemoryToAdd(e.target.value)}
                className="w-full p-2 text-xs bg-[#1C1814] border border-[#382E24] rounded text-[#F2E8D8]"
              >
                <option value="">-- Choose Memory --</option>
                {memories.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.personName} — {m.title}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddMemoryToAltar}
                disabled={!selectedMemoryToAdd}
                className="w-full py-1.5 px-3 text-xs font-medium text-[#090807] bg-[#F4B75E] rounded disabled:opacity-40"
              >
                Place Portrait
              </button>
            </div>

            {/* 2. Add Elements (Candle / Flower / Bread) */}
            <div className="p-3 rounded-lg bg-[#14100D] border border-[#382E24] space-y-2">
              <span className="text-xs font-medium text-[#F2E8D8] block">Sacred Offerings</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleAddObject('candle')}
                  className="p-2 text-xs rounded bg-[#1C1814] hover:bg-[#2B231C] text-[#F2E8D8] flex flex-col items-center gap-1 border border-[#382E24]"
                >
                  <CandleMotif size="sm" isLit={true} interactive={false} />
                  <span>Candle</span>
                </button>
                <button
                  onClick={() => handleAddObject('marigold')}
                  className="p-2 text-xs rounded bg-[#1C1814] hover:bg-[#2B231C] text-[#F2E8D8] flex flex-col items-center gap-1 border border-[#382E24]"
                >
                  <MarigoldMotif size={24} glow={false} />
                  <span>Marigold</span>
                </button>
                <button
                  onClick={() => handleAddObject('bread')}
                  className="p-2 text-xs rounded bg-[#1C1814] hover:bg-[#2B231C] text-[#F2E8D8] flex flex-col items-center gap-1 border border-[#382E24]"
                >
                  <span className="text-xl">🥖</span>
                  <span>Pan</span>
                </button>
              </div>
            </div>

            {/* 3. Add Dedication Ribbon */}
            <div className="p-3 rounded-lg bg-[#14100D] border border-[#382E24] space-y-2">
              <span className="text-xs font-medium text-[#F2E8D8] block">Dedication Ribbon</span>
              <input
                type="text"
                value={customDedication}
                onChange={(e) => setCustomDedication(e.target.value)}
                placeholder="e.g. Always remembered in song..."
                className="w-full p-2 text-xs bg-[#1C1814] border border-[#382E24] rounded text-[#F2E8D8]"
              />
              <button
                onClick={handleAddDedication}
                disabled={!customDedication.trim()}
                className="w-full py-1.5 px-3 text-xs font-medium text-[#090807] bg-[#F4B75E] rounded disabled:opacity-40"
              >
                Place Dedication
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Ofrenda Altar Structure (3 Tiered Shelves) */}
      <div className="relative rounded-2xl bg-gradient-to-b from-[#14100D] via-[#0E0C0A] to-[#080706] border border-[#382E24] p-6 sm:p-10 shadow-2xl overflow-hidden min-h-[640px] flex flex-col justify-between">
        {/* Archival wall background with soft marigold arch */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 15%, rgba(244,183,94,0.3) 0%, rgba(232,121,50,0.15) 40%, transparent 70%)`,
          }}
        />

        {/* Tier 1: Top Shelf (Heavens / Solitary focal portraits & tall candles) */}
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between text-xs text-[#B89A61] border-b border-[#382E24]/60 pb-1 px-4">
            <span className="font-serif italic text-sm">Tier I · The Guiding Light</span>
            <span className="text-[10px] tracking-widest uppercase">The Highest Shelf</span>
          </div>

          <div className="min-h-[140px] flex items-end justify-center gap-6 sm:gap-12 flex-wrap px-4 py-2">
            {tier1Items.map((item) => (
              <AltarItemNode
                key={item.id}
                item={item}
                onOpenMemory={onOpenMemory}
                memories={memories}
                onDelete={() => onDeleteItem(item.id)}
                onToggleCandle={() => handleToggleCandleLit(item)}
                soundEnabled={soundEnabled}
              />
            ))}
          </div>

          {/* Wooden Shelf Plinth */}
          <div className="h-3 w-full bg-gradient-to-r from-[#211A13] via-[#3D3023] to-[#211A13] rounded shadow-md border-t border-[#544331]" />
        </div>

        {/* Tier 2: Middle Shelf (Memories, Ancestors, Photographs, Marigold paths) */}
        <div className="relative z-10 space-y-3 my-6">
          <div className="flex items-center justify-between text-xs text-[#B89A61] border-b border-[#382E24]/60 pb-1 px-4">
            <span className="font-serif italic text-sm">Tier II · The Living Memory</span>
            <span className="text-[10px] tracking-widest uppercase">Family & Companions</span>
          </div>

          <div className="min-h-[160px] flex items-end justify-center gap-4 sm:gap-8 flex-wrap px-4 py-2">
            {tier2Items.map((item) => (
              <AltarItemNode
                key={item.id}
                item={item}
                onOpenMemory={onOpenMemory}
                memories={memories}
                onDelete={() => onDeleteItem(item.id)}
                onToggleCandle={() => handleToggleCandleLit(item)}
                soundEnabled={soundEnabled}
              />
            ))}
          </div>

          {/* Wooden Shelf Plinth with marigold petal garland */}
          <div className="relative h-4 w-full bg-gradient-to-r from-[#261E16] via-[#473728] to-[#261E16] rounded shadow-lg border-t border-[#634E39]">
            <div className="absolute -top-2 inset-x-0 flex justify-around opacity-60">
              <span className="text-xs">🌼</span>
              <span className="text-xs">🌼</span>
              <span className="text-xs">🌼</span>
              <span className="text-xs">🌼</span>
              <span className="text-xs">🌼</span>
            </div>
          </div>
        </div>

        {/* Tier 3: Bottom Table (Offerings, Bread of the Dead, Warm Tea Candles, Dedications) */}
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between text-xs text-[#B89A61] border-b border-[#382E24]/60 pb-1 px-4">
            <span className="font-serif italic text-sm">Tier III · The Hearth & Offerings</span>
            <span className="text-[10px] tracking-widest uppercase">Traditions & Fare</span>
          </div>

          <div className="min-h-[120px] flex items-center justify-around gap-4 flex-wrap px-4 py-2">
            {tier3Items.map((item) => (
              <AltarItemNode
                key={item.id}
                item={item}
                onOpenMemory={onOpenMemory}
                memories={memories}
                onDelete={() => onDeleteItem(item.id)}
                onToggleCandle={() => handleToggleCandleLit(item)}
                soundEnabled={soundEnabled}
              />
            ))}
          </div>

          {/* Heavy Base Table */}
          <div className="h-6 w-full bg-gradient-to-r from-[#17130F] via-[#2E241B] to-[#17130F] rounded-b border-t border-[#4A3B2B] shadow-2xl" />
        </div>
      </div>
    </div>
  );
};

interface AltarItemNodeProps {
  item: AltarItem;
  onOpenMemory: (memory: Memory) => void;
  memories: Memory[];
  onDelete: () => void;
  onToggleCandle: () => void;
  soundEnabled: boolean;
}

const AltarItemNode: React.FC<AltarItemNodeProps> = ({
  item,
  onOpenMemory,
  memories,
  onDelete,
  onToggleCandle,
  soundEnabled,
}) => {
  const matchedMemory = item.memoryId ? memories.find((m) => m.id === item.memoryId) : null;

  if (item.type === 'photo') {
    return (
      <div className="group relative flex flex-col items-center">
        {/* Ornate Gold Picture Frame */}
        <div
          onClick={() => matchedMemory && onOpenMemory(matchedMemory)}
          className="relative w-24 sm:w-28 h-32 sm:h-36 rounded-md bg-[#110E0B] border-4 border-[#B89A61] hover:border-[#F4B75E] transition-all p-1 cursor-pointer shadow-xl group-hover:scale-105 duration-300"
          title={matchedMemory ? `Open memory for ${matchedMemory.personName}` : item.personName}
        >
          {item.photoUrl ? (
            <img
              src={item.photoUrl}
              alt={item.personName || 'Memory'}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-xs"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#241B12] text-[#F4B75E] font-serif text-2xl">
              {item.personName?.charAt(0) || '✦'}
            </div>
          )}

          {/* Golden frame inner fillet */}
          <div className="absolute inset-1 border border-[#382E24]/60 pointer-events-none" />
        </div>

        {/* Name Plaque */}
        <span className="font-serif text-xs text-[#F2E8D8] mt-1.5 text-center max-w-[120px] truncate block group-hover:text-[#F4B75E] transition-colors">
          {item.personName || matchedMemory?.personName || 'Beloved'}
        </span>

        {/* Remove button hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute -top-2 -right-2 p-1 bg-[#15120F] text-red-400 hover:text-red-300 rounded-full border border-red-900/50 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Remove from altar (keeps memory safe in archive)"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    );
  }

  if (item.type === 'candle') {
    return (
      <div className="group relative flex flex-col items-center">
        <CandleMotif
          size="md"
          isLit={item.isLit ?? true}
          interactive={true}
          onToggle={onToggleCandle}
          soundEnabled={soundEnabled}
        />
        <button
          onClick={onDelete}
          className="mt-1 p-0.5 text-xs text-[#736555] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Remove candle"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    );
  }

  if (item.type === 'marigold') {
    return (
      <div className="group relative flex flex-col items-center">
        <MarigoldMotif size={44} glow={true} />
        <button
          onClick={onDelete}
          className="mt-1 p-0.5 text-xs text-[#736555] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Remove marigold"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    );
  }

  if (item.type === 'bread') {
    return (
      <div className="group relative flex flex-col items-center text-center">
        <div className="w-14 h-12 rounded-full bg-gradient-to-b from-[#8C5E35] to-[#59391D] border border-[#B38350]/40 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform cursor-default">
          <span className="text-xl">🥖</span>
        </div>
        <span className="text-[10px] font-serif text-[#A39686] mt-1">Pan de Muerto</span>
        <button
          onClick={onDelete}
          className="p-0.5 text-xs text-[#736555] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    );
  }

  if (item.type === 'dedication') {
    return (
      <div className="group relative max-w-xs p-3 rounded bg-[#1C1814] border border-[#F4B75E]/30 text-center shadow-lg">
        <p className="font-serif italic text-xs text-[#F4B75E]">
          “{item.customText}”
        </p>
        <button
          onClick={onDelete}
          className="absolute -top-2 -right-2 p-1 bg-[#15120F] text-red-400 hover:text-red-300 rounded-full border border-red-900/50 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return null;
};
