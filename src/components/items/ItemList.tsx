import React, { useState } from 'react';
import { PurchaseItem, PurchaseStatus } from '../../types/purchase';
import { ItemCard } from './ItemCard';
import { formatBRL } from '../../utils/calculations';
import { 
  Search, 
  PiggyBank, 
  Clock, 
  PlusCircle 
} from 'lucide-react';

interface ItemListProps {
  items: PurchaseItem[];
  onUpdateStatus: (id: string, status: PurchaseStatus) => void;
  onOpenReview: (item: PurchaseItem) => void;
  onViewSummary: (item: PurchaseItem) => void;
  onOpenEmojiPicker: (item: PurchaseItem) => void;
  onEditItem?: (item: PurchaseItem) => void;
  onDeleteItem: (id: string) => void;
  onNavigateToWizard: () => void;
}

export const ItemList: React.FC<ItemListProps> = ({
  items,
  onUpdateStatus,
  onOpenReview,
  onViewSummary,
  onOpenEmojiPicker,
  onEditItem,
  onDeleteItem,
  onNavigateToWizard,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Cálculos rápidos para o resumo no topo
  const totalSaved = items
    .filter((item) => item.status === 'passed')
    .reduce((acc, curr) => acc + (curr.input.price || 0), 0);

  const quarantineCount = items.filter((item) => item.status === 'quarantine').length;
  const boughtCount = items.filter((item) => item.status === 'bought' || item.status === 'reviewed').length;

  const filteredItems = items.filter((item) => {
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesSearch =
      searchTerm.trim() === '' ||
      item.input.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.input.model && item.input.model.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.input.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 pb-20 animate-fade-in">
      {/* Resumo Rápido no Topo */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {/* Card Economia */}
        <div className="col-span-2 sm:col-span-1 rounded-2xl border border-[#ffbb00]/25 bg-gradient-to-br from-[#ffbb00]/15 to-transparent p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-[#ffbb00]">
            <PiggyBank className="h-4 w-4 text-[#ffbb00]" />
            <span>Dinheiro Salvo</span>
          </div>
          <div className="mt-1.5 text-xl font-extrabold text-white">
            {formatBRL(totalSaved)}
          </div>
          <div className="text-[10px] text-zinc-400">
            em compras evitadas por impulso
          </div>
        </div>

        {/* Card Quarentena */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
            <Clock className="h-4 w-4" />
            <span>Em Quarentena</span>
          </div>
          <div className="mt-1.5 text-xl font-extrabold text-white">
            {quarantineCount} {quarantineCount === 1 ? 'item' : 'itens'}
          </div>
          <div className="text-[10px] text-zinc-400">
            aguardando o tempo esfriar
          </div>
        </div>

        {/* Card Comprados */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
            <span>🛒</span>
            <span>Comprados</span>
          </div>
          <div className="mt-1.5 text-xl font-extrabold text-white">
            {boughtCount} {boughtCount === 1 ? 'item' : 'itens'}
          </div>
          <div className="text-[10px] text-zinc-400">
            adquiridos e em uso
          </div>
        </div>
      </div>

      {/* Controles de Busca & Filtros */}
      <div className="space-y-3">
        {/* Barra de Busca */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por produto ou modelo..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-[#ffbb00] focus:outline-none focus:ring-1 focus:ring-[#ffbb00]"
          />
        </div>

        {/* Filtros em Pílulas */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {[
            { id: 'all', label: `Todos (${items.length})` },
            { id: 'quarantine', label: `⏳ Quarentena (${quarantineCount})` },
            { id: 'passed', label: `❌ Desisti` },
            { id: 'bought', label: `🛒 Comprados` },
            { id: 'reviewed', label: `⭐ Avaliados` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 font-bold transition-all tap-effect ${
                filterStatus === tab.id
                  ? 'bg-[#ffbb00] text-black font-extrabold shadow-md shadow-[#ffbb00]/10'
                  : 'border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Cards */}
      {filteredItems.length > 0 ? (
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onUpdateStatus={onUpdateStatus}
              onOpenReview={onOpenReview}
              onViewSummary={onViewSummary}
              onOpenEmojiPicker={onOpenEmojiPicker}
              onEditItem={onEditItem}
              onDeleteItem={onDeleteItem}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/60 p-8 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-zinc-400 text-2xl border border-zinc-800">
            🔍
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">Nenhum item encontrado</h4>
            <p className="text-xs text-zinc-400">
              {searchTerm 
                ? 'Tente mudar o termo da busca ou o filtro selecionado.' 
                : 'Seu histórico está limpo. Que tal avaliar uma compra que você está pensando em fazer?'}
            </p>
          </div>
          <button
            onClick={onNavigateToWizard}
            className="inline-flex items-center gap-2 rounded-xl bg-[#ffbb00] px-4 py-2.5 text-xs font-black uppercase text-black hover:bg-[#e5a800] transition-all shadow-lg shadow-[#ffbb00]/20 tap-effect"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Fazer Nova Avaliação</span>
          </button>
        </div>
      )}
    </div>
  );
};
