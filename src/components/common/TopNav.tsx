import React, { useState } from 'react';
import { Sparkles, Menu, X, ShieldCheck } from 'lucide-react';
import { CandleMotif } from './CandleMotif';
import { PWAInstallButton } from './PWAInstallButton';

export type NavTab = 'home' | 'altar' | 'archive' | 'studio' | 'machine' | 'settings';

interface TopNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onCreateMemory: () => void;
  aiStatus: {
    state: string;
    modelName?: string;
  };
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  onTabChange,
  onCreateMemory,
  aiStatus,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: NavTab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'altar', label: 'The Ofrenda' },
    { id: 'archive', label: 'Memories' },
    { id: 'studio', label: 'Let It Speak' },
    { id: 'machine', label: 'Inside Machine' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#090807]/90 backdrop-blur-md border-b border-[rgba(242,232,216,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title, single line */}
        <button
          onClick={() => {
            onTabChange('home');
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-3 text-left group whitespace-nowrap shrink-0 focus-visible:outline-hidden"
        >
          <CandleMotif size="sm" isLit={true} interactive={false} />
          <span className="font-serif text-xl sm:text-2xl font-normal tracking-wide text-[#F2E8D8] group-hover:text-[#F4B75E] transition-colors">
            The Last Light
          </span>
        </button>

        {/* Zone 2: 4–5 nav links, 1–2 word labels, single-line text with subtle hover underlines */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onTabChange(link.id)}
                className={`transition-colors whitespace-nowrap shrink-0 relative py-1 focus-visible:outline-hidden ${
                  isActive
                    ? 'text-[#F4B75E]'
                    : 'text-[#A39686] hover:text-[#F2E8D8]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#F4B75E] rounded-full" />
                )}
              </button>
            );
          })}

          <button
            onClick={() => onTabChange('settings')}
            className={`transition-colors whitespace-nowrap shrink-0 relative py-1 focus-visible:outline-hidden ${
              activeTab === 'settings'
                ? 'text-[#F4B75E]'
                : 'text-[#A39686] hover:text-[#F2E8D8]'
            }`}
          >
            Settings
            {activeTab === 'settings' && (
              <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#F4B75E] rounded-full" />
            )}
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <PWAInstallButton className="hidden sm:inline-flex" />

          {/* Privacy badge reminder */}
          <div
            className="hidden xl:flex items-center gap-1.5 text-xs text-[#A39686] px-2 py-1"
            title="All memories are stored solely in your local browser IndexedDB"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#B89A61]" />
            <span className="whitespace-nowrap">Local Private</span>
          </div>

          <button
            onClick={onCreateMemory}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-[#090807] bg-[#F4B75E] rounded-lg hover:bg-[#F2E8D8] transition-all whitespace-nowrap shrink-0 shadow-xs active:scale-[0.98]"
          >
            + Create Memory
          </button>

          {/* Mobile menu hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#A39686] hover:text-[#F2E8D8]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Complies with 15% mobile sticky cap rule) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[rgba(242,232,216,0.08)] bg-[#15120F] px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onTabChange(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                activeTab === link.id
                  ? 'text-[#F4B75E] bg-[#1F1B16] font-medium'
                  : 'text-[#A39686] hover:text-[#F2E8D8]'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => {
              onTabChange('settings');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
              activeTab === 'settings'
                ? 'text-[#F4B75E] bg-[#1F1B16] font-medium'
                : 'text-[#A39686] hover:text-[#F2E8D8]'
            }`}
          >
            Settings & Data
          </button>
          <div className="pt-2 border-t border-[rgba(242,232,216,0.05)] flex items-center justify-between text-xs text-[#A39686] px-3">
            <span>Model: {aiStatus.state === 'ready' ? 'Ready (Local)' : aiStatus.state}</span>
            <PWAInstallButton />
          </div>
        </div>
      )}
    </header>
  );
};
