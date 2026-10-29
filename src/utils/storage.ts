import {
  PurchaseItem,
  PurchaseReview,
  PurchaseStatus,
  UserProfile,
} from '../types/purchase';
import { DEFAULT_USER_PROFILE } from './calculations';

const STORAGE_KEY_ITEMS = 'dms_materialism_items_v1';
const STORAGE_KEY_PROFILE = 'dms_materialism_profile_v1';

// Seed inicial para inspirar o usuário na primeira visita
const INITIAL_DEMO_ITEMS: PurchaseItem[] = [
  {
    id: 'demo-1',
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    quarantineUntil: new Date(Date.now() - 38 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'reviewed',
    input: {
      name: 'Fone com Cancelamento de Ruído (Bose/Sony)',
      category: 'work',
      price: 1800,
      frequency: 'daily',
      lifespanMonths: 36,
      durability: 'durable',
      liquidity: 'medium',
      paidWithSavings: true,
      desireAge: 'months',
      trigger: 'real_pain',
      alternative: 'none',
      preferCashOverItem: 'item',
      notes: 'Trabalho em home office com barulho da rua, precisava focar.',
    },
    metrics: {
      score: 92,
      tier: 'excellent',
      tierLabel: 'Excelente Investimento',
      tierColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      costPerUse: 1.64,
      totalEstimatedUses: 1095,
      hoursOfWork: 57.6,
      opportunityCost2Years: 2197.80,
      insights: [
        'Super eficiente: custará aprox. R$ 1,64 por cada dia de uso.',
        'Resolveu uma dor real que atrapalhava o ganho de produtividade.',
      ],
      verdict: 'Compra altamente recomendada. Transforma o dia a dia.',
      quarantineDaysRemaining: 0,
    },
    review: {
      reviewDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      actualFrequency: 'daily',
      actualCostPerUse: 1.64,
      stillUsing: true,
      satisfactionRating: 5,
      reflection: 'Uso todo santo dia para trabalhar. Uma das melhores compras que já fiz.',
      wasWorthIt: true,
    },
  },
  {
    id: 'demo-2',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    quarantineUntil: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'passed',
    input: {
      name: 'Jaqueta Bomber Corta-Vento de Grife',
      category: 'clothing',
      price: 890,
      frequency: 'rarely',
      lifespanMonths: 12,
      durability: 'fragile',
      liquidity: 'low',
      paidWithSavings: false,
      desireAge: 'minutes',
      trigger: 'social_media',
      alternative: 'have_similar',
      preferCashOverItem: 'cash',
      notes: 'Apareceu num anúncio patrocinado do Instagram com modelo estiloso.',
    },
    metrics: {
      score: 22,
      tier: 'terrible',
      tierLabel: 'Alerta de Impulso',
      tierColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      costPerUse: 222.50,
      totalEstimatedUses: 4,
      hoursOfWork: 28.5,
      opportunityCost2Years: 1086.69,
      insights: [
        'Atenção: cada vez que vestir, custará absurdos R$ 222,50!',
        'Gatilho 100% induzido por anúncio no feed.',
        'Você já tem outras 3 jaquetas no armário.',
      ],
      verdict: 'Impulso passageiro. Economize seus R$ 890,00.',
      quarantineDaysRemaining: 0,
    },
  },
];

export function getStoredItems(): PurchaseItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ITEMS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(INITIAL_DEMO_ITEMS));
      return INITIAL_DEMO_ITEMS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load items from storage:', err);
    return [];
  }
}

export function saveStoredItems(items: PurchaseItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save items to storage:', err);
  }
}

export function getStoredProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (!raw) {
      return DEFAULT_USER_PROFILE;
    }
    return { ...DEFAULT_USER_PROFILE, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Failed to load profile:', err);
    return DEFAULT_USER_PROFILE;
  }
}

export function saveStoredProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save profile:', err);
  }
}

export function addItem(item: PurchaseItem): PurchaseItem[] {
  const current = getStoredItems();
  const updated = [item, ...current];
  saveStoredItems(updated);
  return updated;
}

export function updateItemStatus(id: string, status: PurchaseStatus): PurchaseItem[] {
  const current = getStoredItems();
  const updated = current.map((item) =>
    item.id === id ? { ...item, status } : item
  );
  saveStoredItems(updated);
  return updated;
}

export function submitItemReview(id: string, review: PurchaseReview): PurchaseItem[] {
  const current = getStoredItems();
  const updated = current.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        status: 'reviewed' as PurchaseStatus,
        review,
      };
    }
    return item;
  });
  saveStoredItems(updated);
  return updated;
}

export function deleteItem(id: string): PurchaseItem[] {
  const current = getStoredItems();
  const updated = current.filter((item) => item.id !== id);
  saveStoredItems(updated);
  return updated;
}

export function exportBackupJSON(): void {
  const items = getStoredItems();
  const profile = getStoredProfile();
  const data = {
    exportedAt: new Date().toISOString(),
    version: '1.0',
    profile,
    items,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `materialism-helper-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importBackupJSON(file: File): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed.items)) {
          saveStoredItems(parsed.items);
          if (parsed.profile) {
            saveStoredProfile(parsed.profile);
          }
          resolve(true);
        } else {
          reject(new Error('Formato de backup inválido'));
        }
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    reader.readAsText(file);
  });
}
