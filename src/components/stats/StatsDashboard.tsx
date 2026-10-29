import React from 'react';
import { PurchaseItem } from '../../types/purchase';
import { formatBRL, CATEGORY_LABELS } from '../../utils/calculations';
import { 
  BarChart3, 
  TrendingUp, 
  PiggyBank, 
  ShieldCheck, 
  ShoppingBag, 
  Target, 
  Zap, 
  Clock 
} from 'lucide-react';

interface StatsDashboardProps {
  items: PurchaseItem[];
  onNavigateToWizard: () => void;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ items, onNavigateToWizard }) => {
  // 1. Cálculos Financeiros
  const passedItems = items.filter((i) => i.status === 'passed');
  const boughtItems = items.filter((i) => i.status === 'bought' || i.status === 'reviewed');
  const reviewedItems = items.filter((i) => i.status === 'reviewed' && i.review);

  const totalSaved = passedItems.reduce((acc, curr) => acc + (curr.input.price || 0), 0);
  const totalSpent = boughtItems.reduce((acc, curr) => acc + (curr.input.price || 0), 0);

  // Média de score
  const avgScore = items.length > 0 
    ? Math.round(items.reduce((acc, curr) => acc + curr.metrics.score, 0) / items.length) 
    : 0;

  // Taxa de acerto pós-compra (Review)
  const worthItCount = reviewedItems.filter((i) => i.review?.wasWorthIt).length;
  const accuracyRate = reviewedItems.length > 0 
    ? Math.round((worthItCount / reviewedItems.length) * 100) 
    : null;

  // 2. Distribuição por Categoria
  const categoryCounts: Record<string, { count: number; totalValue: number }> = {};
  items.forEach((item) => {
    const cat = item.input.category;
    if (!categoryCounts[cat]) {
      categoryCounts[cat] = { count: 0, totalValue: 0 };
    }
    categoryCounts[cat].count += 1;
    categoryCounts[cat].totalValue += item.input.price || 0;
  });

  const sortedCategories = Object.entries(categoryCounts).sort(
    (a, b) => b[1].totalValue - a[1].totalValue
  );

  // 3. Distribuição por Gatilho
  const triggerLabels: Record<string, string> = {
    social_media: 'Anúncio / Redes Sociais',
    boredom: 'Tédio / Dopamina',
    deal: 'Promoção / Cupom',
    friend: 'Recomendação de Amigo',
    real_pain: 'Dor Real no Cotidiano',
    replacement: 'Substituição / Reposição',
  };

  const triggerCounts: Record<string, number> = {};
  items.forEach((item) => {
    const trig = item.input.trigger;
    triggerCounts[trig] = (triggerCounts[trig] || 0) + 1;
  });

  const sortedTriggers = Object.entries(triggerCounts).sort((a, b) => b[1] - a[1]);

  // 4. Maiores "balas desviadas" (maiores itens desistidos)
  const topSavedItems = [...passedItems]
    .sort((a, b) => b.input.price - a.input.price)
    .slice(0, 3);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 pb-20 animate-fade-in">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-emerald-400" />
          Painel de Estatísticas Pessoais
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Como o seu comportamento de consumo e decisões evoluíram ao longo do tempo.
        </p>
      </div>

      {/* Grid de KPIs principais */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* KPI 1: Economizado */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
            <PiggyBank className="h-3.5 w-3.5" /> Total Salvo
          </span>
          <div className="mt-1 text-lg sm:text-xl font-extrabold text-white">
            {formatBRL(totalSaved)}
          </div>
          <span className="text-[10px] text-slate-400">
            {passedItems.length} compras evitadas
          </span>
        </div>

        {/* KPI 2: Total Gasto */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <ShoppingBag className="h-3.5 w-3.5 text-blue-400" /> Total Gasto
          </span>
          <div className="mt-1 text-lg sm:text-xl font-extrabold text-white">
            {formatBRL(totalSpent)}
          </div>
          <span className="text-[10px] text-slate-400">
            {boughtItems.length} compras aprovadas
          </span>
        </div>

        {/* KPI 3: Taxa de Acerto */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Target className="h-3.5 w-3.5 text-amber-400" /> Taxa de Acerto
          </span>
          <div className="mt-1 text-lg sm:text-xl font-extrabold text-white">
            {accuracyRate !== null ? `${accuracyRate}%` : '—'}
          </div>
          <span className="text-[10px] text-slate-400">
            {reviewedItems.length > 0 ? `${worthItCount}/${reviewedItems.length} valeram a pena` : 'Sem reviews ainda'}
          </span>
        </div>

        {/* KPI 4: Score Médio */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-teal-400" /> Score Médio
          </span>
          <div className="mt-1 text-lg sm:text-xl font-extrabold text-white">
            {avgScore}%
          </div>
          <span className="text-[10px] text-slate-400">
            de racionalidade geral
          </span>
        </div>
      </div>

      {/* Seção: O Poder da Quarentena */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
          <Clock className="h-4 w-4 text-amber-400" />
          A Regra dos 7 Dias de Quarentena
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          Estudos comportamentais mostram que mais de <strong className="text-amber-300">70% dos impulsos de compra desaparecem</strong> se você esperar apenas uma semana antes de pagar.
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <span className="text-base sm:text-lg font-bold text-amber-400">
              {items.filter((i) => i.status === 'quarantine').length}
            </span>
            <div className="text-[10px] text-slate-400 mt-0.5">Em Quarentena agora</div>
          </div>
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <span className="text-base sm:text-lg font-bold text-rose-400">
              {passedItems.length}
            </span>
            <div className="text-[10px] text-slate-400 mt-0.5">Desistidos (Esfriou)</div>
          </div>
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <span className="text-base sm:text-lg font-bold text-emerald-400">
              {boughtItems.length}
            </span>
            <div className="text-[10px] text-slate-400 mt-0.5">Comprados com certeza</div>
          </div>
        </div>
      </div>

      {/* Grid: Gatilhos & Categorias */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Gatilhos mais frequentes */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            Origem dos seus Desejos
          </h3>
          <p className="text-[11px] text-slate-400">
            Identifique onde você é mais vulnerável a impulsos.
          </p>

          <div className="space-y-2.5 pt-1">
            {sortedTriggers.map(([trig, count]) => {
              const pct = Math.round((count / items.length) * 100);
              return (
                <div key={trig} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-300">{triggerLabels[trig] || trig}</span>
                    <span className="text-slate-400">{count}x ({pct}%)</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-400 rounded-full" 
                      style={{ width: `${pct}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gastos & Intenções por Categoria */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
            Por Categoria
          </h3>
          <p className="text-[11px] text-slate-400">
            Onde se concentram os maiores valores analisados.
          </p>

          <div className="space-y-2.5 pt-1">
            {sortedCategories.map(([cat, data]) => {
              const catInfo = CATEGORY_LABELS[cat] || { label: cat, icon: '📦' };
              return (
                <div key={cat} className="flex items-center justify-between text-xs py-1 border-b border-slate-800/60 last:border-0">
                  <div className="flex items-center gap-2">
                    <span>{catInfo.icon}</span>
                    <span className="font-medium text-slate-200">{catInfo.label}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white">{formatBRL(data.totalValue)}</div>
                    <div className="text-[10px] text-slate-400">{data.count} {data.count === 1 ? 'item' : 'itens'}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Balas Desviadas */}
      {topSavedItems.length > 0 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            🛡️ Maiores Compras Evitadas (Suas Melhores Decisões)
          </h3>
          <div className="divide-y divide-slate-800">
            {topSavedItems.map((item) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between first:pt-0 last:pb-0">
                <div>
                  <div className="text-xs font-bold text-white">{item.input.name}</div>
                  <div className="text-[10px] text-slate-400">
                    Score original: {item.metrics.score}% • {item.metrics.tierLabel}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-extrabold text-emerald-400">
                    +{formatBRL(item.input.price)}
                  </div>
                  <div className="text-[10px] text-slate-400">mantidos no bolso</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botão de Nova Avaliação */}
      <div className="text-center pt-2">
        <button
          onClick={onNavigateToWizard}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 tap-effect"
        >
          <span>Avaliar Uma Nova Compra Agora</span>
        </button>
      </div>
    </div>
  );
};
