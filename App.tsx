
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Trailer, TractorRefuelingRecord, RefrigerationUnitRefuelingEntry, PhotoMetadata } from './types';
import { generateId, LOCAL_STORAGE_KEY, TRAILER_SECTION_TITLE, TIRE_INSPECTION_FORM_TITLE, REFUELING_FORM_TITLE, LOCAL_STORAGE_KEY_TRACTOR_REFUELING } from './constants';
import Header from './components/Header';
import TrailerCard from './components/TrailerCard';
import TrailerModal from './components/TrailerModal';
import MainMenu, { AppView as MainMenuAppView } from './components/MainMenu';
import TireInspectionForm from './components/TireInspectionForm';
import RefuelingForm from './components/RefuelingForm'; // Import the new form
import RefuelingHistory from './components/RefuelingHistory';
import { PlusIcon, BackArrowIcon, TruckIcon } from './components/icons';

export type AppView = MainMenuAppView | 'trailerList' | 'tireInspection' | 'refuelingForm' | 'refuelingHistory';


const App: React.FC = () => {
  const [trailers, setTrailers] = useState<Trailer[]>([]);
  const [tractorRefuelingRecords, setTractorRefuelingRecords] = useState<TractorRefuelingRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trailerToEdit, setTrailerToEdit] = useState<Trailer | null>(null);
  const [selectedTrailerForInspection, setSelectedTrailerForInspection] = useState<Trailer | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentView, setCurrentView] = useState<AppView>('mainMenu');
  const [isAdmin, setIsAdmin] = useState(false);
  const quickNavSelectRef = useRef<HTMLSelectElement>(null);


  // Load trailers from localStorage
  useEffect(() => {
    const storedTrailers = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedTrailers) {
      try {
        const parsedTrailers = JSON.parse(storedTrailers);
        if (Array.isArray(parsedTrailers)) {
          setTrailers(parsedTrailers.map(t => ({ // Ensure new fields are present
            ...t,
            refrigerationUnitRefuelings: t.refrigerationUnitRefuelings || [],
          })));
        } else {
          setTrailers([]);
        }
      } catch (error) {
        console.error("Chyba při parsování návěsů z localStorage:", error);
        setTrailers([]);
      }
    }
  }, []);

  // Save trailers to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(trailers));
  }, [trailers]);

  // Load tractor refueling records from localStorage
  useEffect(() => {
    const storedTractorRefueling = localStorage.getItem(LOCAL_STORAGE_KEY_TRACTOR_REFUELING);
    if (storedTractorRefueling) {
      try {
        const parsedRecords = JSON.parse(storedTractorRefueling);
        if (Array.isArray(parsedRecords)) {
          setTractorRefuelingRecords(parsedRecords);
        } else {
          setTractorRefuelingRecords([]);
        }
      } catch (error) {
        console.error("Chyba při parsování záznamů o tankování tahačů z localStorage:", error);
        setTractorRefuelingRecords([]);
      }
    }
  }, []);

  // Save tractor refueling records to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_TRACTOR_REFUELING, JSON.stringify(tractorRefuelingRecords));
  }, [tractorRefuelingRecords]);


  const handleNavigate = (view: AppView) => {
    if (view === 'refuelingHistory' && !isAdmin) {
        console.warn('Access denied: refuelingHistory is an admin-only view.');
        return;
    }
    setCurrentView(view);
    setSearchTerm(''); 
    setSelectedTrailerForInspection(null);
  };

  const handleOpenModalForNew = () => {
    setTrailerToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenModalForEdit = (trailer: Trailer) => {
    setTrailerToEdit(trailer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTrailerToEdit(null);
  };

  const handleSaveTrailer = useCallback((trailerData: Trailer) => {
    setTrailers(prevTrailers => {
      const existingTrailerIndex = prevTrailers.findIndex(t => t.id === trailerData.id);
      if (existingTrailerIndex > -1) {
        const updatedTrailers = [...prevTrailers];
        updatedTrailers[existingTrailerIndex] = trailerData;
        return updatedTrailers;
      } else {
        const newId = trailerData.id || generateId();
        return [{ ...trailerData, id: newId, refrigerationUnitRefuelings: trailerData.refrigerationUnitRefuelings || [] }, ...prevTrailers];
      }
    });
    if (isModalOpen) handleCloseModal();
  }, [isModalOpen]);

  const handleOpenTireInspectionForm = (trailer: Trailer) => {
    setSelectedTrailerForInspection(trailer);
    setCurrentView('tireInspection');
  };

  const handleSaveTireInspection = (updatedTrailer: Trailer) => {
    handleSaveTrailer(updatedTrailer);
    setCurrentView('trailerList');
    setSelectedTrailerForInspection(null);
  };

  const handleCancelTireInspection = () => {
    setCurrentView('trailerList');
    setSelectedTrailerForInspection(null);
  };

  const handleSaveTractorRefueling = (record: Omit<TractorRefuelingRecord, 'id'>) => {
    const newRecord: TractorRefuelingRecord = { ...record, id: generateId() };
    setTractorRefuelingRecords(prev => [newRecord, ...prev]);
    setCurrentView('mainMenu'); // Or a success message / different view
  };

  const handleSaveTrailerRefrigerationUnitRefueling = (trailerId: string, entry: Omit<RefrigerationUnitRefuelingEntry, 'id'>) => {
    const newEntry: RefrigerationUnitRefuelingEntry = { ...entry, id: generateId() };
    setTrailers(prevTrailers =>
      prevTrailers.map(trailer =>
        trailer.id === trailerId
          ? { ...trailer, refrigerationUnitRefuelings: [newEntry, ...(trailer.refrigerationUnitRefuelings || [])] }
          : trailer
      )
    );
    setCurrentView('mainMenu'); // Or back to trailer list, or success message
  };

  const handleQuickNavChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const trailerId = event.target.value;
    if (trailerId) {
      setSearchTerm(''); // Clear search term to ensure the selected trailer is visible
      // Timeout to allow the DOM to update after clearing search term if needed
      setTimeout(() => {
        const element = document.getElementById(`trailer-card-${trailerId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 0);
      if (quickNavSelectRef.current) {
        quickNavSelectRef.current.value = ""; // Reset select to placeholder
      }
    }
  };


  const filteredTrailers = trailers.filter(trailer =>
    trailer.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trailer.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trailer.driverName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-neutral">
      <Header />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        {currentView === 'mainMenu' && (
          <MainMenu onNavigate={handleNavigate} isAdmin={isAdmin} />
        )}

        {currentView === 'trailerList' && (
          <>
            <div className="mb-6 md:mb-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <button
                  onClick={() => handleNavigate('mainMenu')}
                  className="flex items-center px-4 py-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors duration-150 ease-in-out self-start md:self-center rounded-md border border-primary hover:bg-primary-light hover:text-white"
                  aria-label="Zpět na hlavní menu"
                >
                  <BackArrowIcon className="w-5 h-5 mr-2" />
                  Hlavní Menu
                </button>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto md:ml-auto">
                  <input
                    type="text"
                    placeholder="Hledat SPZ, název, řidiče..."
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary w-full sm:w-auto"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label="Hledat návěs"
                  />
                  <button
                    onClick={handleOpenModalForNew}
                    className="flex items-center justify-center w-full sm:w-auto px-6 py-2.5 bg-primary text-white rounded-md shadow-md hover:bg-primary-dark transition-colors duration-150 ease-in-out font-medium text-sm"
                  >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Přidat Záznam
                  </button>
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-3 text-center md:text-left">{TRAILER_SECTION_TITLE}</h2>
              
              {trailers.length > 0 && (
                <div className="mb-6">
                  <label htmlFor="quickNavTrailer" className="sr-only">Rychlý přechod na návěs</label>
                  <select
                    id="quickNavTrailer"
                    ref={quickNavSelectRef}
                    onChange={handleQuickNavChange}
                    className="mt-1 block w-full md:w-1/2 lg:w-1/3 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-gray-900"
                    defaultValue=""
                  >
                    <option value="" disabled>-- Přejít na návěs --</option>
                    {trailers.map(trailer => (
                      <option key={trailer.id} value={trailer.id}>
                        {trailer.nickname || `Návěs ${trailer.licensePlate.substring(0,3)}`} ({trailer.licensePlate})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {filteredTrailers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
                {filteredTrailers.map(trailer => (
                  <TrailerCard 
                    key={trailer.id} 
                    trailer={trailer} 
                    onEdit={handleOpenModalForEdit} 
                    onOpenTireInspection={handleOpenTireInspectionForm} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <TruckIcon className="mx-auto mb-6 text-gray-300 w-24 h-24" />
                <p className="text-xl text-gray-600">
                  {searchTerm ? 'Nebyly nalezeny žádné záznamy odpovídající hledání.' : 'Zatím nebyly přidány žádné záznamy o stavu návěsů.'}
                </p>
                {!searchTerm && (
                    <p className="text-gray-500 mt-2">Začněte kliknutím na tlačítko "Přidat Záznam".</p>
                )}
              </div>
            )}
          </>
        )}

        {currentView === 'tireInspection' && selectedTrailerForInspection && (
          <TireInspectionForm
            trailer={selectedTrailerForInspection}
            onSave={handleSaveTireInspection}
            onCancel={handleCancelTireInspection}
          />
        )}

        {currentView === 'refuelingForm' && (
          <RefuelingForm
            trailers={trailers.filter(t => t.isRefrigerated)} // Only pass refrigerated trailers
            onSaveTractorRefueling={handleSaveTractorRefueling}
            onSaveTrailerRefrigerationUnitRefueling={handleSaveTrailerRefrigerationUnitRefueling}
            onCancel={() => handleNavigate('mainMenu')}
          />
        )}

        {currentView === 'refuelingHistory' && isAdmin && (
          <RefuelingHistory
            tractorRefuelingRecords={tractorRefuelingRecords}
            trailers={trailers}
            onCancel={() => handleNavigate('mainMenu')}
          />
        )}

      </main>

      {isModalOpen && ( 
        <TrailerModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveTrailer}
          trailerToEdit={trailerToEdit}
        />
      )}
       <footer className="text-center py-6 mt-10 text-sm text-gray-500 border-t border-gray-200">
        <div className="mb-4">
            <label htmlFor="admin-toggle" className="mr-2 cursor-pointer">Režim Správce:</label>
            <input
              id="admin-toggle"
              type="checkbox"
              checked={isAdmin}
              onChange={() => setIsAdmin(prev => !prev)}
              className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
            />
        </div>
        {(process.env.COMPANY_NAME || 'Mapler s.r.o.')} &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default App;
