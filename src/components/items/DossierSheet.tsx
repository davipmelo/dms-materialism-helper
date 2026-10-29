import React from 'react';
import { PurchaseEvaluationInput, CalculatedMetrics } from '../../types/purchase';
import { 
  FREQUENCY_LABELS, 
  DURABILITY_LABELS, 
  DESIRE_AGE_LABELS, 
  TRIGGER_LABELS, 
  ALTERNATIVE_LABELS, 
  LIQUIDITY_LABELS, 
  PREFER_CASH_LABELS 
} from '../../utils/calculations';
import { 
  FileText, 
  Link2, 
  ExternalLink, 
  Activity, 
  BrainCircuit, 
  Wallet, 
  Layers 
} from 'lucide-react';

interface DossierSheetProps {
  input: PurchaseEvaluationInput;
  metrics: CalculatedMetrics;
}

export const DossierSheet: React.FC<DossierSheetProps> = ({ input }) => {
  // Formatação de anos e meses
  const years = Math.floor(input.lifespanMonths / 12);
  const months = input.lifespanMonths % 12;
  const lifespanFormatted = [
    years > 0 ? `${years} ${years === 1 ? 'ano' : 'anos'}` : null,
    months > 0 ? `${months} ${months === 1 ? 'mês' : 'meses'}` : null,
  ].filter(Boolean).join(' e ') || '1 mês';

  // Obter hostname do link direto se fornecido
  let linkHostname = '';
  if (input.link) {
    try {
      const url = new URL(input.link);
      linkHostname = url.hostname.replace('www.', '');
    } catch {
      linkHostname = 'Link do Produto';
    }
  }

  const reasonText = input.reason || input.notes;

  return (
    <div className="space-y-4 pt-2">
      {/* 1. Motivo da Compra (se preenchido) */}
      {reasonText && (
        <div className="rounded-2xl border border-[#ffbb00]/25 bg-zinc-950/80 p-4 space-y-1.5 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#ffbb00]">
            <FileText className="h-4 w-4" />
            <span>Motivo da Compra</span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed italic">
            "{reasonText}"
          </p>
        </div>
      )}

      {/* 2. Card do Link Direto (SOMENTE se o usuário colou o link) */}
      {input.link && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ffbb00]/15 text-[#ffbb00] border border-[#ffbb00]/30">
              <Link2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Página Oficial do Produto
              </div>
              <div className="text-xs font-bold text-white truncate max-w-xs sm:max-w-md">
                {linkHostname}
              </div>
            </div>
          </div>

          <a
            href={input.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ffbb00] px-4 py-2.5 text-xs font-black uppercase text-black hover:bg-[#e5a800] transition-all tap-effect shadow-md shadow-[#ffbb00]/15 shrink-0"
          >
            <span>Acessar Link da Loja</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      )}

      {/* 3. Ficha Completa de Respostas do Formulário */}
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950/90 p-5 sm:p-6 space-y-5">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
          <Layers className="h-4 w-4 text-[#ffbb00]" />
          <h3 className="text-xs font-black uppercase tracking-wider text-white">
            Ficha de Respostas & Dossiê Completo
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Coluna 1: Utilidade */}
          <div className="space-y-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-300">
              <Activity className="h-3.5 w-3.5 text-[#ffbb00]" />
              <span>Utilidade & Tempo</span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[10px] uppercase text-zinc-500 font-semibold block">
                  Frequência esperada
                </span>
                <span className="font-bold text-zinc-200">
                  {FREQUENCY_LABELS[input.frequency] || input.frequency}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase text-zinc-500 font-semibold block">
                  Vida útil prevista
                </span>
                <span className="font-bold text-zinc-200">
                  {lifespanFormatted} ({input.lifespanMonths} meses)
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase text-zinc-500 font-semibold block">
                  Qualidade de Construção
                </span>
                <span className="font-bold text-zinc-200">
                  {DURABILITY_LABELS[input.durability] || input.durability}
                </span>
              </div>
            </div>
          </div>

          {/* Coluna 2: Impulso & Fricção */}
          <div className="space-y-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-300">
              <BrainCircuit className="h-3.5 w-3.5 text-amber-400" />
              <span>Fricção & Impulso</span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[10px] uppercase text-zinc-500 font-semibold block">
                  Tempo pensando no item
                </span>
                <span className="font-bold text-zinc-200">
                  {DESIRE_AGE_LABELS[input.desireAge] || input.desireAge}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase text-zinc-500 font-semibold block">
                  Gatilho inicial
                </span>
                <span className="font-bold text-zinc-200">
                  {TRIGGER_LABELS[input.trigger] || input.trigger}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase text-zinc-500 font-semibold block">
                  Alternativas existentes
                </span>
                <span className="font-bold text-zinc-200">
                  {ALTERNATIVE_LABELS[input.alternative] || input.alternative}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase text-zinc-500 font-semibold block">
                  Teste do Dinheiro na mão
                </span>
                <span className="font-bold text-[#ffbb00]">
                  {PREFER_CASH_LABELS[input.preferCashOverItem] || input.preferCashOverItem}
                </span>
              </div>
            </div>
          </div>

          {/* Coluna 3: Financeiro & Liquidez */}
          <div className="space-y-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-300">
              <Wallet className="h-3.5 w-3.5 text-[#ffbb00]" />
              <span>Financeiro & Liquidez</span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[10px] uppercase text-zinc-500 font-semibold block">
                  Origem do Recurso
                </span>
                <span className="font-bold text-zinc-200">
                  {input.paidWithSavings 
                    ? 'Reserva planejada (sem aperto)' 
                    : 'Compromete salário / Parcelado no cartão'}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase text-zinc-500 font-semibold block">
                  Liquidez de Revenda
                </span>
                <span className="font-bold text-zinc-200">
                  {LIQUIDITY_LABELS[input.liquidity] || input.liquidity}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

