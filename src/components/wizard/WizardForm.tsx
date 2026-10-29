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
  DollarSign, 
  Link2,
  FileText,
  Wallet
} from 'lucide-react';

interface WizardFormProps {
  onSubmit: (data: PurchaseEvaluationInput) => void;
}

const INITIAL_FORM: PurchaseEvaluationInput = {
  name: '',
  model: '',
  category: 'tech',
  price: 0,
  reason: '',
  notes: '',
  link: '',
  frequency: 'daily',
  lifespanMonths: 24, // 2 anos
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

  // Estados locais para anos e meses
  const [lifespanYears, setLifespanYears] = useState<number>(Math.floor(INITIAL_FORM.lifespanMonths / 12));
  const [lifespanExtraMonths, setLifespanExtraMonths] = useState<number>(INITIAL_FORM.lifespanMonths % 12);

  const updateField = <K extends keyof PurchaseEvaluationInput>(
    field: K,
    value: PurchaseEvaluationInput[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorMsg('');
  };

  const handleLifespanChange = (years: number, months: number) => {
    const y = Math.max(0, years || 0);
    const m = Math.max(0, months || 0);
    setLifespanYears(y);
    setLifespanExtraMonths(m);
    const totalMonths = Math.max(1, (y * 12) + m);
    updateField('lifespanMonths', totalMonths);
  };

  const setLifespanPreset = (totalMonths: number) => {
    const y = Math.floor(totalMonths / 12);
    const m = totalMonths % 12;
    setLifespanYears(y);
    setLifespanExtraMonths(m);
    updateField('lifespanMonths', totalMonths);
  };

  const validateStep = (currentStep: number): boolean => {
    if (currentStep === 1) {
      if (!formData.name.trim()) {
        setErrorMsg('Por favor, informe o Produto.');
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
    if (step < 4) {
      handleNext();
      return;
    }
    if (!validateStep(step)) return;
    onSubmit(formData);
  };

  const categories = Object.entries(CATEGORY_LABELS) as [PurchaseCategory, { label: string; icon: string }][];

  return (
    <div className="w-full max-w-xl mx-auto pb-16">
      {/* Indicador de Passos Mobile-Friendly */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-bold text-zinc-400 mb-2 px-1">
          <span>Passo {step} de 4</span>
          <span className="text-[#ffbb00]">
            {step === 1 && 'Produto & Motivo'}
            {step === 2 && 'Frequência & Vida Útil'}
            {step === 3 && 'Gatilho & Impulso'}
            {step === 4 && 'Financeiro & Liquidez'}
          </span>
        </div>
        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#ffbb00] transition-all duration-300 ease-out"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ===================== PASSO 1: PRODUTO & MODELO ===================== */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                O que você quer comprar?
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400">
                Preencha os dados do item e a razão pela qual você quer fazer essa compra.
              </p>
            </div>

            {/* Grid Produto e Modelo (Campos de Texto Puros) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Campo Produto */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Produto *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="Ex: Fone de Ouvido, Jaqueta..."
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-[#ffbb00] focus:outline-none focus:ring-1 focus:ring-[#ffbb00] transition-all font-semibold"
                  autoFocus
                />
              </div>

              {/* Campo Modelo */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Modelo
                </label>
                <input
                  type="text"
                  value={formData.model || ''}
                  onChange={(e) => updateField('model', e.target.value)}
                  placeholder="Ex: Sony WH-1000XM5, Preto..."
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-[#ffbb00] focus:outline-none focus:ring-1 focus:ring-[#ffbb00] transition-all"
                />
              </div>
            </div>

            {/* Preço (R$) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Valor Total (R$) *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-sm font-semibold text-zinc-400">
                  R$
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price || ''}
                  onChange={(e) => updateField('price', parseFloat(e.target.value) || 0)}
                  placeholder="0,00"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 pl-11 pr-4 py-3 text-base font-black text-white placeholder-zinc-500 focus:border-[#ffbb00] focus:outline-none focus:ring-1 focus:ring-[#ffbb00] transition-all"
                />
              </div>
            </div>

            {/* Categoria */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
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
                          ? 'border-[#ffbb00] bg-[#ffbb00]/15 text-white font-bold'
                          : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                      }`}
                    >
                      <span className="text-lg">{cat.icon}</span>
                      <span className="text-[11px] mt-1 leading-tight">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Motivo da Compra (Campo Separado) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-[#ffbb00]" />
                Motivo da Compra
              </label>
              <textarea
                rows={2}
                value={formData.reason || ''}
                onChange={(e) => updateField('reason', e.target.value)}
                placeholder="Explique brevemente por que você quer comprar isso (ex: meu fone quebrou e preciso de isolamento para trabalhar)..."
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-[#ffbb00] focus:outline-none focus:ring-1 focus:ring-[#ffbb00] leading-relaxed"
              />
            </div>

            {/* Link direto do produto (Campo Separado) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <Link2 className="h-3.5 w-3.5 text-zinc-400" />
                Link direto do produto (opcional)
              </label>
              <input
                type="url"
                value={formData.link || ''}
                onChange={(e) => updateField('link', e.target.value)}
                placeholder="https://..."
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-[#ffbb00] focus:outline-none focus:ring-1 focus:ring-[#ffbb00]"
              />
              <span className="text-[10px] text-zinc-500 block">
                Se você colar o link direto aqui, criaremos um card de acesso rápido no dossiê do item.
              </span>
            </div>
          </div>
        )}

        {/* ===================== PASSO 2: UTILIDADE & VIDA ÚTIL ===================== */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                Frequência e Vida Útil
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400">
                Configure com precisão quanto tempo e com que frequência esse item durará com você.
              </p>
            </div>

            {/* Frequência de uso */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
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
                          ? 'border-[#ffbb00] bg-[#ffbb00]/15 text-white'
                          : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-200">{item.label}</span>
                        {isSelected && <Check className="h-3.5 w-3.5 text-[#ffbb00]" />}
                      </div>
                      <span className="text-[10px] text-zinc-400 mt-0.5">{item.sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Expectativa de Vida Útil Flexível: ANOS + MESES */}
            <div className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Quanto tempo esse item durará com você?
                </label>
                <span className="text-xs font-black text-[#ffbb00]">
                  {lifespanYears > 0 && `${lifespanYears} ${lifespanYears === 1 ? 'ano' : 'anos'}`}
                  {lifespanYears > 0 && lifespanExtraMonths > 0 && ' e '}
                  {lifespanExtraMonths > 0 && `${lifespanExtraMonths} ${lifespanExtraMonths === 1 ? 'mês' : 'meses'}`}
                  {lifespanYears === 0 && lifespanExtraMonths === 0 && '1 mês'}
                  <span className="text-zinc-500 font-normal ml-1">
                    ({formData.lifespanMonths} meses)
                  </span>
                </span>
              </div>

              {/* Campos combinados de Anos e Meses */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-zinc-400">Anos</span>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={lifespanYears}
                      onChange={(e) => handleLifespanChange(parseInt(e.target.value) || 0, lifespanExtraMonths)}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm font-bold text-white focus:border-[#ffbb00] focus:outline-none"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-zinc-500">anos</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-zinc-400">Meses adicionais</span>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="11"
                      value={lifespanExtraMonths}
                      onChange={(e) => handleLifespanChange(lifespanYears, parseInt(e.target.value) || 0)}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm font-bold text-white focus:border-[#ffbb00] focus:outline-none"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-zinc-500">meses</span>
                  </div>
                </div>
              </div>

              {/* Presets Rápidos */}
              <div className="pt-1">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1.5">
                  Atalhos rápidos:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: '6 meses', totalMonths: 6 },
                    { label: '1 ano', totalMonths: 12 },
                    { label: '1 ano e 6 meses', totalMonths: 18 },
                    { label: '2 anos', totalMonths: 24 },
                    { label: '3 anos', totalMonths: 36 },
                    { label: '5 anos', totalMonths: 60 },
                  ].map((preset) => (
                    <button
                      type="button"
                      key={preset.totalMonths}
                      onClick={() => setLifespanPreset(preset.totalMonths)}
                      className={`px-2.5 py-1 rounded-lg border text-xs transition-all tap-effect ${
                        formData.lifespanMonths === preset.totalMonths
                          ? 'border-[#ffbb00] bg-[#ffbb00]/20 text-[#ffbb00] font-bold'
                          : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Durabilidade / Construção */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Qualidade de Construção & Desgaste
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'fragile', label: 'Frágil / Perecível', sub: 'Desgaste rápido ou moda passageira' },
                  { value: 'standard', label: 'Padrão de Mercado', sub: 'Durabilidade esperada na média' },
                  { value: 'durable', label: 'Robusto / Bem Feito', sub: 'Materiais de alta resistência' },
                  { value: 'buy_it_for_life', label: 'Buy It For Life (BIFL)', sub: 'Feito para durar muitos anos' },
                ].map((tier) => {
                  const isSelected = formData.durability === tier.value;
                  return (
                    <button
                      type="button"
                      key={tier.value}
                      onClick={() => updateField('durability', tier.value as DurabilityTier)}
                      className={`flex flex-col text-left p-2.5 rounded-xl border transition-all tap-effect ${
                        isSelected
                          ? 'border-[#ffbb00] bg-[#ffbb00]/15 text-white'
                          : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-200">{tier.label}</span>
                        {isSelected && <Check className="h-3 w-3 text-[#ffbb00]" />}
                      </div>
                      <span className="text-[10px] text-zinc-400 mt-0.5">{tier.sub}</span>
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
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                Teste de Impulso & Fricção Mental
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400">
                O cérebro adora criar justificativas lógicas para desejos puramente emocionais.
              </p>
            </div>

            {/* Tempo pensando */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
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
                          ? 'border-[#ffbb00] bg-[#ffbb00]/15 text-white font-bold'
                          : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
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
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
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
                          ? 'border-[#ffbb00] bg-[#ffbb00]/15 text-white'
                          : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-200">{item.label}</span>
                        {isSelected && <Check className="h-3 w-3 text-[#ffbb00]" />}
                      </div>
                      <span className="text-[10px] text-zinc-400 mt-0.5">{item.sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* O Teste do Dinheiro na Mão */}
            <div className="space-y-2 rounded-2xl border border-[#ffbb00]/30 bg-[#ffbb00]/5 p-3.5">
              <div className="flex items-center gap-1.5 text-xs font-black text-[#ffbb00] uppercase tracking-wider">
                <DollarSign className="h-4 w-4" />
                O Teste do Dinheiro Vivo
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
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
                          ? 'border-[#ffbb00] bg-[#ffbb00]/20 text-white font-bold'
                          : 'border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <div className="text-xs font-semibold">{opt.label}</div>
                      <div className="text-[10px] text-zinc-400">{opt.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Alternativas Existentes */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
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
                          ? 'border-[#ffbb00] bg-[#ffbb00]/15 text-white'
                          : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <span className="text-xs font-bold text-zinc-200">{alt.label}</span>
                      <span className="text-[10px] text-zinc-400 mt-0.5">{alt.sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ===================== PASSO 4: FINANCEIRO & LIQUIDEZ ===================== */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase flex items-center gap-2">
                <Wallet className="h-6 w-6 text-[#ffbb00]" />
                <span>Financeiro & Liquidez</span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400">
                Como esse dinheiro sai da sua conta e quanto você reaveria se precisar revender.
              </p>
            </div>

            {/* 1. Origem do Dinheiro */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                1. De onde virá esse dinheiro para pagar?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => updateField('paidWithSavings', true)}
                  className={`flex flex-col p-3.5 rounded-xl border text-left transition-all tap-effect ${
                    formData.paidWithSavings
                      ? 'border-[#ffbb00] bg-[#ffbb00]/15 text-white ring-1 ring-[#ffbb00]'
                      : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-200">Reserva Planejada</span>
                    {formData.paidWithSavings && <Check className="h-4 w-4 text-[#ffbb00]" />}
                  </div>
                  <span className="text-[11px] text-zinc-400 mt-1">
                    Já guardei ou tenho sobra limpa sem aperto no orçamento
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => updateField('paidWithSavings', false)}
                  className={`flex flex-col p-3.5 rounded-xl border text-left transition-all tap-effect ${
                    !formData.paidWithSavings
                      ? 'border-amber-500 bg-amber-500/15 text-white ring-1 ring-amber-500'
                      : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-200">Salário / Parcelado</span>
                    {!formData.paidWithSavings && <Check className="h-4 w-4 text-amber-400" />}
                  </div>
                  <span className="text-[11px] text-zinc-400 mt-1">
                    Vai comprometer o orçamento do mês ou o limite do cartão
                  </span>
                </button>
              </div>
            </div>

            {/* 2. Liquidez de Revenda */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                2. Se você se arrepender em 6 meses, qual a facilidade de revender? (Liquidez)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { value: 'high', label: 'Alta Liquidez (~70%+)', sub: 'Fácil achar comprador rápido (Apple, lentes, pesos de academia)' },
                  { value: 'medium', label: 'Média Liquidez (~50%)', sub: 'Mercado razoável, vende por cerca de metade do valor' },
                  { value: 'low', label: 'Baixa Liquidez (~20-30%)', sub: 'Difícil achar comprador, grande perda de valor' },
                  { value: 'none', label: 'Nenhuma (Passivo Puro)', sub: 'Perda total de 100% (roupa comum, comida, serviço)' },
                ].map((item) => {
                  const isSelected = formData.liquidity === item.value;
                  return (
                    <button
                      type="button"
                      key={item.value}
                      onClick={() => updateField('liquidity', item.value as ResaleLiquidity)}
                      className={`flex flex-col text-left p-3 rounded-xl border transition-all tap-effect ${
                        isSelected
                          ? 'border-[#ffbb00] bg-[#ffbb00]/15 text-white ring-1 ring-[#ffbb00]'
                          : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-200">{item.label}</span>
                        {isSelected && <Check className="h-3.5 w-3.5 text-[#ffbb00]" />}
                      </div>
                      <span className="text-[10px] text-zinc-400 mt-0.5">{item.sub}</span>
                    </button>
                  );
                })}
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

        {/* Botões de Ação de Navegação */}
        <div className="flex items-center gap-3 pt-2">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-xs font-bold text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all tap-effect"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar</span>
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#ffbb00] py-3.5 text-xs font-black uppercase text-black hover:bg-[#e5a800] transition-all shadow-lg shadow-[#ffbb00]/20 tap-effect"
            >
              <span>Continuar</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#ffbb00] py-3.5 text-xs font-black uppercase text-black hover:bg-[#e5a800] transition-all shadow-lg shadow-[#ffbb00]/25 tap-effect"
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
