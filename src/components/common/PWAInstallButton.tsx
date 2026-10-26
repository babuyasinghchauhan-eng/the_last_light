import React, { useState } from 'react';
import { Download, Share2, X } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) return null;

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[#F2E8D8] bg-[#1F1B16] border border-[#B89A61]/30 rounded-md hover:border-[#F4B75E] hover:bg-[#2B241D] transition-all whitespace-nowrap shrink-0 shadow-xs ${className}`}
        title="Install The Last Light as an offline PWA on your device"
      >
        <Download className="w-3.5 h-3.5 text-[#F4B75E]" />
        <span>Install App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#F2E8D8] bg-[#1F1B16] border border-[#B89A61]/30 rounded-md hover:border-[#F4B75E] transition-all whitespace-nowrap shrink-0 ${className}`}
        >
          <Download className="w-3.5 h-3.5 text-[#F4B75E]" />
          <span>Install on iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-xl bg-[#15120F] border border-[#B89A61]/40 p-6 text-[#F2E8D8] shadow-2xl relative">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 text-[#A39686] hover:text-[#F2E8D8] p-1"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-[#241B12] border border-[#F4B75E]/30">
                  <Share2 className="w-5 h-5 text-[#F4B75E]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-medium">Install on iPhone / iPad</h3>
                  <p className="text-xs text-[#A39686]">Keep your memories close offline</p>
                </div>
              </div>

              <ol className="space-y-3 text-xs text-[#F2E8D8]/80 pl-4 list-decimal leading-relaxed">
                <li>
                  Tap the <strong className="text-[#F4B75E]">Share</strong> icon in the bottom Safari toolbar.
                </li>
                <li>
                  Scroll down the share sheet and tap <strong className="text-[#F4B75E]">Add to Home Screen</strong>.
                </li>
                <li>
                  Tap <strong className="text-[#F4B75E]">Add</strong> in the top-right corner to launch in standalone offline mode.
                </li>
              </ol>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full py-2.5 text-xs font-medium text-[#090807] bg-[#F4B75E] rounded-md hover:bg-[#F2E8D8] transition-colors"
              >
                Understood
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
