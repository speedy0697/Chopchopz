import React, { useState, useMemo } from 'react';
import type { Haircut } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import LoginScreen from './components/LoginScreen';
import MainScreen from './components/MainScreen';
import HaircutModal from './components/HaircutModal';

const sampleHaircut: Haircut[] = [
    {
        id: 'sample-1',
        date: new Date().toISOString().split('T')[0],
        style: 'High Fade',
        notes: 'First time trying this style. The barber did a great job blending the sides.',
        barbershop: 'The Gentry Barbershop',
        barber: 'John Doe',
        rating: 9.5,
        cost: { amount: 50, currency: 'CAD'},
        location: { address: '123 Sample St, Toronto, ON', lat: 43.6532, lng: -79.3832 },
        images: ['https://images.unsplash.com/photo-1622288093952-a29d2483f129?q=80&w=1974&auto=format&fit=crop']
    }
];

function App() {
  const [user, setUser] = useLocalStorage<string | null>('haircut_tracker_user', null);
  const [haircuts, setHaircuts] = useLocalStorage<Haircut[]>('haircut_tracker_data', sampleHaircut);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHaircut, setEditingHaircut] = useState<Haircut | null>(null);

  const handleLogin = () => {
    setUser('ManeTracker User');
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleOpenAddModal = () => {
    setEditingHaircut(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (haircut: Haircut) => {
    setEditingHaircut(haircut);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingHaircut(null);
  };

  const handleSaveHaircut = (haircutData: Omit<Haircut, 'id'>) => {
    if (editingHaircut) {
      // Update existing
      setHaircuts(haircuts.map(h => h.id === editingHaircut.id ? { ...editingHaircut, ...haircutData } : h));
    } else {
      // Add new
      setHaircuts([{ id: Date.now().toString(), ...haircutData }, ...haircuts]);
    }
    handleCloseModal();
  };

  const handleDeleteHaircut = (id: string) => {
    if (window.confirm('Are you sure you want to delete this haircut log?')) {
        setHaircuts(haircuts.filter(h => h.id !== id));
    }
  };

  const sortedHaircuts = useMemo(() => {
    return [...haircuts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [haircuts]);

  return (
    <div className="w-full max-w-sm mx-auto bg-black rounded-[44px] p-2 sm:p-4 shadow-2xl h-[90vh] max-h-[850px] flex flex-col font-sans">
      <div className="bg-black rounded-[36px] overflow-hidden h-full w-full flex flex-col relative text-white">
        {!user ? (
          <LoginScreen onLogin={handleLogin} />
        ) : (
          <>
            <MainScreen 
              username={user}
              haircuts={sortedHaircuts}
              onAddHaircut={handleOpenAddModal}
              onEditHaircut={handleOpenEditModal}
              onDeleteHaircut={handleDeleteHaircut}
              onLogout={handleLogout}
            />
            <HaircutModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onSave={handleSaveHaircut}
              haircutToEdit={editingHaircut}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;