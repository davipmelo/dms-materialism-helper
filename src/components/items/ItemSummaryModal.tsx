import React from 'react';
import { PurchaseItem, PurchaseStatus } from '../../types/purchase';
import { formatBRL, CATEGORY_LABELS } from '../../utils/calculations';
import { 
  X, 
  Sparkles, 
  Briefcase, 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  ShieldAlert, 
  Bookmark, 
  Ban, 
  CheckCircle2, 
  Star, 
  Smile,
  Pencil
} from 'lucide-react';
import { DossierSheet } from './DossierSheet';
import confetti from 'canvas-confetti';

interface ItemSummaryModalProps {
  item: PurchaseItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: PurchaseStatus) => void;
  onOpenReview: (item: PurchaseItem) => void;
  onOpenEmojiPicker?: (item: PurchaseItem) => void;
  onEditItem?: (item: PurchaseItem) => void;
}

export const ItemSummaryModal: React.FC<ItemSummaryModalProps> = ({
  item,
  isOpen,
  onClose,
  onUpdateStatus,
  onOpenReview,
  onOpenEmojiPicker,
  onEditItem,
}) => {
  if (!isOpen || !item) return null;

  const { input, metrics } = item;
  const categoryInfo = CATEGORY_LABELS[input.category] || { label: input.category, icon: '📦' };
  const displayIcon = item.customIcon || input.customIcon || categoryInfo.icon;

  const handlePassed = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ffbb00', '#f59e0b', '#fde047'],
    });
    onUpdateStatus(item.id, 'passed');
    onClose();
  };

  const getScoreDialColor = (score: number) => {
    if (score >= 80) return 'stroke-[#ffbb00] text-[#ffbb00]';
    if (score >= 60) return 'stroke-amber-400 text-amber-400';
    if (score >= 40) return 'stroke-orange-400 text-orange-400';
    return 'stroke-rose-400 text-rose-400';
  };

  const getScoreBgGlow = (score: number) => {
    if (score >= 80) return 'from-[#ffbb00]/20 to-transparent border-[#ffbb00]/40';
    if (score >= 60) return 'from-amber-500/20 to-transparent border-amber-500/30';
    if (score >= 40) return 'from-orange-500/20 to-transparent border-orange-500/30';
    return 'from-rose-500/20 to-transparent border-rose-500/30';
  };

  // Formatação de anos e meses
  const years = Math.floor(input.lifespanMonths / 12);
  const months = input.lifespanMonths % 12;
  const lifespanFormatted = [
    years > 0 ? `${years} ${years === 1 ? 'ano' : 'anos'}` : null,
    months > 0 ? `${months} ${months === 1 ? 'mês' : 'meses'}` : null,
  ].filter(Boolean).join(' e ') || '1 mês';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Botão de Fechar e Botão de Editar no Topo */}
        <div className="absolute top-5 right-5 flex items-center gap-2 z-10">
          {onEditItem && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onEditItem(item);
              }}
              className="flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/90 px-3 py-1.5 text-xs font-bold text-[#ffbb00] hover:bg-zinc-800 hover:border-[#ffbb00]/50 transition-all tap-effect"
              title="Editar respostas deste formulário"
            >
              <Pencil className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Editar</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="rounded-full border border-zinc-800 bg-zinc-900 p-2 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
            title="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Card Principal de Veredito */}
        <div className={`relative overflow-hidden rounded-3xl border bg-gradient-to-b p-5 sm:p-7 backdrop-blur-xl ${getScoreBgGlow(metrics.score)}`}>
          {/* Header do Item */}
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-4 pr-8 sm:pr-0">
            <div className="flex items-start gap-3">
              {/* Botão de Emoji */}
              <button
                type="button"
                onClick={() => onOpenEmojiPicker && onOpenEmojiPicker(item)}
                className="group relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-700 text-3xl transition-transform hover:scale-110 hover:border-[#ffbb00] tap-effect"
                title="Mudar emoji do item"
              >
                <span>{displayIcon}</span>
                <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-950 border border-zinc-700 text-zinc-400">
                  <Smile className="h-2.5 w-2.5 text-[#ffbb00]" />
                </div>
              </button>

              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#ffbb00]">
                  {categoryInfo.label}
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight uppercase">
                  {input.name}
                </h2>
                {input.model && (
                  <div className="inline-block mt-0.5 rounded-md bg-zinc-800/80 px-2 py-0.5 text-xs font-semibold text-zinc-300 border border-zinc-700/60">
                    Modelo: <span className="text-white">{input.model}</span>
                  </div>
                )}
                <div className="text-xs text-zinc-400 mt-1">
                  Registrado em {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-2xl font-black text-white">
                {formatBRL(input.price)}
              </div>
              <div className="text-[11px] text-zinc-400">preço total</div>
            </div>
          </div>

          {/* Mostrador de Score e Veredito */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
            {/* Círculo do Score */}
            <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-zinc-800"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className={getScoreDialColor(metrics.score)}
                  strokeWidth="8"
                  strokeDasharray={264}
                  strokeDashoffset={264 - (264 * metrics.score) / 100}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black tracking-tight text-white">
                  {metrics.score}%
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Score
                </span>
              </div>
            </div>

            {/* Veredito em texto */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border border-white/10 bg-black/40">
                {metrics.score >= 60 ? (
                  <ShieldCheck className="h-4 w-4 text-[#ffbb00]" />
                ) : (
                  <ShieldAlert className="h-4 w-4 text-rose-400" />
                )}
                <span className="text-white">{metrics.tierLabel}</span>
              </div>
              <p className="text-sm sm:text-base font-medium text-zinc-200 leading-snug">
                {metrics.verdict}
              </p>
            </div>
          </div>

          {/* Grade de Métricas-Chave */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Custo por uso */}
            <div className="rounded-xl border border-white/5 bg-black/50 p-3.5 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                <Sparkles className="h-3.5 w-3.5 text-[#ffbb00]" />
                <span>Custo por uso</span>
              </div>
              <div className="mt-1 text-lg font-bold text-[#ffbb00]">
                {formatBRL(metrics.costPerUse)}
              </div>
              <div className="text-[10px] text-zinc-400">
                ~{metrics.totalEstimatedUses} utilizações em {lifespanFormatted}
              </div>
            </div>

            {/* Horas de trabalho */}
            <div className="rounded-xl border border-white/5 bg-black/50 p-3.5 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                <Briefcase className="h-3.5 w-3.5 text-amber-400" />
                <span>Horas de vida</span>
              </div>
              <div className="mt-1 text-lg font-bold text-amber-300">
                {metrics.hoursOfWork < 10 
                  ? `${metrics.hoursOfWork.toFixed(1)}h` 
                  : `${(metrics.hoursOfWork / 8).toFixed(1)} dias`}
              </div>
              <div className="text-[10px] text-zinc-400">
                de esforço líquido para pagar
              </div>
            </div>

            {/* Custo de oportunidade */}
            <div className="rounded-xl border border-white/5 bg-black/50 p-3.5 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                <TrendingUp className="h-3.5 w-3.5 text-[#ffbb00]" />
                <span>Em 2 anos no CDI</span>
              </div>
              <div className="mt-1 text-lg font-bold text-zinc-200">
                {formatBRL(metrics.opportunityCost2Years)}
              </div>
              <div className="text-[10px] text-zinc-400">
                se mantivesse investido
              </div>
            </div>
          </div>

          {/* Lista de Insights Inteligentes */}
          <div className="mt-6 space-y-2 rounded-xl border border-white/5 bg-black/40 p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-[#ffbb00]" /> Insights & Diagnóstico
            </div>
            <div className="space-y-1.5 pt-1">
              {metrics.insights.map((insight, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300 leading-relaxed">
                  <span className="text-[#ffbb00] mt-0.5 font-bold">•</span>
                  <span>{insight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dossiê Completo: Motivo, Link da Loja (se colado) e Ficha de Respostas */}
        <DossierSheet input={input} metrics={metrics} />

        {/* Informações de Review (se já tiver sido avaliado) */}
        {item.review && (
          <div className="rounded-2xl border border-[#ffbb00]/30 bg-[#ffbb00]/5 p-4 text-xs space-y-2">
            <div className="flex items-center justify-between text-zinc-200 font-bold">
              <span className="flex items-center gap-1.5 text-[#ffbb00]">
                <Star className="h-4 w-4 fill-[#ffbb00]" />
                Review Pós-Compra ({item.review.satisfactionRating}/5)
              </span>
              <span>Custo Real: {formatBRL(item.review.actualCostPerUse)} / uso</span>
            </div>
            {item.review.reflection && (
              <p className="text-zinc-400 italic">"{item.review.reflection}"</p>
            )}
          </div>
        )}

        {/* Ações para o Item: Editar respostas & Alterar status */}
        <div className="space-y-4 pt-3 border-t border-zinc-800">
          {onEditItem && (
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800">
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Pencil className="h-3.5 w-3.5 text-[#ffbb00]" />
                  <span>Algo mudou sobre essa compra?</span>
                </div>
                <div className="text-[11px] text-zinc-400 mt-0.5">
                  Reabra o questionário preenchido para alterar respostas e recalcular o veredito.
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEditItem(item);
                }}
                className="flex items-center gap-1.5 rounded-xl border border-[#ffbb00]/50 bg-[#ffbb00] px-3.5 py-2 text-xs font-black uppercase text-black hover:bg-[#e5a800] transition-all tap-effect shadow-md shadow-[#ffbb00]/15 shrink-0"
              >
                <Pencil className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>Editar Respostas</span>
              </button>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Alterar status:
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  onUpdateStatus(item.id, 'quarantine');
                  onClose();
                }}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold tap-effect ${
                  item.status === 'quarantine'
                    ? 'border-[#ffbb00] bg-[#ffbb00]/20 text-[#ffbb00]'
                    : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white'
                }`}
              >
                <Bookmark className="h-3.5 w-3.5" />
                <span>Quarentena</span>
              </button>

              <button
                onClick={handlePassed}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold tap-effect ${
                  item.status === 'passed'
                    ? 'border-rose-500 bg-rose-500/20 text-rose-300'
                    : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white'
                }`}
              >
                <Ban className="h-3.5 w-3.5" />
                <span>Desisti</span>
              </button>

              <button
                onClick={() => {
                  onUpdateStatus(item.id, 'bought');
                  onClose();
                }}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold tap-effect ${
                  item.status === 'bought'
                    ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                    : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white'
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Comprei</span>
              </button>

              {(item.status === 'bought' || item.status === 'reviewed') && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenReview(item);
                  }}
                  className="flex items-center gap-1.5 rounded-xl border border-[#ffbb00]/40 bg-[#ffbb00]/20 px-3 py-2 text-xs font-black text-[#ffbb00] hover:bg-[#ffbb00]/30 tap-effect"
                >
                  <Star className="h-3.5 w-3.5 fill-[#ffbb00]" />
                  <span>{item.review ? 'Editar Review' : 'Fazer Review'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
