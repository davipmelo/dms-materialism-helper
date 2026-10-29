import React from 'react';
import { 
  CalculatedMetrics, 
  PurchaseEvaluationInput 
} from '../../types/purchase';
import { formatBRL, CATEGORY_LABELS } from '../../utils/calculations';
import { 
  Clock, 
  TrendingUp, 
  Briefcase, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Bookmark, 
  Ban, 
  RotateCcw 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ResultCardProps {
  input: PurchaseEvaluationInput;
  metrics: CalculatedMetrics;
  onSaveToQuarantine: () => void;
  onMarkAsPassed: () => void;
  onMarkAsBought: () => void;
  onReset: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  input,
  metrics,
  onSaveToQuarantine,
  onMarkAsPassed,
  onMarkAsBought,
  onReset,
}) => {
  const categoryInfo = CATEGORY_LABELS[input.category] || { label: input.category, icon: '📦' };

  const handlePassedWithCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#34d399', '#6ee7b7', '#f59e0b'],
    });
    onMarkAsPassed();
  };

  // Cores dinâmicas para o mostrador
  const getScoreDialColor = (score: number) => {
    if (score >= 80) return 'stroke-emerald-400 text-emerald-400';
    if (score >= 60) return 'stroke-blue-400 text-blue-400';
    if (score >= 40) return 'stroke-amber-400 text-amber-400';
    return 'stroke-rose-400 text-rose-400';
  };

  const getScoreBgGlow = (score: number) => {
    if (score >= 80) return 'from-emerald-500/20 to-teal-500/5 border-emerald-500/30';
    if (score >= 60) return 'from-blue-500/20 to-cyan-500/5 border-blue-500/30';
    if (score >= 40) return 'from-amber-500/20 to-yellow-500/5 border-amber-500/30';
    return 'from-rose-500/20 to-orange-500/5 border-rose-500/30';
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-slide-up pb-12">
      {/* Card Principal de Veredito */}
      <div className={`relative overflow-hidden rounded-2xl border bg-gradient-to-b p-6 sm:p-8 backdrop-blur-xl ${getScoreBgGlow(metrics.score)}`}>
        {/* Header do Item */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl">{categoryInfo.icon}</span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {input.name || 'Item sem nome'}
              </h2>
              <span className="text-xs text-slate-400">{categoryInfo.label}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-extrabold text-white">
              {formatBRL(input.price)}
            </div>
            <div className="text-[11px] text-slate-400">preço total</div>
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
                className="stroke-slate-800"
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
                style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black tracking-tight text-white">
                {metrics.score}%
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Score
              </span>
            </div>
          </div>

          {/* Veredito em texto */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border"
                 style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
              {metrics.score >= 60 ? (
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
              ) : (
                <ShieldAlert className="h-4 w-4 text-rose-400" />
              )}
              <span className="text-white">{metrics.tierLabel}</span>
            </div>
            <p className="text-sm sm:text-base font-medium text-slate-200 leading-snug">
              {metrics.verdict}
            </p>
          </div>
        </div>

        {/* Grade de Métricas-Chave */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Custo por uso */}
          <div className="rounded-xl border border-white/5 bg-slate-900/60 p-3.5 backdrop-blur-sm">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>Custo por uso</span>
            </div>
            <div className="mt-1 text-lg font-bold text-emerald-300">
              {formatBRL(metrics.costPerUse)}
            </div>
            <div className="text-[10px] text-slate-400">
              ~{metrics.totalEstimatedUses} utilizações previstas
            </div>
          </div>

          {/* Horas de trabalho */}
          <div className="rounded-xl border border-white/5 bg-slate-900/60 p-3.5 backdrop-blur-sm">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Briefcase className="h-3.5 w-3.5 text-blue-400" />
              <span>Horas de vida</span>
            </div>
            <div className="mt-1 text-lg font-bold text-blue-300">
              {metrics.hoursOfWork < 10 
                ? `${metrics.hoursOfWork.toFixed(1)}h` 
                : `${(metrics.hoursOfWork / 8).toFixed(1)} dias`}
            </div>
            <div className="text-[10px] text-slate-400">
              de trabalho líquido para pagar
            </div>
          </div>

          {/* Custo de oportunidade */}
          <div className="rounded-xl border border-white/5 bg-slate-900/60 p-3.5 backdrop-blur-sm">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <TrendingUp className="h-3.5 w-3.5 text-amber-400" />
              <span>Em 2 anos no CDI</span>
            </div>
            <div className="mt-1 text-lg font-bold text-amber-300">
              {formatBRL(metrics.opportunityCost2Years)}
            </div>
            <div className="text-[10px] text-slate-400">
              se mantivesse investido
            </div>
          </div>
        </div>

        {/* Lista de Insights Inteligentes */}
        <div className="mt-6 space-y-2 rounded-xl border border-white/5 bg-slate-900/40 p-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> Insights & Alertas do Sistema
          </div>
          <div className="space-y-1.5 pt-1">
            {metrics.insights.map((insight, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                <span className="text-emerald-400 mt-0.5">•</span>
                <span>{insight}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ações Imediatas (O que fazer agora?) */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
          O que você decide fazer com essa compra?
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Opção 1: Quarentena (Recomendado para scores medianos) */}
          <button
            onClick={onSaveToQuarantine}
            className="flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3.5 text-sm font-bold text-amber-300 transition-all hover:bg-amber-500/20 tap-effect"
          >
            <Bookmark className="h-4 w-4" />
            <span>Colocar em Quarentena</span>
          </button>

          {/* Opção 2: Desistir (Vitória financeira!) */}
          <button
            onClick={handlePassedWithCelebration}
            className="flex items-center justify-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3.5 text-sm font-bold text-rose-300 transition-all hover:bg-rose-500/20 tap-effect"
          >
            <Ban className="h-4 w-4" />
            <span>Desisti! (Economizei)</span>
          </button>

          {/* Opção 3: Comprar agora */}
          <button
            onClick={onMarkAsBought}
            className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/20 p-3.5 text-sm font-bold text-emerald-200 transition-all hover:bg-emerald-500/30 tap-effect"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Vou Comprar</span>
          </button>
        </div>

        {/* Botão de refazer / novo teste */}
        <div className="pt-2 text-center">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors py-2 px-3 tap-effect"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Avaliar outro item do zero
          </button>
        </div>
      </div>
    </div>
  );
};
