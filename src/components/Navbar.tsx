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
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <div 
          onClick={() => onSelectTab('wizard')}
          className="flex cursor-pointer items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20">
            <ShieldCheck className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-white sm:text-lg">
              Materialism<span className="text-emerald-400">Helper</span>
            </span>
            <span className="hidden text-xs text-slate-400 sm:inline sm:ml-2">
              • Anti-Impulso
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-slate-800 bg-slate-900/60 p-1">
          <button
            onClick={() => onSelectTab('wizard')}
            className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
              currentTab === 'wizard'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <PlusCircle className="h-4 w-4" />
            Novo Teste
          </button>

          <button
            onClick={() => onSelectTab('items')}
            className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
              currentTab === 'items'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
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
            className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
              currentTab === 'stats'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
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
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 text-slate-300 transition-colors hover:border-slate-700 hover:bg-slate-800 hover:text-white tap-effect"
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

