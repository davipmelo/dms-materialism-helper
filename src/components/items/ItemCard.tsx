import React from 'react';
import { PurchaseItem, PurchaseStatus } from '../../types/purchase';
import { formatBRL, CATEGORY_LABELS } from '../../utils/calculations';
import { 
  Clock, 
  CheckCircle2, 
  Ban, 
  Trash2, 
  ExternalLink, 
  Star, 
  ShoppingBag,
  RotateCcw,
  Sparkles,
  Smile
} from 'lucide-react';

interface ItemCardProps {
  item: PurchaseItem;
  onUpdateStatus: (id: string, status: PurchaseStatus) => void;
  onOpenReview: (item: PurchaseItem) => void;
  onViewSummary: (item: PurchaseItem) => void;
  onOpenEmojiPicker: (item: PurchaseItem) => void;
  onDeleteItem: (id: string) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onUpdateStatus,
  onOpenReview,
  onViewSummary,
  onOpenEmojiPicker,
  onDeleteItem,
}) => {
  const categoryInfo = CATEGORY_LABELS[item.input.category] || { label: item.input.category, icon: '📦' };
  const displayIcon = item.customIcon || item.input.customIcon || categoryInfo.icon;

  // Dias em quarentena passados
  const createdDate = new Date(item.createdAt);
  const daysSince = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
  const quarantineDaysLeft = Math.max(0, 7 - daysSince);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-5 backdrop-blur-md transition-all hover:border-zinc-700">
      {/* Top row: Category, Name, Model, Price and Score */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          {/* Botão de Emoji Interativo para mudar o ícone */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenEmojiPicker(item);
            }}
            className="group relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-zinc-800/80 text-2xl transition-all hover:scale-110 hover:border hover:border-[#ffbb00] tap-effect"
            title="Clique para alterar o emoji deste item"
          >
            <span>{displayIcon}</span>
            <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-900 border border-zinc-700 text-zinc-400 opacity-70 group-hover:opacity-100">
              <Smile className="h-2.5 w-2.5 text-[#ffbb00]" />
            </div>
          </button>

          {/* Nome e Modelo */}
          <div 
            onClick={() => onViewSummary(item)}
            className="cursor-pointer group flex-1"
          >
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug group-hover:text-[#ffbb00] transition-colors">
                {item.input.name}
              </h3>
              {item.input.model && (
                <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[11px] font-medium text-zinc-300 border border-zinc-700">
                  {item.input.model}
                </span>
              )}
              {item.input.link && (
                <a
                  href={item.input.link}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-zinc-500 hover:text-[#ffbb00]"
                  title="Abrir link do produto"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-400">
              <span>{categoryInfo.label}</span>
              <span>•</span>
              <span>{createdDate.toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
        </div>

        {/* Score & Preço */}
        <div 
          onClick={() => onViewSummary(item)}
          className="text-right shrink-0 cursor-pointer"
        >
          <div className="text-base font-extrabold text-white">
            {formatBRL(item.input.price)}
          </div>
          <div className={`mt-0.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border ${item.metrics.tierColor}`}>
            <span>{item.metrics.score}%</span>
            <span>•</span>
            <span>{item.metrics.tierLabel}</span>
          </div>
        </div>
      </div>

      {/* Metrics breakdown (Clickable to view full analysis) */}
      <div 
        onClick={() => onViewSummary(item)}
        className="mt-3.5 grid grid-cols-2 sm:grid-cols-3 gap-2 border-t border-zinc-800/80 pt-3 cursor-pointer"
      >
        <div className="rounded-lg bg-zinc-950/60 p-2 text-left">
          <span className="text-[10px] text-zinc-400">Custo por uso</span>
          <div className="text-xs font-bold text-[#ffbb00]">
            {formatBRL(item.metrics.costPerUse)}
          </div>
        </div>

        <div className="rounded-lg bg-zinc-950/60 p-2 text-left">
          <span className="text-[10px] text-zinc-400">Horas de trabalho</span>
          <div className="text-xs font-bold text-amber-300">
            {item.metrics.hoursOfWork < 10 
              ? `${item.metrics.hoursOfWork.toFixed(1)}h` 
              : `${(item.metrics.hoursOfWork / 8).toFixed(1)} dias`}
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 rounded-lg bg-zinc-950/60 p-2 text-left">
          <span className="text-[10px] text-zinc-400">Status</span>
          <div className="text-xs font-bold">
            {item.status === 'quarantine' && (
              <span className="text-amber-400 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {quarantineDaysLeft > 0 ? `Quarentena (${quarantineDaysLeft}d)` : 'Quarentena concluída!'}
              </span>
            )}
            {item.status === 'passed' && (
              <span className="text-rose-400 flex items-center gap-1">
                <Ban className="h-3 w-3" /> Economizou R$ {item.input.price}
              </span>
            )}
            {item.status === 'bought' && (
              <span className="text-[#ffbb00] flex items-center gap-1">
                <ShoppingBag className="h-3 w-3" /> Comprado (Pendente Review)
              </span>
            )}
            {item.status === 'reviewed' && (
              <span className="text-[#ffbb00] flex items-center gap-1">
                <Star className="h-3 w-3 fill-[#ffbb00]" /> 
                {item.review?.wasWorthIt ? 'Valeu a pena!' : 'Arrependido'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Se já foi avaliado (Review), mostra o badge de reflexão */}
      {item.review && (
        <div 
          onClick={() => onViewSummary(item)}
          className="mt-3 rounded-xl border border-[#ffbb00]/25 bg-[#ffbb00]/5 p-2.5 text-xs text-zinc-300 cursor-pointer"
        >
          <div className="flex items-center justify-between text-[11px] font-bold text-[#ffbb00] mb-1">
            <span>Review Pós-Compra ({item.review.satisfactionRating}/5 ⭐)</span>
            <span>Uso real: {formatBRL(item.review.actualCostPerUse)} / uso</span>
          </div>
          {item.review.reflection && (
            <p className="text-[11px] italic text-zinc-400">
              "{item.review.reflection}"
            </p>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-800/80 pt-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Botão de ver análise */}
          <button
            onClick={() => onViewSummary(item)}
            className="flex items-center gap-1 rounded-lg border border-[#ffbb00]/30 bg-[#ffbb00]/10 px-2.5 py-1.5 text-xs font-bold text-[#ffbb00] hover:bg-[#ffbb00]/20 tap-effect"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Ver Dossiê</span>
          </button>

          {item.status === 'quarantine' && (
            <>
              <button
                onClick={() => onUpdateStatus(item.id, 'passed')}
                className="flex items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 tap-effect"
              >
                <Ban className="h-3.5 w-3.5" />
                <span>Desisti</span>
              </button>

              <button
                onClick={() => onUpdateStatus(item.id, 'bought')}
                className="flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-800 px-2.5 py-1.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 tap-effect"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Comprei</span>
              </button>
            </>
          )}

          {item.status === 'bought' && (
            <button
              onClick={() => onOpenReview(item)}
              className="flex items-center gap-1.5 rounded-lg border border-[#ffbb00]/40 bg-[#ffbb00]/20 px-3 py-1.5 text-xs font-bold text-[#ffbb00] hover:bg-[#ffbb00]/30 tap-effect"
            >
              <Star className="h-3.5 w-3.5 fill-[#ffbb00]" />
              <span>Fazer Review Pós-Compra</span>
            </button>
          )}

          {item.status === 'reviewed' && (
            <button
              onClick={() => onOpenReview(item)}
              className="flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-800 px-2.5 py-1.5 text-xs font-medium text-zinc-300 hover:text-white tap-effect"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Editar Review</span>
            </button>
          )}

          {item.status === 'passed' && (
            <button
              onClick={() => onUpdateStatus(item.id, 'quarantine')}
              className="flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-800 px-2.5 py-1.5 text-xs font-medium text-zinc-300 hover:text-white tap-effect"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reativar Quarentena</span>
            </button>
          )}
        </div>

        {/* Delete button */}
        <button
          onClick={() => {
            if (confirm(`Remover "${item.input.name}" do seu histórico?`)) {
              onDeleteItem(item.id);
            }
          }}
          className="rounded-lg p-1.5 text-zinc-500 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
          title="Excluir item"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
