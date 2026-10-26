import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="fixed bottom-4 left-4 z-40 flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#1F1B16] border border-[#E87932]/50 text-[#F2E8D8] text-xs shadow-xl backdrop-blur-xs"
    >
      <WifiOff className="w-3.5 h-3.5 text-[#E87932]" />
      <span>Offline Mode — All memories and cached AI work locally</span>
    </div>
  );
};
