import React from 'react';
import { PurchaseItem, PurchaseStatus } from '../../types/purchase';
import { formatBRL, CATEGORY_LABELS } from '../../utils/calculations';
import { 
  Clock, 
  CheckCircle2, 
  Ban, 
  Sparkles, 
  Trash2, 
  ExternalLink, 
  Star, 
  ShoppingBag,
  RotateCcw
} from 'lucide-react';

interface ItemCardProps {
  item: PurchaseItem;
  onUpdateStatus: (id: string, status: PurchaseStatus) => void;
  onOpenReview: (item: PurchaseItem) => void;
  onDeleteItem: (id: string) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onUpdateStatus,
  onOpenReview,
  onDeleteItem,
}) => {
  const categoryInfo = CATEGORY_LABELS[item.input.category] || { label: item.input.category, icon: '📦' };

  // Dias em quarentena passados
  const createdDate = new Date(item.createdAt);
  const daysSince = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
  const quarantineDaysLeft = Math.max(0, 7 - daysSince);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 backdrop-blur-md transition-all hover:border-slate-700/80">
      {/* Top row: Category, Name, Price and Score */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800/80 text-xl">
            {categoryInfo.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug">
                {item.input.name}
              </h3>
              {item.input.link && (
                <a
                  href={item.input.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-emerald-400"
                  title="Abrir link do produto"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
              <span>{categoryInfo.label}</span>
              <span>•</span>
              <span>{createdDate.toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
        </div>

        {/* Score & Preço */}
        <div className="text-right shrink-0">
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

      {/* Metrics breakdown */}
      <div className="mt-3.5 grid grid-cols-2 sm:grid-cols-3 gap-2 border-t border-slate-800/80 pt-3">
        <div className="rounded-lg bg-slate-950/40 p-2 text-left">
          <span className="text-[10px] text-slate-400">Custo por uso</span>
          <div className="text-xs font-bold text-emerald-400">
            {formatBRL(item.metrics.costPerUse)}
          </div>
        </div>

        <div className="rounded-lg bg-slate-950/40 p-2 text-left">
          <span className="text-[10px] text-slate-400">Horas de trabalho</span>
          <div className="text-xs font-bold text-blue-400">
            {item.metrics.hoursOfWork < 10 
              ? `${item.metrics.hoursOfWork.toFixed(1)}h` 
              : `${(item.metrics.hoursOfWork / 8).toFixed(1)} dias`}
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 rounded-lg bg-slate-950/40 p-2 text-left">
          <span className="text-[10px] text-slate-400">Status</span>
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
              <span className="text-blue-400 flex items-center gap-1">
                <ShoppingBag className="h-3 w-3" /> Comprado (Pendente Review)
              </span>
            )}
            {item.status === 'reviewed' && (
              <span className="text-emerald-400 flex items-center gap-1">
                <Star className="h-3 w-3 fill-emerald-400" /> 
                {item.review?.wasWorthIt ? 'Valeu a pena!' : 'Arrependido'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Se já foi avaliado (Review), mostra o badge de reflexão */}
      {item.review && (
        <div className="mt-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-2.5 text-xs text-slate-300">
          <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400 mb-1">
            <span>Review Pós-Compra ({item.review.satisfactionRating}/5 ⭐)</span>
            <span>Uso real: {formatBRL(item.review.actualCostPerUse)} / uso</span>
          </div>
          {item.review.reflection && (
            <p className="text-[11px] italic text-slate-400">
              "{item.review.reflection}"
            </p>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 pt-3">
        <div className="flex flex-wrap items-center gap-1.5">
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
                className="flex items-center gap-1 rounded-lg border border-blue-500/30 bg-blue-500/10 px-2.5 py-1.5 text-xs font-semibold text-blue-300 hover:bg-blue-500/20 tap-effect"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Comprei</span>
              </button>
            </>
          )}

          {item.status === 'bought' && (
            <button
              onClick={() => onOpenReview(item)}
              className="flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/20 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/30 tap-effect"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Fazer Review Pós-Compra</span>
            </button>
          )}

          {item.status === 'reviewed' && (
            <button
              onClick={() => onOpenReview(item)}
              className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white tap-effect"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Editar Review</span>
            </button>
          )}

          {item.status === 'passed' && (
            <button
              onClick={() => onUpdateStatus(item.id, 'quarantine')}
              className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white tap-effect"
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
          className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
          title="Excluir item"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
