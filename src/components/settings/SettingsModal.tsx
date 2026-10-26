import React, { useState } from 'react';
import {
  X,
  Cpu,
  Download,
  Trash2,
  Volume2,
  VolumeX,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  FileJson,
  Loader2,
} from 'lucide-react';
import { SUPPORTED_MODELS, webllmService } from '../../services/ai/webllmEngine';
import { ModelOption, ModelProgressReport, ModelState } from '../../types/memory';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModelId: string;
  onSelectModelId: (id: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
  onClearAllData: () => Promise<void>;
  onOpenExportImport: () => void;
  aiState: ModelState;
  aiProgress?: ModelProgressReport;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  selectedModelId,
  onSelectModelId,
  soundEnabled,
  onToggleSound,
  reducedMotion,
  onToggleReducedMotion,
  onClearAllData,
  onOpenExportImport,
  aiState,
  aiProgress,
}) => {
  const [confirmClear, setConfirmClear] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStartDownload = async () => {
    setIsDownloading(true);
    setDownloadError(null);
    try {
      await webllmService.initializeModel(selectedModelId);
    } catch (err) {
      setDownloadError(err instanceof Error ? err.message : 'Model download failed.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleUnloadModel = async () => {
    await webllmService.unloadModel();
  };

  const handleConfirmClearAll = async () => {
    await onClearAllData();
    setConfirmClear(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl bg-[#15120F] border border-[#B89A61]/30 rounded-xl shadow-2xl text-[#F2E8D8] overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[rgba(242,232,216,0.08)] bg-[#191512] flex items-center justify-between">
          <h2 className="font-serif text-2xl font-normal text-[#F2E8D8]">
            Settings & Local Engine
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-[#A39686] hover:text-[#F2E8D8] rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Section 1: Local Open-Weight Model Management */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#B89A61]">
                  WebGPU Neural Weights
                </span>
                <h3 className="font-serif text-lg font-medium text-[#F4B75E]">
                  In-Browser AI Model
                </h3>
              </div>
              {aiState === 'ready' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-700 text-emerald-300 text-xs font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Ready & Running</span>
                </span>
              )}
            </div>

            <p className="text-xs text-[#A39686] leading-relaxed">
              The first visit requires downloading the model weights (~400MB–950MB) over the internet. Once cached by your browser, generation works locally and offline.
            </p>

            {/* Model Selector Cards */}
            <div className="space-y-2">
              {SUPPORTED_MODELS.map((model) => (
                <label
                  key={model.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedModelId === model.id
                      ? 'bg-[#241B12] border-[#F4B75E]'
                      : 'bg-[#191512] border-[#2C241D] hover:border-[#3D3227]'
                  }`}
                >
                  <input
                    type="radio"
                    name="modelSelection"
                    checked={selectedModelId === model.id}
                    onChange={() => onSelectModelId(model.id)}
                    className="mt-1 text-[#F4B75E] focus:ring-0"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <span className="font-medium text-[#F2E8D8] text-sm">{model.name}</span>
                      <span className="font-mono text-[11px] text-[#B89A61]">
                        {model.downloadSizeApprox} · {model.vramRequiredMB} MB VRAM
                      </span>
                    </div>
                    <p className="text-[#A39686] mt-0.5">{model.description}</p>
                  </div>
                </label>
              ))}
            </div>

            {/* Model action buttons & progress bar */}
            {aiState === 'downloading' || isDownloading ? (
              <div className="p-4 rounded-lg bg-[#191512] border border-[#F4B75E]/30 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#F4B75E] font-medium flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Compiling to WebGPU: {aiProgress?.text || 'Downloading shards...'}</span>
                  </span>
                  <span className="font-mono text-[#F2E8D8]">
                    {Math.round((aiProgress?.progress || 0) * 100)}%
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 bg-[#2B231C] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#E87932] to-[#F4B75E] transition-all duration-300"
                    style={{ width: `${Math.max(5, (aiProgress?.progress || 0) * 100)}%` }}
                  />
                </div>
                <p className="text-[11px] text-[#736555]">
                  Please keep this tab open while weights are compiled.
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-3 pt-2">
                {aiState !== 'ready' ? (
                  <button
                    onClick={handleStartDownload}
                    className="flex-1 py-2.5 px-4 text-xs sm:text-sm font-semibold text-[#090807] bg-[#F4B75E] hover:bg-[#F2E8D8] rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download & Initialize Model</span>
                  </button>
                ) : (
                  <button
                    onClick={handleUnloadModel}
                    className="py-2 px-3 text-xs text-[#A39686] hover:text-red-400 border border-[#382E24] hover:border-red-800 rounded-md transition-colors"
                  >
                    Unload from VRAM
                  </button>
                )}
              </div>
            )}

            {downloadError && (
              <div className="p-3 rounded-md bg-red-950/40 border border-red-800 text-xs text-red-200 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{downloadError}</span>
              </div>
            )}
          </div>

          {/* Section 2: Audio & Accessibility */}
          <div className="border-t border-[rgba(242,232,216,0.08)] pt-4 space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#B89A61] block">
              Preferences & Environment
            </span>

            {/* Sound toggle */}
            <div className="p-4 rounded-lg bg-[#191512] border border-[#2B231C] flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-[#F2E8D8] block flex items-center gap-2">
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-[#F4B75E]" /> : <VolumeX className="w-4 h-4 text-[#A39686]" />}
                  <span>Candlelight Soundscape</span>
                </span>
                <span className="text-xs text-[#A39686]">
                  Synthesized hearth crackle and quiet meditative wind chimes (Web Audio API).
                </span>
              </div>
              <button
                onClick={onToggleSound}
                className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                  soundEnabled
                    ? 'bg-[#2B1F16] border-[#F4B75E] text-[#F4B75E]'
                    : 'bg-[#15120F] border-[#382E24] text-[#A39686]'
                }`}
              >
                {soundEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {/* Reduced motion toggle */}
            <div className="p-4 rounded-lg bg-[#191512] border border-[#2B231C] flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-[#F2E8D8] block">Reduced Motion</span>
                <span className="text-xs text-[#A39686]">
                  Disables flame flickering and floating embers for sensitivity or low power.
                </span>
              </div>
              <button
                onClick={onToggleReducedMotion}
                className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                  reducedMotion
                    ? 'bg-[#2B1F16] border-[#F4B75E] text-[#F4B75E]'
                    : 'bg-[#15120F] border-[#382E24] text-[#A39686]'
                }`}
              >
                {reducedMotion ? 'On' : 'Off'}
              </button>
            </div>
          </div>

          {/* Section 3: Data Management & Backup */}
          <div className="border-t border-[rgba(242,232,216,0.08)] pt-4 space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#B89A61] block">
              Data Management & Backup
            </span>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenExportImport();
                }}
                className="flex-1 py-2 px-3 text-xs font-medium text-[#F2E8D8] bg-[#191512] border border-[#382E24] hover:border-[#F4B75E] rounded-md transition-colors flex items-center justify-center gap-2"
              >
                <FileJson className="w-4 h-4 text-[#F4B75E]" />
                <span>Export / Import JSON Data</span>
              </button>
            </div>

            {/* Clear all data */}
            <div className="p-4 rounded-lg bg-red-950/20 border border-red-900/40 space-y-2">
              <span className="text-xs font-medium text-red-200 block">Clear All Local Data</span>
              <p className="text-[11px] text-red-300/70">
                Wipes all memories and altar items stored in IndexedDB. Cannot be undone.
              </p>
              {!confirmClear ? (
                <button
                  onClick={() => setConfirmClear(true)}
                  className="px-3 py-1.5 text-xs font-medium text-red-300 hover:text-white bg-red-950/60 border border-red-800 rounded transition-colors"
                >
                  Clear Library...
                </button>
              ) : (
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleConfirmClearAll}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-red-800 hover:bg-red-700 rounded transition-colors"
                  >
                    Yes, Permanently Delete
                  </button>
                  <button
                    onClick={() => setConfirmClear(false)}
                    className="px-3 py-1.5 text-xs text-[#A39686] hover:text-[#F2E8D8]"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Honest Privacy Notice */}
          <div className="p-4 rounded-lg bg-[#191512] border border-[#B89A61]/20 flex items-start gap-3 text-xs text-[#A39686]">
            <ShieldCheck className="w-4 h-4 text-[#B89A61] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-[#F2E8D8] font-medium block">Honest Privacy Disclosure</span>
              <p>
                All data is stored directly in your browser's IndexedDB. Photos are stored as base64 strings in local storage. While browser sandboxing keeps this data isolated from remote websites, it is not separately encrypted with a custom password on your filesystem.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
