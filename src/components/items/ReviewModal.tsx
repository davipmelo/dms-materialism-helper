import React, { useState } from 'react';
import { 
  PurchaseItem, 
  PurchaseReview, 
  UsageFrequency 
} from '../../types/purchase';
import { 
  ANNUAL_USES, 
  formatBRL, 
  FREQUENCY_LABELS 
} from '../../utils/calculations';
import { 
  X, 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  Sparkles, 
  Scale 
} from 'lucide-react';

interface ReviewModalProps {
  item: PurchaseItem;
  isOpen: boolean;
  onClose: () => void;
  onSubmitReview: (itemId: string, review: PurchaseReview) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  item,
  isOpen,
  onClose,
  onSubmitReview,
}) => {
  if (!isOpen) return null;

  const [actualFrequency, setActualFrequency] = useState<UsageFrequency>(
    item.review?.actualFrequency || item.input.frequency
  );
  const [stillUsing, setStillUsing] = useState<boolean>(
    item.review?.stillUsing ?? true
  );
  const [satisfactionRating, setSatisfactionRating] = useState<number>(
    item.review?.satisfactionRating || 4
  );
  const [wasWorthIt, setWasWorthIt] = useState<boolean>(
    item.review?.wasWorthIt ?? true
  );
  const [reflection, setReflection] = useState<string>(
    item.review?.reflection || ''
  );

  // Cálculo da frequência e custo por uso real
  const annualRealUses = ANNUAL_USES[actualFrequency] || 52;
  const lifespanYears = Math.max(0.08, (item.input.lifespanMonths || 12) / 12);
  const totalActualUses = Math.max(1, Math.round(annualRealUses * lifespanYears));
  const actualCostPerUse = item.input.price / totalActualUses;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const reviewData: PurchaseReview = {
      reviewDate: new Date().toISOString(),
      actualFrequency,
      actualCostPerUse,
      stillUsing,
      satisfactionRating,
      reflection,
      wasWorthIt,
    };
    onSubmitReview(item.id, reviewData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div>
            <h3 className="text-base font-black text-white uppercase flex items-center gap-2">
              <Scale className="h-4 w-4 text-[#ffbb00]" />
              Review: {item.input.name}
            </h3>
            <span className="text-xs text-zinc-400">
              Pago: {formatBRL(item.input.price)} • Expectativa vs Realidade
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-5">
          {/* Comparativo de Custo por Uso */}
          <div className="grid grid-cols-2 gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-500">
                Estimado no Início
              </span>
              <div className="text-sm font-bold text-zinc-300">
                {formatBRL(item.metrics.costPerUse)} / uso
              </div>
              <span className="text-[10px] text-zinc-400">
                {item.metrics.totalEstimatedUses} utilizações
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-black text-[#ffbb00]">
                Custo Real Calculado
              </span>
              <div className="text-sm font-black text-[#ffbb00]">
                {formatBRL(actualCostPerUse)} / uso
              </div>
              <span className="text-[10px] text-zinc-400">
                com base no uso real
              </span>
            </div>
          </div>

          {/* Frequência Real */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Com que frequência você REALMENTE usou?
            </label>
            <select
              value={actualFrequency}
              onChange={(e) => setActualFrequency(e.target.value as UsageFrequency)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-xs text-white focus:border-[#ffbb00] focus:outline-none"
            >
              {Object.entries(FREQUENCY_LABELS).map(([k, label]) => (
                <option key={k} value={k}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Ainda está usando? */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Você ainda continua usando esse item atualmente?
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStillUsing(true)}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all tap-effect ${
                  stillUsing
                    ? 'border-[#ffbb00] bg-[#ffbb00]/20 text-[#ffbb00]'
                    : 'border-zinc-800 bg-zinc-900 text-zinc-400'
                }`}
              >
                Sim, ativo no dia a dia
              </button>
              <button
                type="button"
                onClick={() => setStillUsing(false)}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all tap-effect ${
                  !stillUsing
                    ? 'border-rose-500 bg-rose-500/20 text-rose-300'
                    : 'border-zinc-800 bg-zinc-900 text-zinc-400'
                }`}
              >
                Não, está parado/abandonado
              </button>
            </div>
          </div>

          {/* Valeu a pena? */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              No fim das contas, valeu a pena essa compra?
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setWasWorthIt(true)}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all tap-effect ${
                  wasWorthIt
                    ? 'border-[#ffbb00] bg-[#ffbb00]/20 text-[#ffbb00]'
                    : 'border-zinc-800 bg-zinc-900 text-zinc-400'
                }`}
              >
                <ThumbsUp className="h-4 w-4" />
                <span>Sim, valeu!</span>
              </button>
              <button
                type="button"
                onClick={() => setWasWorthIt(false)}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all tap-effect ${
                  !wasWorthIt
                    ? 'border-rose-500 bg-rose-500/20 text-rose-300'
                    : 'border-zinc-800 bg-zinc-900 text-zinc-400'
                }`}
              >
                <ThumbsDown className="h-4 w-4" />
                <span>Não, me arrependo</span>
              </button>
            </div>
          </div>

          {/* Nota de Satisfação (1 a 5) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Nota de satisfação com o produto (1 a 5)
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setSatisfactionRating(star)}
                  className="p-1 tap-effect"
                >
                  <Star
                    className={`h-6 w-6 transition-colors ${
                      star <= satisfactionRating
                        ? 'fill-[#ffbb00] text-[#ffbb00]'
                        : 'text-zinc-700'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Reflexão sincera */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              O que você aprendeu com essa compra? (Opcional)
            </label>
            <textarea
              rows={2}
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Ex: Pensei que usaria nos finais de semana, mas percebi que não tenho tempo..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-[#ffbb00] focus:outline-none"
            />
          </div>

          {/* Botão de Salvar */}
          <button
            type="submit"
            className="w-full rounded-xl bg-[#ffbb00] py-3 text-xs font-black uppercase text-black hover:bg-[#e5a800] transition-all tap-effect flex items-center justify-center gap-2 shadow-lg shadow-[#ffbb00]/20"
          >
            <Sparkles className="h-4 w-4" />
            <span>Salvar Avaliação Pós-Compra</span>
          </button>
        </form>
      </div>
    </div>
  );
};
