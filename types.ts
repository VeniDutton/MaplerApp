export type TireCondition = 'Nová' | 'Dobrý stav' | 'Opotřebená' | 'Poškozená' | 'Nutná výměna';

// PuncturePreventionStatus, PUNCTURE_PREVENTION_OPTIONS, CheckStatus, CHECK_STATUS_OPTIONS, CHECK_STATUS_SELECT_OPTIONS are removed as they are no longer used.

export interface TireState {
  id: string;
  name: string; // e.g., "Náprava 1 Levá"
  condition: TireCondition; // Existing general condition
  pressure?: number | null; // Measured pressure in Bar
  depth?: number | null;    // Measured depth in mm
  // bellowsStatus and shockAbsorberStatus removed
}

export interface PhotoMetadata {
  dataUrl: string;
  capturedAt: string; // ISO string for date
  gpsCoordinates: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  } | null;
}

export interface TrailerTireInspectionData {
  inspectionDate: string; // ISO date
  odometerKm: number | null;
  purpose: string;
  mechanicName: string;
  // puncturePreventionApplied removed
  recommendedPressure: number | null; // e.g., 9.5 Bar
}

export interface RefrigerationUnitRefuelingEntry {
  id: string;
  refuelingDate: string; // ISO date
  dieselLiters: number | null;
  fridgeMth: number | null; // Moto-hours
  receiptPhoto: PhotoMetadata | null;
}

export interface Trailer {
  id: string;
  licensePlate: string;
  nickname: string;
  driverName: string;
  isRefrigerated: boolean;
  fuelLevelPercent: number | null; // This is for the fridge unit's own tank if separate, or general indication.
  tires: TireState[];
  damageDetails: string;
  hookCount: number;
  europalletCount: number;
  loadBarCount: number;
  lastInspectionDate: string; // General last check/hookup date
  photoRightSide: PhotoMetadata | null;
  photoRear: PhotoMetadata | null;
  photoLeftSide: PhotoMetadata | null;
  tireDamagePhoto1: PhotoMetadata | null;
  tireDamagePhoto2: PhotoMetadata | null;
  lastTireInspectionData?: TrailerTireInspectionData | null; // Specific detailed tire inspection data
  refrigerationUnitRefuelings: RefrigerationUnitRefuelingEntry[]; // History of refueling for the fridge unit
}

export interface TractorRefuelingRecord {
  id: string;
  tractorLicensePlate: string;
  refuelingDate: string; // ISO date
  dieselLiters: number | null;
  adblueLiters: number | null;
  odometerKm: number | null;
  receiptPhoto: PhotoMetadata | null;
}


export const TIRE_CONDITIONS_OPTIONS: TireCondition[] = [
  'Nová',
  'Dobrý stav',
  'Opotřebená',
  'Poškozená',
  'Nutná výměna',
];

export const TIRE_POSITIONS_SETUP: { id: string; name: string }[] = [
    { id: 'tire1_axle1_left', name: 'Náprava 1 Levá' },
    { id: 'tire2_axle1_right', name: 'Náprava 1 Pravá' },
    { id: 'tire3_axle2_left', name: 'Náprava 2 Levá' },
    { id: 'tire4_axle2_right', name: 'Náprava 2 Pravá' },
    { id: 'tire5_axle3_left', name: 'Náprava 3 Levá' },
    { id: 'tire6_axle3_right', name: 'Náprava 3 Pravá' },
];

export const DRIVER_NAMES_OPTIONS: string[] = [
  // Sem můžete přidat jména řidičů, např. 'Jan Novák', 'Petr Svoboda'
];