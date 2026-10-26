import React, { useState } from 'react';
import { Download, Upload, X, CheckCircle2, AlertCircle, FileJson, ArrowRight } from 'lucide-react';
import { storageService } from '../../services/storage/indexedDB';
import { BackupData, Memory } from '../../types/memory';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => Promise<void>;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  isOpen,
  onClose,
  onDataChanged,
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [importFile, setImportFile] = useState<File | null>(null);
  const [parsedBackup, setParsedBackup] = useState<BackupData | null>(null);
  const [mergeMode, setMergeMode] = useState<'merge' | 'replace'>('merge');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleExportBackup = async () => {
    setIsProcessing(true);
    setStatusMessage(null);
    try {
      const data = await storageService.exportBackup();
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `TheLastLight_Backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setStatusMessage({
        type: 'success',
        text: `Exported ${data.memories.length} memories with photographs and altar items successfully.`,
      });
    } catch (err) {
      console.error('Export error:', err);
      setStatusMessage({ type: 'error', text: 'Failed to create export file.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFile(file);
    setStatusMessage(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const json = JSON.parse(text) as BackupData;

        // Schema validation
        if (!json || typeof json !== 'object') {
          throw new Error('File does not contain valid JSON.');
        }
        if (!Array.isArray(json.memories)) {
          throw new Error('Missing "memories" array in backup schema.');
        }

        setParsedBackup(json);
      } catch (err) {
        setParsedBackup(null);
        setStatusMessage({
          type: 'error',
          text: err instanceof Error ? err.message : 'Invalid backup JSON file.',
        });
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = async () => {
    if (!parsedBackup) return;
    setIsProcessing(true);
    setStatusMessage(null);

    try {
      const result = await storageService.importBackup(parsedBackup, mergeMode);
      await onDataChanged();
      setStatusMessage({
        type: 'success',
        text: `Successfully imported ${result.importedCount} memories into local storage!`,
      });
      setParsedBackup(null);
      setImportFile(null);
    } catch (err) {
      console.error('Import error:', err);
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Import failed.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-xl bg-[#15120F] border border-[#B89A61]/30 rounded-xl shadow-2xl text-[#F2E8D8] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[rgba(242,232,216,0.08)] bg-[#191512] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileJson className="w-5 h-5 text-[#F4B75E]" />
            <h2 className="font-serif text-2xl font-normal">Data Portability</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#A39686] hover:text-[#F2E8D8] rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-[rgba(242,232,216,0.08)] text-xs font-medium">
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 py-3 text-center transition-colors ${
              activeTab === 'export'
                ? 'text-[#F4B75E] border-b-2 border-[#F4B75E] bg-[#191512]'
                : 'text-[#A39686] hover:text-[#F2E8D8]'
            }`}
          >
            Export Backup (JSON)
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-3 text-center transition-colors ${
              activeTab === 'import'
                ? 'text-[#F4B75E] border-b-2 border-[#F4B75E] bg-[#191512]'
                : 'text-[#A39686] hover:text-[#F2E8D8]'
            }`}
          >
            Import Archive
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {statusMessage && (
            <div
              className={`p-3 rounded-md text-xs flex items-center gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-950/40 border border-emerald-800 text-emerald-200'
                  : 'bg-red-950/40 border border-red-800 text-red-200'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-4 text-xs text-[#A39686] leading-relaxed">
              <p>
                Download a complete, offline-compatible backup file containing all your recorded memories, sensory touchstones, attached photographs (as embedded safe data URLs), altar arrangements, and generated writings.
              </p>
              <div className="p-4 rounded-lg bg-[#191512] border border-[#2B231C] space-y-2">
                <span className="text-[#F2E8D8] font-medium block">What will be saved:</span>
                <ul className="list-disc pl-4 space-y-1 text-[#A39686]">
                  <li>All personal memories and titles</li>
                  <li>Attached portraits and photo data URLs</li>
                  <li>Digital Ofrenda shelf positions and dedications</li>
                  <li>Story studio generated passages and history</li>
                </ul>
              </div>
              <button
                onClick={handleExportBackup}
                disabled={isProcessing}
                className="w-full py-2.5 px-4 text-xs sm:text-sm font-semibold text-[#090807] bg-[#F4B75E] hover:bg-[#F2E8D8] rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>{isProcessing ? 'Generating Backup...' : 'Download JSON Backup'}</span>
              </button>
            </div>
          )}

          {activeTab === 'import' && (
            <div className="space-y-4 text-xs text-[#A39686] leading-relaxed">
              <p>
                Restore or merge a previously exported JSON backup file. All data is processed directly inside your browser.
              </p>

              {/* File upload input */}
              <div className="p-4 rounded-lg bg-[#191512] border border-dashed border-[#382E24] text-center">
                <input
                  type="file"
                  id="backupFileInput"
                  accept=".json,application/json"
                  onChange={handleFileSelected}
                  className="hidden"
                />
                <label
                  htmlFor="backupFileInput"
                  className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#F2E8D8] bg-[#241B12] rounded-md hover:bg-[#332619] border border-[#382E24] transition-colors"
                >
                  <Upload className="w-4 h-4 text-[#F4B75E]" />
                  <span>Select JSON Backup File</span>
                </label>
                {importFile && (
                  <span className="block mt-2 text-[#F2E8D8] font-mono text-[11px]">
                    {importFile.name} ({(importFile.size / 1024).toFixed(1)} KB)
                  </span>
                )}
              </div>

              {/* Preview & Confirmation */}
              {parsedBackup && (
                <div className="p-4 rounded-lg bg-[#191512] border border-[#B89A61]/30 space-y-3">
                  <span className="font-serif text-sm text-[#F4B75E] block font-medium">
                    Backup Contents Preview
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[#A39686] block">Memories Found:</span>
                      <strong className="text-[#F2E8D8] text-sm">
                        {parsedBackup.memories.length}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[#A39686] block">Altar Items:</span>
                      <strong className="text-[#F2E8D8] text-sm">
                        {parsedBackup.altarItems?.length || 0}
                      </strong>
                    </div>
                  </div>

                  {/* Merge Mode Choice */}
                  <div className="border-t border-[rgba(242,232,216,0.06)] pt-3 space-y-2">
                    <span className="text-[11px] uppercase tracking-wider text-[#B89A61] block">
                      Import Strategy
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="mergeMode"
                        checked={mergeMode === 'merge'}
                        onChange={() => setMergeMode('merge')}
                        className="text-[#F4B75E] focus:ring-0"
                      />
                      <span>Merge with existing memories (preserves current data)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-amber-300">
                      <input
                        type="radio"
                        name="mergeMode"
                        checked={mergeMode === 'replace'}
                        onChange={() => setMergeMode('replace')}
                        className="text-[#F4B75E] focus:ring-0"
                      />
                      <span>Replace entire library with this backup</span>
                    </label>
                  </div>

                  <button
                    onClick={handleConfirmImport}
                    disabled={isProcessing}
                    className="w-full mt-2 py-2 px-3 text-xs font-semibold text-[#090807] bg-[#F4B75E] hover:bg-[#F2E8D8] rounded-md transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>Confirm and Import</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
