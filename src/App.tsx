import { useState, useEffect } from 'react';
import { 
  PurchaseItem, 
  PurchaseEvaluationInput, 
  CalculatedMetrics, 
  PurchaseStatus, 
  PurchaseReview, 
  UserProfile 
} from './types/purchase';
import { 
  getStoredItems, 
  saveStoredItems, 
  getStoredProfile, 
  saveStoredProfile, 
  addItem, 
  updateItemStatus, 
  updateItemIcon,
  updateItemInput,
  submitItemReview, 
  deleteItem, 
  exportBackupJSON, 
  importBackupJSON 
} from './utils/storage';
import { calculateMetrics } from './utils/calculations';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { WizardForm } from './components/wizard/WizardForm';
import { ResultCard } from './components/wizard/ResultCard';
import { ItemList } from './components/items/ItemList';
import { StatsDashboard } from './components/stats/StatsDashboard';
import { ReviewModal } from './components/items/ReviewModal';
import { SettingsModal } from './components/settings/SettingsModal';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { ItemSummaryModal } from './components/items/ItemSummaryModal';
import { EmojiPickerModal } from './components/items/EmojiPickerModal';

export function App() {
  const [currentTab, setCurrentTab] = useState<'wizard' | 'items' | 'stats'>('wizard');
  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [profile, setProfile] = useState<UserProfile>(getStoredProfile());
  
  // Estado do Wizard atual
  const [activeInput, setActiveInput] = useState<PurchaseEvaluationInput | null>(null);
  const [activeMetrics, setActiveMetrics] = useState<CalculatedMetrics | null>(null);
  const [editingItem, setEditingItem] = useState<PurchaseItem | null>(null);

  // Modais
  const [viewingSummaryItem, setViewingSummaryItem] = useState<PurchaseItem | null>(null);
  const [changingEmojiItem, setChangingEmojiItem] = useState<PurchaseItem | null>(null);
  const [reviewingItem, setReviewingItem] = useState<PurchaseItem | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Carregar dados no mount
  useEffect(() => {
    const loadedItems = getStoredItems();
    setItems(loadedItems);
    const loadedProfile = getStoredProfile();
    setProfile(loadedProfile);
  }, []);

  // Iniciar edição de item existente
  const handleStartEditItem = (item: PurchaseItem) => {
    setViewingSummaryItem(null);
    setActiveInput(null);
    setActiveMetrics(null);
    setEditingItem(item);
    setCurrentTab('wizard');
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setCurrentTab('items');
  };

  // Handler de cálculo / submissão do formulário
  const handleFormSubmit = (data: PurchaseEvaluationInput) => {
    const metrics = calculateMetrics(data, profile);

    if (editingItem) {
      // Atualizar o item existente no armazenamento e no estado
      const updated = updateItemInput(editingItem.id, data, metrics);
      setItems(updated);

      const updatedItem: PurchaseItem = {
        ...editingItem,
        input: data,
        metrics,
      };

      setEditingItem(null);
      setActiveInput(null);
      setActiveMetrics(null);
      setCurrentTab('items');
      // Reabre o Dossiê para mostrar o veredito atualizado
      setViewingSummaryItem(updatedItem);
    } else {
      setActiveInput(data);
      setActiveMetrics(metrics);
    }
  };

  // Salvar novo item
  const createAndSaveItem = (status: PurchaseStatus) => {
    if (!activeInput || !activeMetrics) return;

    const newItem: PurchaseItem = {
      id: `item-${Date.now()}`,
      createdAt: new Date().toISOString(),
      quarantineUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status,
      input: activeInput,
      metrics: activeMetrics,
      customIcon: activeInput.customIcon,
    };

    const updated = addItem(newItem);
    setItems(updated);
    setActiveInput(null);
    setActiveMetrics(null);
    setCurrentTab('items');
  };

  const handleUpdateStatus = (id: string, status: PurchaseStatus) => {
    const updated = updateItemStatus(id, status);
    setItems(updated);
    if (viewingSummaryItem && viewingSummaryItem.id === id) {
      setViewingSummaryItem({ ...viewingSummaryItem, status });
    }
  };

  const handleSelectEmoji = (newEmoji: string) => {
    if (!changingEmojiItem) return;
    const updated = updateItemIcon(changingEmojiItem.id, newEmoji);
    setItems(updated);
    if (viewingSummaryItem && viewingSummaryItem.id === changingEmojiItem.id) {
      setViewingSummaryItem({ ...viewingSummaryItem, customIcon: newEmoji });
    }
    setChangingEmojiItem(null);
  };

  const handleSubmitReview = (itemId: string, review: PurchaseReview) => {
    const updated = submitItemReview(itemId, review);
    setItems(updated);
    if (viewingSummaryItem && viewingSummaryItem.id === itemId) {
      setViewingSummaryItem({
        ...viewingSummaryItem,
        status: 'reviewed',
        review,
      });
    }
  };

  const handleDeleteItem = (id: string) => {
    const updated = deleteItem(id);
    setItems(updated);
    if (viewingSummaryItem && viewingSummaryItem.id === id) {
      setViewingSummaryItem(null);
    }
  };

  const handleSaveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    saveStoredProfile(newProfile);
  };

  const handleImportBackup = async (file: File) => {
    const success = await importBackupJSON(file);
    if (success) {
      setItems(getStoredItems());
      setProfile(getStoredProfile());
    }
    return success;
  };

  const handleClearAll = () => {
    saveStoredItems([]);
    setItems([]);
  };

  const quarantineCount = items.filter((i) => i.status === 'quarantine').length;
  const isNeedsOnboarding = !profile.isConfigured || profile.monthlyIncome <= 0;

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-[#ffbb00]/25 selection:text-[#ffbb00]">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'wizard' && currentTab !== 'wizard') {
            setEditingItem(null);
            setActiveInput(null);
            setActiveMetrics(null);
          }
          setCurrentTab(tab);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        itemsCount={{
          quarantine: quarantineCount,
          total: items.length,
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-20 md:pb-12">
        {currentTab === 'wizard' && (
          <>
            {activeInput && activeMetrics ? (
              <ResultCard
                input={activeInput}
                metrics={activeMetrics}
                onSaveToQuarantine={() => createAndSaveItem('quarantine')}
                onMarkAsPassed={() => createAndSaveItem('passed')}
                onMarkAsBought={() => createAndSaveItem('bought')}
                onReset={() => {
                  setActiveInput(null);
                  setActiveMetrics(null);
                  setEditingItem(null);
                }}
              />
            ) : (
              <WizardForm 
                onSubmit={handleFormSubmit}
                initialData={editingItem ? editingItem.input : null}
                isEditing={!!editingItem}
                onCancelEdit={handleCancelEdit}
              />
            )}
          </>
        )}

        {currentTab === 'items' && (
          <ItemList
            items={items}
            onUpdateStatus={handleUpdateStatus}
            onOpenReview={(item) => setReviewingItem(item)}
            onViewSummary={(item) => setViewingSummaryItem(item)}
            onOpenEmojiPicker={(item) => setChangingEmojiItem(item)}
            onEditItem={handleStartEditItem}
            onDeleteItem={handleDeleteItem}
            onNavigateToWizard={() => {
              setActiveInput(null);
              setActiveMetrics(null);
              setEditingItem(null);
              setCurrentTab('wizard');
            }}
          />
        )}

        {currentTab === 'stats' && (
          <StatsDashboard
            items={items}
            onNavigateToWizard={() => {
              setActiveInput(null);
              setActiveMetrics(null);
              setEditingItem(null);
              setCurrentTab('wizard');
            }}
          />
        )}
      </main>

      {/* Item Full Summary Modal (Re-abrir dossiê/análise a partir do histórico) */}
      <ItemSummaryModal
        item={viewingSummaryItem}
        isOpen={!!viewingSummaryItem}
        onClose={() => setViewingSummaryItem(null)}
        onUpdateStatus={handleUpdateStatus}
        onOpenReview={(item) => setReviewingItem(item)}
        onOpenEmojiPicker={(item) => setChangingEmojiItem(item)}
        onEditItem={handleStartEditItem}
      />

      {/* Emoji Picker Modal */}
      {changingEmojiItem && (
        <EmojiPickerModal
          isOpen={!!changingEmojiItem}
          currentEmoji={changingEmojiItem.customIcon || changingEmojiItem.input.customIcon || '📦'}
          itemName={changingEmojiItem.input.name}
          onClose={() => setChangingEmojiItem(null)}
          onSelectEmoji={handleSelectEmoji}
        />
      )}

      {/* Review Modal */}
      {reviewingItem && (
        <ReviewModal
          item={reviewingItem}
          isOpen={!!reviewingItem}
          onClose={() => setReviewingItem(null)}
          onSubmitReview={handleSubmitReview}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
        onExportBackup={exportBackupJSON}
        onImportBackup={handleImportBackup}
        onClearAll={handleClearAll}
      />

      {/* Onboarding Modal - Exibido na primeira vez até configurar salário e horas */}
      <OnboardingModal
        isOpen={isNeedsOnboarding}
        onComplete={handleSaveProfile}
      />

      {/* Mobile Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'wizard' && currentTab !== 'wizard') {
            setEditingItem(null);
            setActiveInput(null);
            setActiveMetrics(null);
          }
          setCurrentTab(tab);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        quarantineCount={quarantineCount}
      />
    </div>
  );
}

export default App;
