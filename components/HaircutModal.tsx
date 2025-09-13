import React, { useState, useEffect, useRef } from 'react';
import type { Haircut } from '../types';

interface HaircutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (haircut: Omit<Haircut, 'id'>) => void;
  haircutToEdit: Haircut | null;
}

const MAX_IMAGES = 5;
const CURRENCIES = ['CAD', 'USD', 'EUR', 'GBP', 'JPY'];

// --- ICONS ---
const BackIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>);
const CameraIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.776 48.776 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" /></svg>);
const SpinnerIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>);

const HaircutModal: React.FC<HaircutModalProps> = ({ isOpen, onClose, onSave, haircutToEdit }) => {
  const [date, setDate] = useState('');
  const [style, setStyle] = useState('');
  const [notes, setNotes] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [location, setLocation] = useState<Haircut['location'] | undefined>(undefined);
  const [rating, setRating] = useState<string>('');
  const [barbershop, setBarbershop] = useState('');
  const [barber, setBarber] = useState('');
  const [costAmount, setCostAmount] = useState('');
  const [costCurrency, setCostCurrency] = useState('CAD');

  // Location search state
  const [locationQuery, setLocationQuery] = useState('');
  const [locationResults, setLocationResults] = useState<{ address: string; lat: number; lng: number }[]>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const searchTimeoutRef = useRef<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
    setStyle(''); setNotes(''); setImages([]); setLocation(undefined); setRating('');
    setBarbershop(''); setBarber(''); setCostAmount(''); setCostCurrency('CAD');
    setLocationQuery(''); setLocationResults([]); setIsSearchingLocation(false);
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (haircutToEdit) {
        setDate(haircutToEdit.date);
        setStyle(haircutToEdit.style);
        setNotes(haircutToEdit.notes || '');
        setImages(haircutToEdit.images || []);
        setLocation(haircutToEdit.location);
        setLocationQuery(haircutToEdit.location?.address || '');
        setRating(haircutToEdit.rating?.toString() || '');
        setBarbershop(haircutToEdit.barbershop || '');
        setBarber(haircutToEdit.barber || '');
        setCostAmount(haircutToEdit.cost?.amount.toString() || '');
        setCostCurrency(haircutToEdit.cost?.currency || 'CAD');
      } else {
        resetForm();
      }
    } else {
        document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [haircutToEdit, isOpen]);
  
  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') { setRating(''); return; }
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 10) {
        if (/^\d{1,2}(\.\d{0,1})?$/.test(value) || /^\d(\.)?$/.test(value) || value.length === 1 && !isNaN(parseInt(value))) {
            setRating(value);
        }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const remainingSlots = MAX_IMAGES - images.length;
      if (files.length > remainingSlots) alert(`You can only upload a maximum of ${MAX_IMAGES} images.`);
      
      files.slice(0, remainingSlots).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setImages(prevImages => [...prevImages, reader.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };
  
  const handleRemoveImage = (indexToRemove: number) => setImages(prev => prev.filter((_, index) => index !== indexToRemove));

  const handleLocationQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setLocationQuery(query);
    if (location && query !== location.address) setLocation(undefined);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (!query.trim()) { setLocationResults([]); return; }

    setIsSearchingLocation(true);
    searchTimeoutRef.current = window.setTimeout(() => {
      // Simulate API call to Google Maps Places
      const mockResults = [
        { address: `${query} at 123 Main St, Toronto, ON`, lat: 43.651070, lng: -79.347015 },
        { address: `The Original ${query}, 456 King St W, Toronto, ON`, lat: 43.6441, lng: -79.3982 },
        { address: `Global ${query} HQ, 789 Bay St, Toronto, ON`, lat: 43.6599, lng: -79.3855 }
      ].filter(r => r.address.toLowerCase().includes(query.toLowerCase()));
      setLocationResults(mockResults);
      setIsSearchingLocation(false);
    }, 800);
  };
  
  const handleSelectLocationResult = (result: Haircut['location']) => {
      setLocation(result);
      setLocationQuery(result!.address);
      setLocationResults([]);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !style) {
        alert("Please fill in the Style Name and Date.");
        return;
    };
    
    const finalRating = rating ? parseFloat(rating) : undefined;
    const finalCostAmount = costAmount ? parseFloat(costAmount) : undefined;

    onSave({ 
        date, style, notes, images, location, rating: finalRating, barbershop, barber,
        cost: finalCostAmount !== undefined ? { amount: finalCostAmount, currency: costCurrency } : undefined,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col font-sans text-white" aria-modal="true" role="dialog">
      <header className="flex items-center p-4 border-b border-zinc-800">
        <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-800">
            <BackIcon className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-center flex-grow pr-8">{haircutToEdit ? 'Edit Haircut' : 'Add New Haircut'}</h2>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <form id="haircut-form" onSubmit={handleSubmit} className="space-y-5">
          {/* Image Upload */}
          <div className="space-y-2">
             <button type="button" onClick={() => fileInputRef.current?.click()} className="w-4/5 mx-auto aspect-square border-2 border-dashed border-zinc-600 rounded-2xl flex flex-col items-center justify-center text-zinc-400 hover:bg-zinc-800 hover:border-zinc-500 transition-colors">
                <CameraIcon className="w-10 h-10 mb-2"/>
                <span className="font-semibold">+ Add Photo</span>
                <span className="text-xs">({images.length}/{MAX_IMAGES})</span>
            </button>
            <input type="file" multiple accept="image/*" onChange={handleImageChange} ref={fileInputRef} className="hidden"/>
            {images.length > 0 && (
                <div className="grid grid-cols-5 gap-2">
                    {images.map((image, index) => (
                        <div key={index} className="relative aspect-square">
                            <img src={image} alt={`preview ${index}`} className="w-full h-full object-cover rounded-lg" />
                            <button type="button" onClick={() => handleRemoveImage(index)} className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">&times;</button>
                        </div>
                    ))}
                </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="style" className="form-label">Style Name</label>
              <input type="text" id="style" value={style} onChange={(e) => setStyle(e.target.value)} required placeholder="e.g., High Fade" className="form-input"/>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="barber" className="form-label">Barber's Name</label>
                  <input type="text" id="barber" value={barber} onChange={(e) => setBarber(e.target.value)} className="form-input" />
                </div>
                <div>
                    <label htmlFor="date" className="form-label">Date</label>
                    <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required className="form-input"/>
                </div>
            </div>
             <div>
              <label htmlFor="notes" className="form-label">Notes & Details</label>
              <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Any specific details..." className="form-input"></textarea>
            </div>
             <div>
                <label htmlFor="barbershop" className="form-label">Barbershop</label>
                <input type="text" id="barbershop" value={barbershop} onChange={(e) => setBarbershop(e.target.value)} className="form-input" />
            </div>
          </div>
          
           <div className="grid grid-cols-2 gap-4">
               <div>
                  <label htmlFor="rating" className="form-label">Rating (0-10)</label>
                  <input type="text" inputMode="decimal" id="rating" value={rating} onChange={handleRatingChange} placeholder="e.g. 8.5" className="form-input"/>
               </div>
                <div>
                    <label htmlFor="costAmount" className="form-label">Cost</label>
                    <div className="flex gap-2">
                       <input type="number" step="0.01" id="costAmount" value={costAmount} onChange={(e) => setCostAmount(e.target.value)} placeholder="45.00" className="form-input flex-grow" />
                        <select value={costCurrency} onChange={(e) => setCostCurrency(e.target.value)} className="form-input bg-zinc-700 w-1/3">
                            {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
                <div className="col-span-2">
                    <label htmlFor="location" className="form-label">Location</label>
                    <div className="relative">
                       <input type="text" id="location" placeholder="Search for a place..." value={locationQuery} onChange={handleLocationQueryChange} className="form-input w-full"/>
                        {isSearchingLocation && <SpinnerIcon className="animate-spin w-5 h-5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2" />}
                    </div>
                    {locationResults.length > 0 && (
                        <div className="mt-2 bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden">
                            {locationResults.map((result, index) => (
                                <button type="button" key={index} onClick={() => handleSelectLocationResult(result)} className="w-full text-left px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-700 transition-colors">
                                    {result.address}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
           </div>
        </form>
        <style>{`
            .form-label { display: block; font-size: 0.875rem; font-weight: 500; color: #a1a1aa; margin-bottom: 0.25rem; }
            .form-input { display: block; width: 100%; padding: 0.75rem; background-color: #27272a; border: 1px solid #3f3f46; border-radius: 0.75rem; color: #e4e4e7; outline: none; transition: border-color 0.2s; }
            .form-input:focus { border-color: #60a5fa; }
            .form-input::placeholder { color: #52525b; }
            input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1); }
        `}</style>
      </main>

      <footer className="p-4 border-t border-zinc-800">
        <button 
            type="submit" 
            form="haircut-form" 
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3.5 px-4 rounded-xl text-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-400 transition-opacity"
        >
            Save Haircut
        </button>
      </footer>
    </div>
  );
};

export default HaircutModal;