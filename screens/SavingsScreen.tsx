

import React, { useState } from 'react';
// Fix: Added .tsx extension to import path.
import { useAppContext } from '../context/AppContext.tsx';
// Fix: Added .ts extension to import path.
import type { SavingsPot } from '../types.ts';
// Fix: Added .tsx extension to import path.
import SavingsPotList from '../components/SavingsPotList.tsx';
// Fix: Added .tsx extension to import path.
import SavingsPotDetailScreen from './SavingsPotDetailScreen.tsx';
// Fix: Added .tsx extension to import path.
import CreateSavingsPotScreen from './CreateSavingsPotScreen.tsx';

type SavingsView = 'list' | 'details' | 'create';

const SavingsScreen: React.FC = () => {
    const { savingsPots } = useAppContext();
    const [view, setView] = useState<SavingsView>('list');
    const [selectedPot, setSelectedPot] = useState<SavingsPot | null>(null);

    const handleSelectPot = (pot: SavingsPot) => {
        setSelectedPot(pot);
        setView('details');
    };
    
    const handleCreateNew = () => {
        setView('create');
    };

    const handleBackToList = () => {
        setSelectedPot(null);
        setView('list');
    };

    const renderContent = () => {
        switch (view) {
            case 'details':
                return selectedPot && <SavingsPotDetailScreen pot={selectedPot} onBack={handleBackToList} />;
            case 'create':
                return <CreateSavingsPotScreen onBack={handleBackToList} />;
            case 'list':
            default:
                return <SavingsPotList pots={savingsPots} onSelectPot={handleSelectPot} onCreateNew={handleCreateNew} />;
        }
    };

    return <div className="pb-20">{renderContent()}</div>;
};

export default SavingsScreen;