import { Trailer, TireCondition, TireState, TIRE_POSITIONS_SETUP } from './types';

export const APP_TITLE = "Firemní Portál Mapler s.r.o."; // Aktualizovaný název aplikace
export const TRAILER_SECTION_TITLE = "Evidence Technického Stavu Návěsů";
export const TIRE_INSPECTION_FORM_TITLE = "Zápis Kontroly Pneumatik – Návěs";
export const REFUELING_FORM_TITLE = "Záznam o Tankování";


export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

export const INITIAL_TRAILER_DATA = (id: string): Trailer => ({
  id,
  licensePlate: '',
  nickname: '',
  driverName: '',
  isRefrigerated: false,
  fuelLevelPercent: null,
  tires: TIRE_POSITIONS_SETUP.map(pos => ({
    id: pos.id,
    name: pos.name,
    condition: 'Dobrý stav' as TireCondition,
    pressure: null,
    depth: null,
    // bellowsStatus and shockAbsorberStatus removed
  })),
  damageDetails: '',
  hookCount: 0,
  europalletCount: 0,
  loadBarCount: 0,
  lastInspectionDate: new Date().toISOString().split('T')[0],
  photoRightSide: null,
  photoRear: null,
  photoLeftSide: null,
  tireDamagePhoto1: null,
  tireDamagePhoto2: null,
  lastTireInspectionData: null, // puncturePreventionApplied will be removed from TrailerTireInspectionData type
  refrigerationUnitRefuelings: [],
});

export const LOCAL_STORAGE_KEY = 'trailersApp_trailers';
export const LOCAL_STORAGE_KEY_TRACTOR_REFUELING = 'trailersApp_tractorRefuelingRecords';