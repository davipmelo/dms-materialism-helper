import React from 'react';
import { PlusCircle, ListChecks, BarChart3, Settings } from 'lucide-react';

interface BottomNavProps {
  currentTab: 'wizard' | 'items' | 'stats';
  onSelectTab: (tab: 'wizard' | 'items' | 'stats') => void;
  onOpenSettings: () => void;
  quarantineCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenSettings,
  quarantineCount,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-800/90 bg-black/90 backdrop-blur-lg pb-[env(safe-area-inset-bottom,8px)] md:hidden">
      <div className="grid grid-cols-4 h-14 items-center">
        {/* Wizard */}
        <button
          onClick={() => onSelectTab('wizard')}
          className={`flex flex-col items-center justify-center gap-1 h-full tap-effect transition-colors ${
            currentTab === 'wizard' ? 'text-[#ffbb00] font-black' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <PlusCircle className={`h-5 w-5 ${currentTab === 'wizard' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px]">Avaliar</span>
        </button>

        {/* Items List */}
        <button
          onClick={() => onSelectTab('items')}
          className={`relative flex flex-col items-center justify-center gap-1 h-full tap-effect transition-colors ${
            currentTab === 'items' ? 'text-[#ffbb00] font-black' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <div className="relative">
            <ListChecks className={`h-5 w-5 ${currentTab === 'items' ? 'stroke-[2.5]' : ''}`} />
            {quarantineCount > 0 && (
              <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ffbb00] px-1 text-[9px] font-black text-black">
                {quarantineCount}
              </span>
            )}
          </div>
          <span className="text-[10px]">Histórico</span>
        </button>

        {/* Stats */}
        <button
          onClick={() => onSelectTab('stats')}
          className={`flex flex-col items-center justify-center gap-1 h-full tap-effect transition-colors ${
            currentTab === 'stats' ? 'text-[#ffbb00] font-black' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <BarChart3 className={`h-5 w-5 ${currentTab === 'stats' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px]">Estatísticas</span>
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="flex flex-col items-center justify-center gap-1 h-full tap-effect text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <Settings className="h-5 w-5" />
          <span className="text-[10px]">Config</span>
        </button>
      </div>
    </div>
  );
};
