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
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-lg pb-[env(safe-area-inset-bottom,8px)] md:hidden">
      <div className="grid grid-cols-4 h-14 items-center">
        {/* Wizard */}
        <button
          onClick={() => onSelectTab('wizard')}
          className={`flex flex-col items-center justify-center gap-1 h-full tap-effect transition-colors ${
            currentTab === 'wizard' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <PlusCircle className={`h-5 w-5 ${currentTab === 'wizard' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px]">Avaliar</span>
        </button>

        {/* Items List */}
        <button
          onClick={() => onSelectTab('items')}
          className={`relative flex flex-col items-center justify-center gap-1 h-full tap-effect transition-colors ${
            currentTab === 'items' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <ListChecks className={`h-5 w-5 ${currentTab === 'items' ? 'stroke-[2.5]' : ''}`} />
            {quarantineCount > 0 && (
              <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[9px] font-bold text-slate-950">
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
            currentTab === 'stats' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className={`h-5 w-5 ${currentTab === 'stats' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px]">Estatísticas</span>
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="flex flex-col items-center justify-center gap-1 h-full tap-effect text-slate-400 hover:text-slate-200 transition-colors"
        >
          <Settings className="h-5 w-5" />
          <span className="text-[10px]">Config</span>
        </button>
      </div>
    </div>
  );
};
