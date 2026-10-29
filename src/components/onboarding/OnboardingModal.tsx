import React, { useState } from 'react';
import { UserProfile } from '../../types/purchase';
import { formatBRL } from '../../utils/calculations';
import { ShieldCheck, Briefcase, ArrowRight } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (profile: UserProfile) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
}) => {
  if (!isOpen) return null;

  const [income, setIncome] = useState<string>('');
  const [hours, setHours] = useState<string>('160');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const numIncome = parseFloat(income) || 0;
  const numHours = parseInt(hours) || 160;
  const hourlyRate = numHours > 0 ? numIncome / numHours : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numIncome <= 0) {
      setErrorMsg('Por favor, informe sua renda mensal líquida aproximada.');
      return;
    }
    if (numHours <= 0) {
      setErrorMsg('Por favor, informe as horas trabalhadas por mês (ex: 160h).');
      return;
    }

    onComplete({
      monthlyIncome: numIncome,
      workingHoursMonth: numHours,
      hourlyWage: hourlyRate,
      currency: 'BRL',
      isConfigured: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header com ícone amarelo */}
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffbb00]/15 border border-[#ffbb00]/30 text-[#ffbb00] shadow-lg shadow-[#ffbb00]/10">
            <ShieldCheck className="h-7 w-7 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-white uppercase">
              Bem-vindo ao <span className="text-[#ffbb00]">DM`S MATERIALISM HELPER</span>
            </h2>
            <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">
              Para calcularmos exatamente o <strong>custo por uso</strong> e quantas <strong>horas ou dias de vida</strong> cada compra consome, configure sua base financeira:
            </p>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Sua Renda Líquida Mensal (R$) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-sm font-semibold text-zinc-500">
                R$
              </span>
              <input
                type="number"
                step="50"
                min="1"
                value={income}
                onChange={(e) => {
                  setIncome(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Ex: 5000"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 pl-11 pr-4 py-2.5 text-sm font-bold text-white placeholder-zinc-600 focus:border-[#ffbb00] focus:outline-none focus:ring-1 focus:ring-[#ffbb00]"
                autoFocus
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Horas Trabalhadas por Mês
              </label>
              <span className="text-[10px] text-zinc-500">Padrão CLT: 160h/mês</span>
            </div>
            <input
              type="number"
              min="1"
              value={hours}
              onChange={(e) => {
                setHours(e.target.value);
                setErrorMsg('');
              }}
              placeholder="160"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 px-4 py-2.5 text-sm font-bold text-white placeholder-zinc-600 focus:border-[#ffbb00] focus:outline-none focus:ring-1 focus:ring-[#ffbb00]"
            />
          </div>

          {/* Prévia da hora de trabalho */}
          {numIncome > 0 && (
            <div className="rounded-xl border border-[#ffbb00]/30 bg-[#ffbb00]/10 p-3.5 flex items-center justify-between animate-fade-in">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-[#ffbb00]" />
                <span className="text-xs text-zinc-300">Sua hora de trabalho:</span>
              </div>
              <span className="text-xs font-black text-[#ffbb00]">
                {formatBRL(hourlyRate)} / hora
              </span>
            </div>
          )}

          {errorMsg && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-2.5 text-xs text-rose-300 text-center">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#ffbb00] py-3 text-xs font-black uppercase tracking-wider text-black hover:bg-[#e5a800] transition-all shadow-lg shadow-[#ffbb00]/20 tap-effect"
          >
            <span>Iniciar Sistema</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="text-[11px] text-zinc-500 text-center">
          Você poderá alterar esses valores a qualquer momento no ícone de configurações.
        </p>
      </div>
    </div>
  );
};

