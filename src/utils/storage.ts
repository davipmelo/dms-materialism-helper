import {
  PurchaseItem,
  PurchaseReview,
  PurchaseStatus,
  UserProfile,
} from '../types/purchase';
import { DEFAULT_USER_PROFILE } from './calculations';

const STORAGE_KEY_ITEMS = 'dms_materialism_items_v1';
const STORAGE_KEY_PROFILE = 'dms_materialism_profile_v1';

export function getStoredItems(): PurchaseItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ITEMS);
    if (!raw) {
      return [];
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

export function updateItemInput(
  id: string,
  input: PurchaseItem['input'],
  metrics: PurchaseItem['metrics']
): PurchaseItem[] {
  const current = getStoredItems();
  const updated = current.map((item) =>
    item.id === id ? { ...item, input, metrics } : item
  );
  saveStoredItems(updated);
  return updated;
}

export function updateItemIcon(id: string, customIcon: string): PurchaseItem[] {
  const current = getStoredItems();
  const updated = current.map((item) =>
    item.id === id ? { ...item, customIcon } : item
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
