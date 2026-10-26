import React, { useState, useEffect, useMemo } from 'react';
import { storageService } from './services/storage/indexedDB';
import { webllmService, SUPPORTED_MODELS } from './services/ai/webllmEngine';
import { ambientSoundService } from './services/audio/ambientSound';
import { Memory, AltarItem, ModelState, ModelProgressReport, GeneratedWriting } from './types/memory';

import { TopNav, NavTab } from './components/common/TopNav';
import { AmbientParticles } from './components/common/AmbientParticles';
import { NoiseOverlay } from './components/common/NoiseOverlay';
import { OfflineIndicator } from './components/common/OfflineIndicator';

import { HeroHome } from './components/home/HeroHome';
import { DigitalOfrenda } from './components/ofrenda/DigitalOfrenda';
import { MemoryCard } from './components/archive/MemoryCard';
import { MemoryFilterBar, SortOrder } from './components/archive/MemoryFilterBar';
import { MemoryModal } from './components/archive/MemoryModal';
import { MemoryFormModal } from './components/editor/MemoryFormModal';
import { StoryStudio } from './components/studio/StoryStudio';
import { InsideTheMachine } from './components/settings/InsideTheMachine';
import { SettingsModal } from './components/settings/SettingsModal';
import { ExportImportModal } from './components/settings/ExportImportModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [memories, setMemories] = useState<Memory[]>([]);
  const [altarItems, setAltarItems] = useState<AltarItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals & Selection
  const [selectedMemoryForDetail, setSelectedMemoryForDetail] = useState<Memory | null>(null);
  const [memoryToEdit, setMemoryToEdit] = useState<Memory | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportImportOpen, setIsExportImportOpen] = useState(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [showOnlyAltar, setShowOnlyAltar] = useState(false);

  // Environment & AI states
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState(SUPPORTED_MODELS[0].id);
  const [aiState, setAiState] = useState<ModelState>('unloaded');
  const [aiProgress, setAiProgress] = useState<ModelProgressReport | undefined>(undefined);

  // Load initial data
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [mems, items] = await Promise.all([
        storageService.getAllMemories(),
        storageService.getAllAltarItems(),
      ]);
      setMemories(mems);
      setAltarItems(items);
    } catch (err) {
      console.error('Failed to load local memories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Subscribe to WebLLM engine state changes
    const unsubscribeAI = webllmService.subscribe((state, report) => {
      setAiState(state);
      setAiProgress(report);
    });

    // Check system prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReducedMotion(true);
    }

    return () => {
      unsubscribeAI();
      ambientSoundService.stop();
    };
  }, []);

  // Audio toggle
  const handleToggleSound = () => {
    const nextState = ambientSoundService.toggle();
    setSoundEnabled(nextState);
  };

  const handleToggleReducedMotion = () => {
    setReducedMotion(!reducedMotion);
  };

  // Memory Handlers
  const handleSaveMemory = async (memory: Memory) => {
    const saved = await storageService.saveMemory(memory);

    // If onAltar was turned on, ensure an item exists on altar
    if (saved.onAltar) {
      const existing = altarItems.find((i) => i.memoryId === saved.id);
      if (!existing) {
        const newAltarItem: AltarItem = {
          id: `altar-item-${Date.now()}`,
          memoryId: saved.id,
          type: 'photo',
          tier: 2,
          posX: Math.floor(Math.random() * 60) + 20,
          photoUrl: saved.photoUrl,
          personName: saved.personName,
        };
        await storageService.saveAltarItem(newAltarItem);
      }
    } else {
      // Remove from altar if toggled off
      const existing = altarItems.find((i) => i.memoryId === saved.id);
      if (existing) {
        await storageService.deleteAltarItem(existing.id);
      }
    }

    await loadData();
    setIsFormOpen(false);
    setMemoryToEdit(null);
  };

  const handleDeleteMemory = async (id: string) => {
    if (window.confirm('Are you sure you wish to delete this memory from your private archive?')) {
      await storageService.deleteMemory(id);
      if (selectedMemoryForDetail?.id === id) {
        setSelectedMemoryForDetail(null);
      }
      await loadData();
    }
  };

  const handleToggleAltarFromCard = async (memory: Memory) => {
    const nextOnAltar = !memory.onAltar;
    const updated: Memory = { ...memory, onAltar: nextOnAltar };
    await storageService.saveMemory(updated);

    if (nextOnAltar) {
      const newItem: AltarItem = {
        id: `altar-item-${Date.now()}`,
        memoryId: updated.id,
        type: 'photo',
        tier: 2,
        posX: Math.floor(Math.random() * 60) + 20,
        photoUrl: updated.photoUrl,
        personName: updated.personName,
      };
      await storageService.saveAltarItem(newItem);
    } else {
      const existing = altarItems.find((i) => i.memoryId === memory.id);
      if (existing) {
        await storageService.deleteAltarItem(existing.id);
      }
    }

    await loadData();
  };

  // Altar Handlers
  const handleAddAltarItem = async (item: AltarItem) => {
    await storageService.saveAltarItem(item);
    await loadData();
  };

  const handleDeleteAltarItem = async (id: string) => {
    await storageService.deleteAltarItem(id);
    await loadData();
  };

  const handleResetAltar = async () => {
    if (window.confirm('Reset the ofrenda altar arrangement to default? Memories in your archive remain safe.')) {
      await storageService.resetAltar();
      await loadData();
    }
  };

  // Studio Save Writing Handler
  const handleSaveWritingToMemory = async (memoryId: string, writing: GeneratedWriting) => {
    const memory = await storageService.getMemory(memoryId);
    if (!memory) return;

    const updatedWritings = [writing, ...(memory.writings || [])];
    const updated: Memory = { ...memory, writings: updatedWritings };
    await storageService.saveMemory(updated);
    await loadData();
  };

  const handleClearAllData = async () => {
    await storageService.clearAllData();
    await loadData();
  };

  // Filtered Memories List
  const availableTags = useMemo(() => {
    const tagsSet = new Set<string>();
    memories.forEach((m) => m.tags?.forEach((t) => tagsSet.add(t)));
    return Array.from(tagsSet);
  }, [memories]);

  const filteredMemories = useMemo(() => {
    let result = [...memories];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.personName.toLowerCase().includes(q) ||
          m.title.toLowerCase().includes(q) ||
          m.story.toLowerCase().includes(q) ||
          (m.relationship && m.relationship.toLowerCase().includes(q)) ||
          (m.favoriteFood && m.favoriteFood.toLowerCase().includes(q)) ||
          (m.favoriteSong && m.favoriteSong.toLowerCase().includes(q)) ||
          (m.favoritePlace && m.favoritePlace.toLowerCase().includes(q))
      );
    }

    // Tag
    if (selectedTag !== 'all') {
      result = result.filter((m) => m.tags?.includes(selectedTag));
    }

    // Altar Only
    if (showOnlyAltar) {
      result = result.filter((m) => m.onAltar);
    }

    // Sort
    result.sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      if (sortOrder === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortOrder === 'name') {
        return a.personName.localeCompare(b.personName);
      }
      return 0;
    });

    return result;
  }, [memories, searchQuery, selectedTag, showOnlyAltar, sortOrder]);

  return (
    <div className="min-h-screen bg-[#090807] text-[#F2E8D8] flex flex-col relative selection:bg-[#E87932]/30 selection:text-[#F4B75E]">
      {/* Background Particles & Quiet Noise Film Grain */}
      <AmbientParticles enabled={!reducedMotion} />
      <NoiseOverlay />
      <OfflineIndicator />

      {/* Top Bar Contract Navigation */}
      <TopNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
        }}
        onCreateMemory={() => {
          setMemoryToEdit(null);
          setIsFormOpen(true);
        }}
        aiStatus={{
          state: aiState,
          modelName: webllmService.getCurrentModelId() || undefined,
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Tab 1: Home View */}
        {activeTab === 'home' && (
          <HeroHome
            onEnterMemoryRoom={() => setActiveTab('altar')}
            onOpenHowItWorks={() => setActiveTab('machine')}
            onCreateMemory={() => {
              setMemoryToEdit(null);
              setIsFormOpen(true);
            }}
            onOpenMemory={(m) => setSelectedMemoryForDetail(m)}
            fictionalSamples={memories.filter((m) => m.isFictionalSample)}
            aiState={aiState}
          />
        )}

        {/* Tab 2: The Digital Ofrenda View */}
        {activeTab === 'altar' && (
          <DigitalOfrenda
            altarItems={altarItems}
            memories={memories}
            onOpenMemory={(m) => setSelectedMemoryForDetail(m)}
            onAddItem={handleAddAltarItem}
            onDeleteItem={handleDeleteAltarItem}
            onResetAltar={handleResetAltar}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            onCreateMemory={() => {
              setMemoryToEdit(null);
              setIsFormOpen(true);
            }}
          />
        )}

        {/* Tab 3: Memory Archive View */}
        {activeTab === 'archive' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[rgba(242,232,216,0.08)] pb-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#B89A61]">
                  Private Vault
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#F2E8D8] mt-1">
                  The Memory Archive
                </h1>
                <p className="text-xs sm:text-sm text-[#A39686] mt-0.5">
                  Stored directly in your browser. Complete sovereignty over every photograph and story.
                </p>
              </div>

              <button
                onClick={() => {
                  setMemoryToEdit(null);
                  setIsFormOpen(true);
                }}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-[#090807] bg-[#F4B75E] hover:bg-[#F2E8D8] rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
              >
                + Record Memory
              </button>
            </div>

            {/* Filter, search, and sort controls */}
            <MemoryFilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedTag={selectedTag}
              onTagSelect={setSelectedTag}
              availableTags={availableTags}
              sortOrder={sortOrder}
              onSortChange={setSortOrder}
              showOnlyAltar={showOnlyAltar}
              onToggleAltarOnly={() => setShowOnlyAltar(!showOnlyAltar)}
              totalCount={memories.length}
            />

            {/* Empty State */}
            {filteredMemories.length === 0 && (
              <div className="p-12 text-center rounded-xl bg-[#15120F] border border-dashed border-[#382E24] space-y-3">
                <span className="font-serif text-2xl text-[#A39686] block">
                  No memories match this view
                </span>
                <p className="text-xs text-[#736555] max-w-sm mx-auto">
                  Try adjusting your search terms or create a new memory to enshrine their story.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedTag('all');
                    setShowOnlyAltar(false);
                  }}
                  className="mt-2 text-xs text-[#F4B75E] hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Memory Cards Grid (1440px balanced grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMemories.map((mem) => (
                <MemoryCard
                  key={mem.id}
                  memory={mem}
                  onOpen={(m) => setSelectedMemoryForDetail(m)}
                  onEdit={(m) => {
                    setMemoryToEdit(m);
                    setIsFormOpen(true);
                  }}
                  onDelete={handleDeleteMemory}
                  onOpenStudio={(m) => {
                    setSelectedMemoryForDetail(m);
                    setActiveTab('studio');
                  }}
                  onToggleAltar={handleToggleAltarFromCard}
                />
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Let the Memory Speak Studio */}
        {activeTab === 'studio' && (
          <StoryStudio
            memories={memories}
            selectedMemory={selectedMemoryForDetail}
            onSelectMemory={(m) => setSelectedMemoryForDetail(m)}
            onSaveWritingToMemory={handleSaveWritingToMemory}
            aiStatus={{
              state: aiState,
              modelName: webllmService.getCurrentModelId() || undefined,
            }}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}

        {/* Tab 5: Inside the Machine (Developer Page) */}
        {activeTab === 'machine' && <InsideTheMachine />}

        {/* Tab 6: Settings & Privacy View */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto py-4">
            <InsideTheMachine />
          </div>
        )}
      </main>

      {/* Editorial Footer (No fake telemetry tickers or slop) */}
      <footer className="border-t border-[rgba(242,232,216,0.08)] bg-[#0A0908] py-8 text-xs text-[#736555] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif text-[#F2E8D8] font-medium text-sm">The Last Light</span>
            <span>·</span>
            <span>Open-Source Offline Memory Keeper</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsExportImportOpen(true)}
              className="hover:text-[#F4B75E] transition-colors"
            >
              Backup / Restore
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-[#F4B75E] transition-colors"
            >
              Model Settings
            </button>
            <button
              onClick={() => setActiveTab('machine')}
              className="hover:text-[#F4B75E] transition-colors"
            >
              Inside the Machine
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <MemoryFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setMemoryToEdit(null);
        }}
        onSave={handleSaveMemory}
        initialMemory={memoryToEdit}
      />

      <MemoryModal
        memory={selectedMemoryForDetail}
        isOpen={!!selectedMemoryForDetail && activeTab !== 'studio'}
        onClose={() => setSelectedMemoryForDetail(null)}
        onEdit={(m) => {
          setSelectedMemoryForDetail(null);
          setMemoryToEdit(m);
          setIsFormOpen(true);
        }}
        onOpenStudio={(m) => {
          setSelectedMemoryForDetail(m);
          setActiveTab('studio');
        }}
        onToggleAltar={handleToggleAltarFromCard}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        selectedModelId={selectedModelId}
        onSelectModelId={setSelectedModelId}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={handleToggleReducedMotion}
        onClearAllData={handleClearAllData}
        onOpenExportImport={() => setIsExportImportOpen(true)}
        aiState={aiState}
        aiProgress={aiProgress}
      />

      <ExportImportModal
        isOpen={isExportImportOpen}
        onClose={() => setIsExportImportOpen(false)}
        onDataChanged={loadData}
      />
    </div>
  );
}
