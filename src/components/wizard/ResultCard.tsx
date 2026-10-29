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
  RotateCcw,
  Search,
  ExternalLink,
  Link2
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
      colors: ['#ffbb00', '#f59e0b', '#fde047'],
    });
    onMarkAsPassed();
  };

  // Cores dinâmicas para o mostrador
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

  // Links de busca de produto para o dossiê
  const searchQuery = [input.name, input.model].filter(Boolean).join(' ');
  const googleShoppingUrl = `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(searchQuery)}`;
  const mercadoLivreUrl = `https://lista.mercadolivre.com.br/${encodeURIComponent(searchQuery)}`;
  const amazonUrl = `https://www.amazon.com.br/s?k=${encodeURIComponent(searchQuery)}`;

  // Formatação de anos e meses
  const years = Math.floor(input.lifespanMonths / 12);
  const months = input.lifespanMonths % 12;
  const lifespanFormatted = [
    years > 0 ? `${years} ${years === 1 ? 'ano' : 'anos'}` : null,
    months > 0 ? `${months} ${months === 1 ? 'mês' : 'meses'}` : null,
  ].filter(Boolean).join(' e ') || '1 mês';

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-slide-up pb-12">
      {/* Card Principal de Veredito */}
      <div className={`relative overflow-hidden rounded-3xl border bg-gradient-to-b p-6 sm:p-8 backdrop-blur-xl ${getScoreBgGlow(metrics.score)}`}>
        {/* Header do Item: Produto e Modelo */}
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-start gap-3">
            <span className="text-3xl sm:text-4xl">{categoryInfo.icon}</span>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#ffbb00]">
                {categoryInfo.label}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                {input.name || 'Produto sem nome'}
              </h2>
              {input.model && (
                <div className="inline-block mt-0.5 rounded-md bg-zinc-800/80 px-2 py-0.5 text-xs font-semibold text-zinc-300 border border-zinc-700/60">
                  Modelo: <span className="text-white">{input.model}</span>
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl sm:text-3xl font-black text-white">
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
                style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
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
              de trabalho líquido para pagar
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

        {/* Dossiê & Links de Pesquisa do Produto */}
        <div className="mt-6 rounded-2xl border border-zinc-800 bg-black/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <Search className="h-3.5 w-3.5 text-[#ffbb00]" />
              Dossiê do Produto & Links de Pesquisa
            </div>
            <span className="text-[10px] text-zinc-500">Consultar ofertas</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={googleShoppingUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:border-[#ffbb00] hover:text-[#ffbb00] transition-colors"
            >
              <span>Google Shopping</span>
              <ExternalLink className="h-3 w-3" />
            </a>

            <a
              href={mercadoLivreUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:border-yellow-400 hover:text-yellow-400 transition-colors"
            >
              <span>Mercado Livre</span>
              <ExternalLink className="h-3 w-3" />
            </a>

            <a
              href={amazonUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:border-amber-400 hover:text-amber-400 transition-colors"
            >
              <span>Amazon</span>
              <ExternalLink className="h-3 w-3" />
            </a>

            {input.link && (
              <a
                href={input.link}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-lg border border-[#ffbb00]/40 bg-[#ffbb00]/10 px-3 py-1.5 text-xs font-bold text-[#ffbb00] hover:bg-[#ffbb00]/20 transition-colors"
              >
                <Link2 className="h-3 w-3" />
                <span>Link Direto Informado</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
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

      {/* Ações Imediatas */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-1">
          O que você decide fazer com essa compra?
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Opção 1: Quarentena */}
          <button
            onClick={onSaveToQuarantine}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#ffbb00]/30 bg-[#ffbb00]/10 p-3.5 text-xs font-bold uppercase text-[#ffbb00] transition-all hover:bg-[#ffbb00]/20 tap-effect"
          >
            <Bookmark className="h-4 w-4" />
            <span>Pôr em Quarentena</span>
          </button>

          {/* Opção 2: Desistir */}
          <button
            onClick={handlePassedWithCelebration}
            className="flex items-center justify-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3.5 text-xs font-bold uppercase text-rose-300 transition-all hover:bg-rose-500/20 tap-effect"
          >
            <Ban className="h-4 w-4" />
            <span>Desisti! (Economizei)</span>
          </button>

          {/* Opção 3: Comprar agora */}
          <button
            onClick={onMarkAsBought}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#ffbb00] p-3.5 text-xs font-black uppercase text-black hover:bg-[#e5a800] transition-all shadow-lg shadow-[#ffbb00]/20 tap-effect"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Vou Comprar</span>
          </button>
        </div>

        {/* Botão de refazer / novo teste */}
        <div className="pt-2 text-center">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors py-2 px-3 tap-effect"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Avaliar outro item do zero
          </button>
        </div>
      </div>
    </div>
  );
};
