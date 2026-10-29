import React, { useState } from 'react';
import { X } from 'lucide-react';

interface EmojiPickerModalProps {
  isOpen: boolean;
  currentEmoji: string;
  itemName: string;
  onClose: () => void;
  onSelectEmoji: (emoji: string) => void;
}

const EMOJI_CATEGORIES: { name: string; icon: string; emojis: string[] }[] = [
  {
    name: 'Tech & Gadgets',
    icon: '💻',
    emojis: [
      '💻', '📱', '🎧', '⌚', '🎮', '📷', '🖥️', '⌨️', '🖱️', '🕹️',
      '🔌', '🔋', '🤖', '🎙️', '🔊', '📺', '📼', '💾', '💿', '📡',
      '📽️', '🎛️', '🔭', '🔬', '📲', '🖨️', '⚡', '🔋', '💡', '🔦'
    ],
  },
  {
    name: 'Vestuário & Estilo',
    icon: '👕',
    emojis: [
      '👕', '👖', '👔', '👗', '👟', '👞', '🥾', '👠', '👡', '👢',
      '🧥', '🧣', '🧤', '🧢', '🎩', '💍', '🎒', '👜', '🧳', '🕶️',
      '🥽', '🧵', '🪡', '🪮', '🧴', '💄', '👛', '🩳', '👙', '🩱'
    ],
  },
  {
    name: 'Casa & Conforto',
    icon: '🏠',
    emojis: [
      '🏠', '🛋️', '🛏️', '🪑', '🚪', '🪴', '☕', '🍵', '🍳', '🔪',
      '🧹', '🪟', '🕯️', '💡', '🚿', '🛁', '🧺', '🧯', '🧱', '🖼️',
      '🍽️', '🥣', '🧂', '🧊', '🪞', '🧻', '🪣', '🪜', '🧲', '⏰'
    ],
  },
  {
    name: 'Fitness & Saúde',
    icon: '🏃',
    emojis: [
      '🏃', '🏋️', '🚴', '🏊', '🧗', '🥊', '⚽', '🏀', '🎾', '🎿',
      '🛹', '🧘', '👟', '🥇', '🎯', '🥤', '🥗', '💊', '🩺', '🫀',
      '🤿', '🏄', '🏌️', '🪂', '🥋', '🏸', '🏓', '🥌', '🏹', '🎣'
    ],
  },
  {
    name: 'Lazer & Hobbies',
    icon: '🎮',
    emojis: [
      '🎮', '🎲', '🎸', '🎹', '🎨', '📚', '🎬', '🎟️', '⛺', '🛹',
      '🧩', '♟️', '🎺', '🥁', '🎻', '🎤', '🎧', '📻', '🎠', '🎢',
      '🎪', '🎭', '🪗', '🪘', '🕹️', '🎳', '🪁', '🔮', '🃏', '🪅'
    ],
  },
  {
    name: 'Trabalho & Ferramentas',
    icon: '💼',
    emojis: [
      '💼', '💻', '🖊️', '📒', '🔨', '🪚', '🔧', '🪛', '📐', '🗄️',
      '📊', '✂️', '🗃️', '📦', '🏷️', '🔍', '💡', '🖨️', '📁', '📎',
      '📏', '🛠️', '🗜️', '⚙️', '🔒', '🔑', '📬', '📜', '⚖️', '📌'
    ],
  },
  {
    name: 'Veículos & Viagem',
    icon: '🚗',
    emojis: [
      '🚗', '🏎️', '🏍️', '🛵', '🚲', '🛴', '✈️', '🚀', '🚤', '🚁',
      '⛵', '🚐', '🚙', '🚜', '🛶', '🚂', '🚇', '🛸', '🛰️', '🧳'
    ],
  },
  {
    name: 'Destaques & Símbolos',
    icon: '⭐',
    emojis: [
      '⭐', '✨', '🔥', '💎', '🛡️', '⚡', '🎯', '🚀', '🧠', '👑',
      '🏆', '💰', '💸', '💳', '🛒', '🎁', '🔔', '❤️', '🖤', '💛'
    ],
  },
];

export const EmojiPickerModal: React.FC<EmojiPickerModalProps> = ({
  isOpen,
  currentEmoji,
  itemName,
  onClose,
  onSelectEmoji,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<number>(0);
  const [customInput, setCustomInput] = useState<string>('');

  const currentCategory = EMOJI_CATEGORIES[activeTab];

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      onSelectEmoji(customInput.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div>
            <h3 className="text-sm sm:text-base font-black text-white uppercase flex items-center gap-2">
              <span>Alterar Ícone</span>
              <span className="text-xl">{currentEmoji}</span>
            </h3>
            <span className="text-xs text-zinc-400 truncate max-w-[260px] block">
              {itemName}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Input para colar qualquer emoji personalizado */}
        <form onSubmit={handleCustomSubmit} className="flex gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Digite ou cole qualquer emoji aqui..."
            className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-[#ffbb00] focus:outline-none"
            maxLength={4}
          />
          <button
            type="submit"
            className="rounded-xl bg-[#ffbb00] px-3.5 py-2 text-xs font-black uppercase text-black hover:bg-[#e5a800] tap-effect"
          >
            Usar
          </button>
        </form>

        {/* Abas de Categorias de Emojis */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar border-b border-zinc-800/80">
          {EMOJI_CATEGORIES.map((cat, idx) => (
            <button
              key={cat.name}
              onClick={() => setActiveTab(idx)}
              className={`flex items-center gap-1.5 shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all tap-effect ${
                activeTab === idx
                  ? 'bg-[#ffbb00]/20 text-[#ffbb00] border border-[#ffbb00]/30'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <span>{cat.icon}</span>
              <span className="text-[11px]">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Grid de Emojis */}
        <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-56 overflow-y-auto p-1">
          {currentCategory.emojis.map((emoji, index) => (
            <button
              key={index}
              onClick={() => {
                onSelectEmoji(emoji);
                onClose();
              }}
              className={`flex h-11 w-11 items-center justify-center rounded-xl text-2xl transition-all tap-effect hover:scale-125 ${
                currentEmoji === emoji
                  ? 'border-2 border-[#ffbb00] bg-[#ffbb00]/20 shadow-md shadow-[#ffbb00]/20'
                  : 'bg-zinc-900/60 hover:bg-zinc-800'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
