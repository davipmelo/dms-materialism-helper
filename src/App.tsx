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

export function App() {
  const [currentTab, setCurrentTab] = useState<'wizard' | 'items' | 'stats'>('wizard');
  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [profile, setProfile] = useState<UserProfile>(getStoredProfile());
  
  // Estado do Wizard atual
  const [activeInput, setActiveInput] = useState<PurchaseEvaluationInput | null>(null);
  const [activeMetrics, setActiveMetrics] = useState<CalculatedMetrics | null>(null);

  // Modais
  const [reviewingItem, setReviewingItem] = useState<PurchaseItem | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Carregar dados no mount
  useEffect(() => {
    const loadedItems = getStoredItems();
    setItems(loadedItems);
    const loadedProfile = getStoredProfile();
    setProfile(loadedProfile);
  }, []);

  // Handler de cálculo do formulário
  const handleFormSubmit = (data: PurchaseEvaluationInput) => {
    const metrics = calculateMetrics(data, profile);
    setActiveInput(data);
    setActiveMetrics(metrics);
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
  };

  const handleSubmitReview = (itemId: string, review: PurchaseReview) => {
    const updated = submitItemReview(itemId, review);
    setItems(updated);
  };

  const handleDeleteItem = (id: string) => {
    const updated = deleteItem(id);
    setItems(updated);
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab === 'wizard' && activeMetrics) {
            // Permite ver o resultado anterior se estiver ativo
          }
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
                }}
              />
            ) : (
              <WizardForm onSubmit={handleFormSubmit} />
            )}
          </>
        )}

        {currentTab === 'items' && (
          <ItemList
            items={items}
            onUpdateStatus={handleUpdateStatus}
            onOpenReview={(item) => setReviewingItem(item)}
            onDeleteItem={handleDeleteItem}
            onNavigateToWizard={() => {
              setActiveInput(null);
              setActiveMetrics(null);
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
              setCurrentTab('wizard');
            }}
          />
        )}
      </main>

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

      {/* Mobile Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        quarantineCount={quarantineCount}
      />
    </div>
  );
}

export default App;
