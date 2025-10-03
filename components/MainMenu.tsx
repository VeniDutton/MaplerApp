
import React from 'react';
import { TruckIcon, WrenchScrewdriverIcon, FuelPumpIcon, HistoryIcon } from './icons';
import { TRAILER_SECTION_TITLE, REFUELING_FORM_TITLE } from '../constants';

export type AppView = 'mainMenu' | string; 

interface MainMenuProps {
  onNavigate: (view: AppView) => void;
  isAdmin: boolean;
}

const MainMenu: React.FC<MainMenuProps> = ({ onNavigate, isAdmin }) => {
  return (
    <div className="container mx-auto p-4 md:p-8 flex flex-col items-center">
      <h2 className="text-3xl font-semibold text-primary-dark mb-10 text-center">Hlavní Menu</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
        <button
          onClick={() => onNavigate('trailerList')}
          className="bg-white p-6 md:p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1.5 flex flex-col items-center text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
          aria-label={`Otevřít ${TRAILER_SECTION_TITLE}`}
        >
          <TruckIcon className="w-16 h-16 text-primary mb-4" />
          <span className="text-xl font-semibold text-gray-800">{TRAILER_SECTION_TITLE}</span>
          <p className="text-sm text-gray-500 mt-2 px-2">
            Správa a záznamy o technickém stavu, poškození a vybavení vašich návěsů.
          </p>
        </button>

        <button
          onClick={() => onNavigate('refuelingForm')}
          className="bg-white p-6 md:p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1.5 flex flex-col items-center text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
          aria-label={`Otevřít ${REFUELING_FORM_TITLE}`}
        >
          <FuelPumpIcon className="w-16 h-16 text-primary mb-4" />
          <span className="text-xl font-semibold text-gray-800">{REFUELING_FORM_TITLE}</span>
          <p className="text-sm text-gray-500 mt-2 px-2">
            Zaznamenejte tankování pro tahače a chladírenské agregáty návěsů.
          </p>
        </button>

        {isAdmin ? (
          <button
            onClick={() => onNavigate('refuelingHistory')}
            className="bg-white p-6 md:p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1.5 flex flex-col items-center text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            aria-label="Zobrazit historii tankování"
          >
            <HistoryIcon className="w-16 h-16 text-primary mb-4" />
            <span className="text-xl font-semibold text-gray-800">Historie Tankování</span>
            <p className="text-sm text-gray-500 mt-2 px-2">
              (Pouze pro správce) Zobrazení všech záznamů o tankování.
            </p>
          </button>
        ) : (
          <div
            className="bg-gray-100 p-6 md:p-8 rounded-xl shadow-lg flex flex-col items-center text-center cursor-not-allowed opacity-60"
          >
            <WrenchScrewdriverIcon className="w-16 h-16 text-gray-400 mb-4" />
            <span className="text-xl font-semibold text-gray-500">Další Funkce</span>
            <p className="text-sm text-gray-400 mt-2 px-2">
              Již brzy! Připravujeme nové moduly a nástroje pro rozšíření portálu.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainMenu;
