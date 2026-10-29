import React, { useState } from 'react';
import { 
  PurchaseEvaluationInput, 
  PurchaseCategory, 
  UsageFrequency, 
  DurabilityTier, 
  ResaleLiquidity, 
  DesireAge, 
  PurchaseTrigger, 
  AlternativeAvailability 
} from '../../types/purchase';
import { CATEGORY_LABELS } from '../../utils/calculations';
import { 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Check, 
  DollarSign 
} from 'lucide-react';

interface WizardFormProps {
  onSubmit: (data: PurchaseEvaluationInput) => void;
}

const INITIAL_FORM: PurchaseEvaluationInput = {
  name: '',
  category: 'tech',
  price: 0,
  notes: '',
  link: '',
  frequency: 'daily',
  lifespanMonths: 24,
  durability: 'standard',
  liquidity: 'medium',
  paidWithSavings: true,
  desireAge: 'days',
  trigger: 'real_pain',
  alternative: 'none',
  preferCashOverItem: 'item',
};

export const WizardForm: React.FC<WizardFormProps> = ({ onSubmit }) => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<PurchaseEvaluationInput>(INITIAL_FORM);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const updateField = <K extends keyof PurchaseEvaluationInput>(
    field: K,
    value: PurchaseEvaluationInput[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorMsg('');
  };

  const validateStep = (currentStep: number): boolean => {
    if (currentStep === 1) {
      if (!formData.name.trim()) {
        setErrorMsg('Por favor, informe o nome ou descrição do item.');
        return false;
      }
      if (!formData.price || formData.price <= 0) {
        setErrorMsg('Por favor, informe um valor maior que R$ 0,00.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep(step)) return;
    setErrorMsg('');
    setStep((prev) => Math.min(4, prev + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setErrorMsg('');
    setStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(step)) return;
    onSubmit(formData);
  };

  const categories = Object.entries(CATEGORY_LABELS) as [PurchaseCategory, { label: string; icon: string }][];

  return (
    <div className="w-full max-w-xl mx-auto pb-16">
      {/* Indicador de Passos Mobile-Friendly */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2 px-1">
          <span>Passo {step} de 4</span>
          <span className="text-emerald-400">
            {step === 1 && 'O que e Quanto'}
            {step === 2 && 'Utilidade & Vida Útil'}
            {step === 3 && 'Gatilho & Impulso'}
            {step === 4 && 'Financeiro & Revenda'}
          </span>
        </div>
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 ease-out"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ===================== PASSO 1: BÁSICO ===================== */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                O que você está pensando em comprar?
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Seja sincero com os valores para calcularmos o custo por uso exato.
              </p>
            </div>

            {/* Nome do Item */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Nome do Item / Produto *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Ex: Fone Bluetooth, Jaqueta, Cafeteira..."
                className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                autoFocus
              />
            </div>

            {/* Preço (R$) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Valor Total (R$) *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-sm font-semibold text-slate-400">
                  R$
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price || ''}
                  onChange={(e) => updateField('price', parseFloat(e.target.value) || 0)}
                  placeholder="0,00"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/80 pl-11 pr-4 py-3 text-base font-semibold text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Categoria */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Categoria
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {categories.map(([key, cat]) => {
                  const isSelected = formData.category === key;
                  return (
                    <button
                      type="button"
                      key={key}
                      onClick={() => updateField('category', key)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all tap-effect ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-500/15 text-white font-semibold'
                          : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <span className="text-lg">{cat.icon}</span>
                      <span className="text-[11px] mt-1 leading-tight">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Link ou notas rápidas */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Link do produto ou motivo (opcional)
              </label>
              <input
                type="text"
                value={formData.notes || ''}
                onChange={(e) => updateField('notes', e.target.value)}
                placeholder="Ex: Vi na loja X, link do anúncio ou detalhe..."
                className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
        )}

        {/* ===================== PASSO 2: UTILIDADE & DURABILIDADE ===================== */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Frequência e Vida Útil
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                O custo por uso é a métrica definitiva para desmascarar compras fúteis.
              </p>
            </div>

            {/* Frequência de uso */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Com que frequência você REALMENTE vai usar?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { value: 'multiple_daily', label: 'Várias vezes ao dia', sub: '~3x por dia ou mais' },
                  { value: 'daily', label: 'Diariamente', sub: '1x ao dia (365x/ano)' },
                  { value: 'weekdays', label: 'Dias úteis', sub: 'Segunda a sexta (~250x/ano)' },
                  { value: 'weekly_few', label: '2 a 3 vezes por semana', sub: 'Uso regular (~130x/ano)' },
                  { value: 'weekly', label: '1 vez por semana', sub: 'Fins de semana (~52x/ano)' },
                  { value: 'monthly_few', label: '2 a 3 vezes por mês', sub: 'Uso esporádico (~30x/ano)' },
                  { value: 'monthly', label: '1 vez por mês', sub: 'Ocasional (~12x/ano)' },
                  { value: 'rarely', label: 'Poucas vezes ao ano', sub: 'Eventual (~4x/ano)' },
                ].map((item) => {
                  const isSelected = formData.frequency === item.value;
                  return (
                    <button
                      type="button"
                      key={item.value}
                      onClick={() => updateField('frequency', item.value as UsageFrequency)}
                      className={`flex flex-col text-left p-3 rounded-xl border transition-all tap-effect ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-500/15 text-white'
                          : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">{item.label}</span>
                        {isSelected && <Check className="h-3.5 w-3.5 text-emerald-400" />}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-0.5">{item.sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Expectativa de Vida Útil */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Quanto tempo esse item durará com você?
                </label>
                <span className="text-xs font-bold text-emerald-400">
                  {formData.lifespanMonths < 12 
                    ? `${formData.lifespanMonths} meses` 
                    : `${(formData.lifespanMonths / 12).toFixed(1)} anos`}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {[
                  { months: 6, label: '6 meses' },
                  { months: 12, label: '1 ano' },
                  { months: 24, label: '2 anos' },
                  { months: 36, label: '3 anos' },
                  { months: 60, label: '5+ anos' },
                ].map((option) => (
                  <button
                    type="button"
                    key={option.months}
                    onClick={() => updateField('lifespanMonths', option.months)}
                    className={`py-2 px-1 rounded-lg border text-center text-xs font-medium transition-all tap-effect ${
                      formData.lifespanMonths === option.months
                        ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 font-bold'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Durabilidade / Construção */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Qualidade de Construção & Desgaste
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'fragile', label: 'Frágil / Perecível', sub: 'Desgaste rápido ou moda passageira' },
                  { value: 'standard', label: 'Padrão de Mercado', sub: 'Durabilidade esperada na média' },
                  { value: 'durable', label: 'Robusto / Bem Feito', sub: 'Materiais de alta resistência' },
                  { value: 'buy_it_for_life', label: 'Buy It For Life (BIFL)', sub: 'Feito para durar uma vida inteira' },
                ].map((tier) => {
                  const isSelected = formData.durability === tier.value;
                  return (
                    <button
                      type="button"
                      key={tier.value}
                      onClick={() => updateField('durability', tier.value as DurabilityTier)}
                      className={`flex flex-col text-left p-2.5 rounded-xl border transition-all tap-effect ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-500/15 text-white'
                          : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">{tier.label}</span>
                        {isSelected && <Check className="h-3 w-3 text-emerald-400" />}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-0.5">{tier.sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ===================== PASSO 3: GATILHOS E DESEJO ===================== */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Teste de Impulso & Fricção Mental
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                O cérebro adora criar justificativas lógicas para desejos puramente emocionais.
              </p>
            </div>

            {/* Tempo pensando */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Há quanto tempo você quer comprar isso?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'minutes', label: 'Descobri há pouco (< 24h)', icon: '⚡' },
                  { value: 'days', label: 'Alguns dias (< 1 semana)', icon: '🗓️' },
                  { value: 'weeks', label: '2 a 4 semanas', icon: '⏳' },
                  { value: 'months', label: 'Mais de 2 meses', icon: '🧠' },
                ].map((item) => {
                  const isSelected = formData.desireAge === item.value;
                  return (
                    <button
                      type="button"
                      key={item.value}
                      onClick={() => updateField('desireAge', item.value as DesireAge)}
                      className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all tap-effect ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-500/15 text-white font-bold'
                          : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span className="text-xs">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* De onde veio o desejo */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Qual foi o gatilho inicial?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { value: 'real_pain', label: 'Dor real no meu dia a dia', sub: 'Falta sentida repetidamente' },
                  { value: 'replacement', label: 'Substituição de algo quebrado', sub: 'Necessidade de reposição' },
                  { value: 'friend', label: 'Vi um amigo/conhecido usando', sub: 'Recomendação orgânica' },
                  { value: 'deal', label: 'Promoção imperdível / Cupom', sub: 'Urgência pelo preço reduzido' },
                  { value: 'social_media', label: 'Anúncio ou feed no Instagram/TikTok', sub: 'O algoritmo me recomendou' },
                  { value: 'boredom', label: 'Tédio ou busca de dopamina', sub: 'Vontade aleatória de comprar algo' },
                ].map((item) => {
                  const isSelected = formData.trigger === item.value;
                  return (
                    <button
                      type="button"
                      key={item.value}
                      onClick={() => updateField('trigger', item.value as PurchaseTrigger)}
                      className={`flex flex-col text-left p-2.5 rounded-xl border transition-all tap-effect ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-500/15 text-white'
                          : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">{item.label}</span>
                        {isSelected && <Check className="h-3 w-3 text-emerald-400" />}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-0.5">{item.sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* O Teste do Dinheiro na Mão */}
            <div className="space-y-2 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-3.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider">
                <DollarSign className="h-4 w-4" />
                O Teste do Dinheiro Vivo
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Se uma pessoa te desse agora o valor de R$ {formData.price || '...'} em notas de dinheiro vivo na sua mão: você preferiria ficar com o dinheiro ou comprar o produto?
              </p>
              <div className="grid grid-cols-3 gap-2 pt-1">
                {[
                  { value: 'cash', label: 'Ficaria com o dinheiro', desc: 'Sinal de impulso' },
                  { value: 'tie', label: 'Dúvida cruel', desc: 'Indecisão' },
                  { value: 'item', label: 'Compraria o item', desc: 'Desejo genuíno' },
                ].map((opt) => {
                  const isSelected = formData.preferCashOverItem === opt.value;
                  return (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => updateField('preferCashOverItem', opt.value as any)}
                      className={`p-2 rounded-xl border text-center transition-all tap-effect ${
                        isSelected
                          ? 'border-amber-400 bg-amber-400/20 text-white font-bold'
                          : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="text-xs font-semibold">{opt.label}</div>
                      <div className="text-[10px] text-slate-400">{opt.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Alternativas Existentes */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Você já tem algo similar ou consegue resolver sem gastar?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'none', label: 'Não tenho nada parecido', sub: 'Necessidade não coberta' },
                  { value: 'can_borrow', label: 'Posso pegar emprestado', sub: 'Amigo/familiar tem' },
                  { value: 'free_solution', label: 'Existe alternativa grátis', sub: 'Dá para improvisar bem' },
                  { value: 'have_similar', label: 'Já tenho algo 80% similar', sub: 'Redundância funcional' },
                ].map((alt) => {
                  const isSelected = formData.alternative === alt.value;
                  return (
                    <button
                      type="button"
                      key={alt.value}
                      onClick={() => updateField('alternative', alt.value as AlternativeAvailability)}
                      className={`flex flex-col text-left p-2.5 rounded-xl border transition-all tap-effect ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-500/15 text-white'
                          : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-200">{alt.label}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">{alt.sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ===================== PASSO 4: FINANCEIRO & LIQUIDEZ ===================== */}
        {step === 4 && (
          <div className="space-y-5 animate-fade-in">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Liquidez & Impacto no Bolso
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Como esse dinheiro sai da sua conta e quanto você reaveria se precisar.
              </p>
            </div>

            {/* Liquidez de Revenda */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Se você se arrepender em 6 meses, qual a facilidade de revender?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'none', label: 'Nenhuma (Passivo Puro)', sub: 'Perde 90-100% (comida, roupa comum, serviço)' },
                  { value: 'low', label: 'Baixa', sub: 'Difícil achar comprador, perda de ~70%' },
                  { value: 'medium', label: 'Média', sub: 'Mercado OK (vende por ~50% do valor)' },
                  { value: 'high', label: 'Alta (Quase como dinheiro)', sub: 'Apple, lentes, pesos de academia (~70%+)' },
                ].map((item) => {
                  const isSelected = formData.liquidity === item.value;
                  return (
                    <button
                      type="button"
                      key={item.value}
                      onClick={() => updateField('liquidity', item.value as ResaleLiquidity)}
                      className={`flex flex-col text-left p-3 rounded-xl border transition-all tap-effect ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-500/15 text-white'
                          : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-200">{item.label}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">{item.sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* De onde sai o dinheiro */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                De onde virá esse dinheiro?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => updateField('paidWithSavings', true)}
                  className={`flex flex-col p-3 rounded-xl border text-left transition-all tap-effect ${
                    formData.paidWithSavings
                      ? 'border-emerald-500 bg-emerald-500/15 text-white'
                      : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-200">Reserva Planejada</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    Já guardei ou tenho sobra limpa sem aperto
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => updateField('paidWithSavings', false)}
                  className={`flex flex-col p-3 rounded-xl border text-left transition-all tap-effect ${
                    !formData.paidWithSavings
                      ? 'border-amber-500 bg-amber-500/15 text-white'
                      : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-200">Salário / Parcelado</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    Vai comprometer o mês ou o limite do cartão
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mensagem de Erro (se houver) */}
        {errorMsg && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-medium text-rose-300">
            {errorMsg}
          </div>
        )}

        {/* Botões de Ação de Navegação (Fixos ou confortáveis) */}
        <div className="flex items-center gap-3 pt-2">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition-all tap-effect"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar</span>
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 tap-effect"
            >
              <span>Continuar</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 py-3.5 text-xs font-extrabold text-slate-950 hover:brightness-110 transition-all shadow-lg shadow-emerald-500/25 tap-effect"
            >
              <Sparkles className="h-4 w-4" />
              <span>Calcular Veredito & Insights</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
