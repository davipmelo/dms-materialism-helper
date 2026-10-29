import React from 'react';
import { ShieldCheck, PlusCircle, ListChecks, BarChart3, Settings } from 'lucide-react';

interface NavbarProps {
  currentTab: 'wizard' | 'items' | 'stats';
  onSelectTab: (tab: 'wizard' | 'items' | 'stats') => void;
  onOpenSettings: () => void;
  itemsCount: {
    quarantine: number;
    total: number;
  };
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenSettings,
  itemsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-black/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <div 
          onClick={() => onSelectTab('wizard')}
          className="flex cursor-pointer items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ffbb00] text-black shadow-lg shadow-[#ffbb00]/20 font-black">
            <ShieldCheck className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-sm sm:text-base font-black tracking-tight text-white uppercase">
              DM`S <span className="text-[#ffbb00]">MATERIALISM HELPER</span>
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-zinc-800 bg-zinc-900/80 p-1">
          <button
            onClick={() => onSelectTab('wizard')}
            className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              currentTab === 'wizard'
                ? 'bg-[#ffbb00] text-black shadow-sm font-extrabold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <PlusCircle className="h-4 w-4" />
            Novo Teste
          </button>

          <button
            onClick={() => onSelectTab('items')}
            className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              currentTab === 'items'
                ? 'bg-[#ffbb00] text-black shadow-sm font-extrabold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <ListChecks className="h-4 w-4" />
            Histórico
            {itemsCount.quarantine > 0 && (
              <span className="ml-1 rounded-full bg-amber-500/20 px-1.5 py-0.2 text-[10px] font-bold text-amber-400">
                {itemsCount.quarantine}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('stats')}
            className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              currentTab === 'stats'
                ? 'bg-[#ffbb00] text-black shadow-sm font-extrabold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            Estatísticas
          </button>
        </nav>

        {/* Actions (Settings / Profile) */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSettings}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/80 text-zinc-300 transition-colors hover:border-[#ffbb00]/50 hover:bg-zinc-800 hover:text-[#ffbb00] tap-effect"
            title="Configurações e Backup"
            aria-label="Configurações"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
