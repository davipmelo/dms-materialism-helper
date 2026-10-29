import React, { useState } from 'react';
import { UserProfile } from '../../types/purchase';
import { formatBRL } from '../../utils/calculations';
import { 
  X, 
  Settings, 
  Download, 
  Upload, 
  Trash2, 
  Briefcase 
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onExportBackup: () => void;
  onImportBackup: (file: File) => Promise<boolean>;
  onClearAll: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  onExportBackup,
  onImportBackup,
  onClearAll,
}) => {
  if (!isOpen) return null;

  const [monthlyIncome, setMonthlyIncome] = useState<number>(profile.monthlyIncome);
  const [workingHoursMonth, setWorkingHoursMonth] = useState<number>(profile.workingHoursMonth);
  const [importStatus, setImportStatus] = useState<string>('');

  const hourlyRate = workingHoursMonth > 0 ? monthlyIncome / workingHoursMonth : 0;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...profile,
      monthlyIncome,
      workingHoursMonth,
      hourlyWage: hourlyRate,
      isConfigured: true,
    });
    onClose();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setImportStatus('Carregando...');
      await onImportBackup(file);
      setImportStatus('Backup restaurado com sucesso!');
      setTimeout(() => setImportStatus(''), 2500);
    } catch (err) {
      setImportStatus('Erro ao importar arquivo.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#ffbb00]/15 text-[#ffbb00] border border-[#ffbb00]/30">
              <Settings className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white uppercase">
                Configurações & Backup
              </h3>
              <span className="text-[11px] text-zinc-400">Personalize seus cálculos</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-4 space-y-5">
          {/* Parâmetros de Hora de Trabalho */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 text-[#ffbb00]" />
              Sua Hora de Trabalho
            </h4>
            <p className="text-[11px] text-zinc-400">
              Usado para converter o preço dos produtos em dias e horas reais de esforço profissional.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-300">
                  Renda Líquida Mensal (R$)
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={monthlyIncome || ''}
                  onChange={(e) => setMonthlyIncome(parseFloat(e.target.value) || 0)}
                  placeholder="0,00"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-bold text-white focus:border-[#ffbb00] focus:outline-none focus:ring-1 focus:ring-[#ffbb00]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-300">
                  Horas Trabalhadas/Mês
                </label>
                <input
                  type="number"
                  min="1"
                  value={workingHoursMonth || ''}
                  onChange={(e) => setWorkingHoursMonth(parseInt(e.target.value) || 160)}
                  placeholder="160"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-bold text-white focus:border-[#ffbb00] focus:outline-none focus:ring-1 focus:ring-[#ffbb00]"
                />
              </div>
            </div>

            {/* Resultado do Valor da Hora */}
            <div className="rounded-xl border border-[#ffbb00]/30 bg-[#ffbb00]/10 p-3 flex items-center justify-between">
              <span className="text-xs text-zinc-300">Valor da sua hora líquida:</span>
              <span className="text-xs font-black text-[#ffbb00]">
                {formatBRL(hourlyRate)} / hora
              </span>
            </div>
          </div>

          {/* Backup e Dados */}
          <div className="space-y-3 border-t border-zinc-800 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <Download className="h-3.5 w-3.5 text-[#ffbb00]" />
              Backup & Portabilidade
            </h4>
            <p className="text-[11px] text-zinc-400">
              Seus dados ficam 100% seguros e salvos no navegador. Exporte um backup para transferir para outro celular ou computador.
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={onExportBackup}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 py-2.5 px-3 text-xs font-bold text-zinc-200 hover:bg-zinc-800 hover:text-white tap-effect"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Exportar JSON</span>
              </button>

              <label className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 py-2.5 px-3 text-xs font-bold text-zinc-200 hover:bg-zinc-800 hover:text-white cursor-pointer tap-effect">
                <Upload className="h-3.5 w-3.5" />
                <span>Importar JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {importStatus && (
              <div className="text-center text-xs font-bold text-[#ffbb00] pt-1">
                {importStatus}
              </div>
            )}
          </div>

          {/* Botão de Limpar Dados */}
          <div className="pt-2 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => {
                if (confirm('Tem certeza de que deseja apagar todos os dados salvos? Esta ação não pode ser desfeita.')) {
                  onClearAll();
                  onClose();
                }
              }}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 tap-effect"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Limpar todos os dados</span>
            </button>
          </div>

          {/* Salvar Configurações */}
          <button
            type="submit"
            className="w-full rounded-xl bg-[#ffbb00] py-3 text-xs font-black uppercase text-black hover:bg-[#e5a800] transition-all tap-effect shadow-lg shadow-[#ffbb00]/20"
          >
            Salvar Preferências
          </button>
        </form>
      </div>
    </div>
  );
};
