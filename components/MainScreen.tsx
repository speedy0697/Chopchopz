import React, { useState, useMemo } from 'react';
import type { Haircut } from '../types';

interface MainScreenProps {
  username: string;
  haircuts: Haircut[];
  onAddHaircut: () => void;
  onEditHaircut: (haircut: Haircut) => void;
  onDeleteHaircut: (id: string) => void;
  onLogout: () => void;
}

// --- ICONS ---
const PlusIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>);
const PencilIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>);
const TrashIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>);
const ChevronLeftIcon: React.FC<{className?: string}> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>);
const ChevronRightIcon: React.FC<{className?: string}> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>);
const FilterIcon: React.FC<{className?: string}> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>);
const StarIcon: React.FC<{className?: string}> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>);
const MapPinIcon: React.FC<{className?: string}> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>);
const LogoutIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>);

const calculateDaysSinceLastHaircut = (haircuts: Haircut[]): number | null => {
  if (haircuts.length === 0) return null;
  const lastHaircutDate = new Date(haircuts[0].date + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffTime = Math.abs(today.getTime() - lastHaircutDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const formatDate = (dateString: string) => new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

const HaircutCard: React.FC<{haircut: Haircut, onEdit: () => void, onDelete: () => void}> = ({ haircut, onEdit, onDelete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const hasImages = haircut.images && haircut.images.length > 0;

    const goToPrevious = (e: React.MouseEvent) => { e.stopPropagation(); setCurrentIndex(prev => prev === 0 ? haircut.images!.length - 1 : prev - 1); };
    const goToNext = (e: React.MouseEvent) => { e.stopPropagation(); setCurrentIndex(prev => prev === haircut.images!.length - 1 ? 0 : prev + 1); };

    if (hasImages) {
        return (
            <div className="rounded-2xl shadow-lg overflow-hidden bg-zinc-900 text-white relative group">
                <div className="aspect-square relative">
                    <img src={haircut.images![currentIndex]} alt={`Haircut on ${formatDate(haircut.date)}`} className="w-full h-full object-cover" />
                    {haircut.images!.length > 1 && <>
                        <button onClick={goToPrevious} className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"><ChevronLeftIcon className="w-6 h-6" /></button>
                        <button onClick={goToNext} className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"><ChevronRightIcon className="w-6 h-6" /></button>
                    </>}
                    <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-end">
                        <h3 className="font-bold text-white text-xl tracking-tight">{haircut.style}</h3>
                        <p className="text-sm text-zinc-300">{formatDate(haircut.date)}</p>
                    </div>
                     {haircut.images!.length > 1 && <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">{haircut.images!.map((_, index) => <button key={index} onClick={(e) => {e.stopPropagation(); setCurrentIndex(index)}} className={`w-2 h-2 rounded-full ${currentIndex === index ? 'bg-white' : 'bg-white/50'}`}></button>)}</div>}
                </div>
                <div className="p-4 text-sm space-y-2">
                    {haircut.rating && <div className="flex items-center gap-2"><StarIcon className="w-5 h-5 text-yellow-400" /><span className="font-semibold">{haircut.rating.toFixed(1)} / 10</span></div>}
                    {(haircut.barbershop || haircut.barber) && <p className="font-semibold truncate">{haircut.barbershop}{haircut.barber && ` - ${haircut.barber}`}</p>}
                    {haircut.location && <div className="flex items-center gap-2 text-zinc-400 mt-1"><MapPinIcon className="w-4 h-4 shrink-0" /><p className="truncate">{haircut.location.address}</p></div>}
                    {haircut.notes && <p className="text-zinc-300 italic">"{haircut.notes}"</p>}
                    {haircut.cost?.amount && <p className="text-right font-mono text-zinc-300 mt-2">{new Intl.NumberFormat('en-US', { style: 'currency', currency: haircut.cost.currency }).format(haircut.cost.amount)}</p>}
                </div>
                <div className="absolute top-2 right-2 z-10 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={onEdit} className="p-2 text-white bg-black/50 hover:bg-black/70 rounded-full"><PencilIcon className="w-5 h-5" /></button>
                    <button onClick={onDelete} className="p-2 text-white bg-black/50 hover:bg-black/70 rounded-full"><TrashIcon className="w-5 h-5" /></button>
                </div>
            </div>
        );
    }
    
    // Placeholder card for when there are no images
    return (
        <div className="bg-zinc-900 rounded-2xl p-4 shadow-lg relative group">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h3 className="font-bold text-white text-xl tracking-tight">{haircut.style}</h3>
                    <p className="text-sm text-zinc-400">{formatDate(haircut.date)}</p>
                </div>
                {haircut.rating && <div className="flex items-center gap-2 text-lg"><StarIcon className="w-5 h-5 text-yellow-400" /><span className="font-semibold">{haircut.rating.toFixed(1)}</span></div>}
            </div>
            
            <div className="space-y-2 text-sm">
                {(haircut.barbershop || haircut.barber) && <p className="font-semibold text-zinc-200 truncate">{haircut.barbershop}{haircut.barber && ` - ${haircut.barber}`}</p>}
                {haircut.location && <div className="flex items-center gap-2 text-zinc-400"><MapPinIcon className="w-4 h-4 shrink-0" /><p className="truncate">{haircut.location.address}</p></div>}
                {haircut.notes && <p className="text-zinc-300 italic">"{haircut.notes}"</p>}
                {haircut.cost?.amount && <p className="text-right font-mono text-zinc-300 mt-2">{new Intl.NumberFormat('en-US', { style: 'currency', currency: haircut.cost.currency }).format(haircut.cost.amount)}</p>}
            </div>
             <div className="absolute top-2 right-2 z-10 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={onEdit} className="p-2 text-white bg-black/50 hover:bg-black/70 rounded-full"><PencilIcon className="w-5 h-5" /></button>
                <button onClick={onDelete} className="p-2 text-white bg-black/50 hover:bg-black/70 rounded-full"><TrashIcon className="w-5 h-5" /></button>
            </div>
        </div>
    );
};

const FilterPanel: React.FC<{onApply: (filters: any) => void, onClear: () => void}> = ({ onApply, onClear }) => {
    const [keyword, setKeyword] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [minRating, setMinRating] = useState('');
    const [maxRating, setMaxRating] = useState('');
    const [minCost, setMinCost] = useState('');
    const [maxCost, setMaxCost] = useState('');

    const handleApply = () => onApply({ keyword, dateRange: { start: startDate, end: endDate }, ratingRange: { min: minRating, max: maxRating }, costRange: { min: minCost, max: maxCost } });
    const handleClear = () => {
        setKeyword(''); setStartDate(''); setEndDate(''); setMinRating(''); setMaxRating(''); setMinCost(''); setMaxCost('');
        onClear();
    };

    return (
        <div className="p-4 bg-zinc-900 border-b border-zinc-700 space-y-4">
             <input type="text" placeholder="Search Style, Barber, Shop..." value={keyword} onChange={e => setKeyword(e.target.value)} className="w-full form-input" />
             <div className="grid grid-cols-2 gap-2">
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full form-input" title="Start Date" />
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full form-input" title="End Date" />
             </div>
             <div className="grid grid-cols-2 gap-2">
                <input type="number" placeholder="Min Rating" value={minRating} onChange={e => setMinRating(e.target.value)} className="w-full form-input" />
                <input type="number" placeholder="Max Rating" value={maxRating} onChange={e => setMaxRating(e.target.value)} className="w-full form-input" />
             </div>
             <div className="grid grid-cols-2 gap-2">
                <input type="number" placeholder="Min Cost" value={minCost} onChange={e => setMinCost(e.target.value)} className="w-full form-input" />
                <input type="number" placeholder="Max Cost" value={maxCost} onChange={e => setMaxCost(e.target.value)} className="w-full form-input" />
             </div>
             <div className="flex gap-2">
                <button onClick={handleApply} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-2 px-4 rounded-lg">Apply</button>
                <button onClick={handleClear} className="w-full bg-zinc-700 font-semibold py-2 px-4 rounded-lg">Clear</button>
             </div>
             <style>{`.form-input { padding: 8px 12px; background-color: #27272a; border: 1px solid #3f3f46; border-radius: 8px; color: white; }`}</style>
        </div>
    );
};


const MainScreen: React.FC<MainScreenProps> = ({ haircuts, onAddHaircut, onEditHaircut, onDeleteHaircut, onLogout }) => {
  const daysSince = calculateDaysSinceLastHaircut(haircuts);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>(null);

  const filteredHaircuts = useMemo(() => {
      if (!activeFilters) return haircuts;
      return haircuts.filter(h => {
          const { keyword, dateRange, ratingRange, costRange } = activeFilters;
          if (keyword) {
              const searchTerm = keyword.toLowerCase();
              if (!`${h.style} ${h.barber} ${h.barbershop} ${h.notes}`.toLowerCase().includes(searchTerm)) return false;
          }
          if (dateRange.start && h.date < dateRange.start) return false;
          if (dateRange.end && h.date > dateRange.end) return false;
          if (ratingRange.min && (h.rating ?? -1) < parseFloat(ratingRange.min)) return false;
          if (ratingRange.max && (h.rating ?? 11) > parseFloat(ratingRange.max)) return false;
          if (costRange.min && (h.cost?.amount ?? -1) < parseFloat(costRange.min)) return false;
          if (costRange.max && (h.cost?.amount ?? Infinity) > parseFloat(costRange.max)) return false;
          return true;
      });
  }, [haircuts, activeFilters]);

  return (
    <div className="flex flex-col h-full bg-black">
        <header className="p-4 flex items-center justify-between bg-black/80 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-20">
            <h1 className="text-xl font-bold text-white tracking-tight">ManeTracker</h1>
            <div className="flex items-center gap-2">
                <button onClick={() => setIsFilterOpen(prev => !prev)} className="p-2 rounded-full hover:bg-zinc-800">
                    <FilterIcon className="w-5 h-5 text-zinc-300"/>
                </button>
                 <button onClick={onAddHaircut} className="p-2 rounded-full hover:bg-zinc-800">
                    <PlusIcon className="w-6 h-6 text-zinc-300"/>
                </button>
                <button onClick={onLogout} className="p-2 rounded-full hover:bg-zinc-800">
                    <LogoutIcon className="w-5 h-5 text-zinc-300"/>
                </button>
            </div>
        </header>
        
        {isFilterOpen && <FilterPanel onApply={(f) => { setActiveFilters(f); setIsFilterOpen(false); }} onClear={() => { setActiveFilters(null); setIsFilterOpen(false); }} />}

        <main className="flex-1 overflow-y-auto p-4">
            {!isFilterOpen && (
                 <div className="bg-zinc-900 p-6 rounded-2xl mb-6 text-center shadow-lg">
                    {daysSince !== null ? (<><p className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">{daysSince}</p><p className="text-lg font-light tracking-wide text-zinc-400">{daysSince === 1 ? 'Day' : 'Days'} Since Last Haircut</p></>) 
                    : (<><p className="text-2xl font-bold">Welcome!</p><p className="mt-1 text-zinc-400">Log your first haircut to get started.</p></>)}
                </div>
            )}
            <div className="space-y-4">
                {filteredHaircuts.length > 0 ? (
                    filteredHaircuts.map(haircut => (
                        <HaircutCard key={haircut.id} haircut={haircut} onEdit={() => onEditHaircut(haircut)} onDelete={() => onDeleteHaircut(haircut.id)} />
                    ))
                ) : (
                    <div className="text-center py-10"><p className="text-zinc-400">No haircuts match your filters.</p></div>
                )}
            </div>
        </main>
    </div>
  );
};

export default MainScreen;