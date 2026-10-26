import React from 'react';
import {
  Flame,
  ArrowRight,
  ShieldCheck,
  Cpu,
  BookOpen,
  Sparkles,
  Heart,
  ChevronDown,
} from 'lucide-react';
import { CandleMotif } from '../common/CandleMotif';
import { MarigoldMotif } from '../common/MarigoldMotif';
import { Memory } from '../../types/memory';

interface HeroHomeProps {
  onEnterMemoryRoom: () => void;
  onOpenHowItWorks: () => void;
  onCreateMemory: () => void;
  onOpenMemory: (m: Memory) => void;
  fictionalSamples: Memory[];
  aiState: string;
}

export const HeroHome: React.FC<HeroHomeProps> = ({
  onEnterMemoryRoom,
  onOpenHowItWorks,
  onCreateMemory,
  onOpenMemory,
  fictionalSamples,
  aiState,
}) => {
  return (
    <div className="space-y-20 pb-16">
      {/* Cinematic Full-Screen Introductory Frame */}
      <section className="relative min-h-[82vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 select-none overflow-hidden">
        {/* Soft atmospheric radial glow behind the candle */}
        <div
          className="absolute w-[500px] h-[500px] rounded-full pointer-events-none opacity-40 -top-10"
          style={{
            background:
              'radial-gradient(circle, rgba(244,183,94,0.25) 0%, rgba(232,121,50,0.1) 40%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        {/* Central Animated Candle Motif */}
        <div className="relative mb-6 cursor-pointer" onClick={onEnterMemoryRoom}>
          <CandleMotif size="hero" isLit={true} interactive={true} />
        </div>

        {/* Brand Kicker */}
        <span className="text-xs sm:text-sm font-serif uppercase tracking-[0.25em] text-[#B89A61] mb-2 block">
          Hacktoberfest 2026 · Ghost in the Machine
        </span>

        {/* Editorial Headline (Text-wrap balance to prevent orphans) */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal text-[#F2E8D8] tracking-tight max-w-4xl leading-[1.08] [text-wrap:balance]">
          Every story leaves a little light.
        </h1>

        {/* Supporting text */}
        <p className="mt-4 text-base sm:text-xl text-[#A39686] max-w-xl font-light leading-relaxed [text-wrap:balance]">
          A private place for the memories that deserve to stay. Preserved on your device, interpreted through gentle local open-weight AI.
        </p>

        {/* Primary and Secondary Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onEnterMemoryRoom}
            className="w-full sm:w-auto px-7 py-3.5 text-sm font-semibold text-[#090807] bg-[#F4B75E] hover:bg-[#F2E8D8] rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group active:scale-[0.98]"
          >
            <span>Enter the Memory Room</span>
            <ArrowRight className="w-4 h-4 text-[#090807] transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={onOpenHowItWorks}
            className="w-full sm:w-auto px-6 py-3.5 text-sm font-medium text-[#F2E8D8] bg-[#15120F] hover:bg-[#1E1914] border border-[#382E24] hover:border-[#B89A61] rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <span>How It Works</span>
          </button>
        </div>

        {/* Truthful Runtime AI Status & Privacy Indicators */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-[#A39686]">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#15120F] border border-[#2B231C]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B89A61]" />
            <span>Your memories stay on this device</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#15120F] border border-[#2B231C]">
            <Cpu className="w-3.5 h-3.5 text-[#F4B75E]" />
            <span>
              {aiState === 'ready'
                ? 'Local AI active (WebGPU)'
                : aiState === 'downloading'
                ? 'Preparing local AI model...'
                : aiState === 'unsupported'
                ? 'WebGPU unavailable (local template mode)'
                : 'Local AI available on demand'}
            </span>
          </div>
        </div>

        {/* Discreet Scroll Cue */}
        <div className="mt-12 text-[#736555] flex flex-col items-center gap-1 animate-bounce">
          <span className="text-[10px] uppercase tracking-widest">Explore</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </section>

      {/* Philosophy & Traditions Narrative Section */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-4">
        <div className="flex justify-center mb-2">
          <MarigoldMotif size={36} glow={true} />
        </div>
        <span className="text-xs uppercase tracking-widest text-[#E87932] font-medium">
          Traditions of Remembrance
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#F2E8D8]">
          “Some things disappear from the world.<br className="hidden sm:inline" /> They don’t have to disappear from our stories.”
        </h2>
        <p className="text-xs sm:text-sm text-[#A39686] leading-relaxed max-w-2xl mx-auto">
          Drawing from the quiet atmosphere of autumn, the reverent beauty of Día de los Muertos ofrendas, and the tales families preserve across generations, The Last Light offers a sanctuary for the moments you cherish.
        </p>
      </section>

      {/* Featured Demonstration Memories Gallery */}
      <section className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="flex items-end justify-between border-b border-[rgba(242,232,216,0.08)] pb-3">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#B89A61]">
              Curated Demonstrations
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#F2E8D8] mt-1">
              Sample Remembrances
            </h2>
            <p className="text-xs text-[#A39686] mt-0.5">
              These fictional memories demonstrate how sensory details and words are held.
            </p>
          </div>
          <button
            onClick={onCreateMemory}
            className="text-xs font-medium text-[#F4B75E] hover:underline"
          >
            Create Your Own →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {fictionalSamples.slice(0, 3).map((sample) => (
            <div
              key={sample.id}
              onClick={() => onOpenMemory(sample)}
              className="group cursor-pointer rounded-xl bg-[#15120F] border border-[#2B231C] hover:border-[#B89A61]/50 p-5 space-y-4 transition-all duration-300 hover:shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-4/3 rounded-lg overflow-hidden bg-[#110E0B] mb-3">
                  {sample.photoUrl && (
                    <img
                      src={sample.photoUrl}
                      alt={sample.personName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-[#A39686] uppercase tracking-wider">
                    Demonstration
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#A39686] mb-1">
                  <span className="text-[#B89A61] font-medium">{sample.personName}</span>
                  <span aria-hidden="true">·</span>
                  <span>{sample.relationship}</span>
                </div>

                <h3 className="font-serif text-xl font-medium text-[#F2E8D8] group-hover:text-[#F4B75E] transition-colors line-clamp-1">
                  {sample.title}
                </h3>

                <p className="text-xs text-[#A39686] leading-relaxed line-clamp-3 mt-2 font-serif italic">
                  “{sample.story}”
                </p>
              </div>

              <div className="pt-3 border-t border-[rgba(242,232,216,0.06)] flex items-center justify-between text-xs">
                <span className="text-[#A39686] text-[11px]">
                  {sample.writings.length > 0 ? `${sample.writings.length} adaptations` : 'Ready to adapt'}
                </span>
                <span className="text-[#F4B75E] font-medium group-hover:translate-x-0.5 transition-transform">
                  View Keepsake →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Three Pillars: Private, Open-Weight, Eternal */}
      <section className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-[#15120F] border border-[#2B231C] space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#241B12] border border-[#F4B75E]/30 flex items-center justify-center text-[#F4B75E]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-medium text-[#F2E8D8]">100% Local Privacy</h3>
          <p className="text-xs text-[#A39686] leading-relaxed">
            No accounts, no cloud logins, and no servers. Your stories, photographs, and sensory recipes are stored strictly in your browser's private IndexedDB.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-[#15120F] border border-[#2B231C] space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#241B12] border border-[#F4B75E]/30 flex items-center justify-center text-[#F4B75E]">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-medium text-[#F2E8D8]">Open-Weight AI in Browser</h3>
          <p className="text-xs text-[#A39686] leading-relaxed">
            Inference runs locally using WebLLM and WebGPU shaders. No remote AI endpoints receive your grief or memories.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-[#15120F] border border-[#2B231C] space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#241B12] border border-[#F4B75E]/30 flex items-center justify-center text-[#F4B75E]">
            <Flame className="w-5 h-5 text-[#E87932]" />
          </div>
          <h3 className="font-serif text-lg font-medium text-[#F2E8D8]">Digital Ofrenda Sanctuary</h3>
          <p className="text-xs text-[#A39686] leading-relaxed">
            Place photos, candles, marigolds, and dedications on an interactive three-tiered altar that remains intact across visits.
          </p>
        </div>
      </section>
    </div>
  );
};
