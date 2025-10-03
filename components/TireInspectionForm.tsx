
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Trailer, TireState, TrailerTireInspectionData } from '../types';
import FormField from './FormField';
import { BackArrowIcon, DocumentCheckIcon, TireIcon } from './icons';
import { TIRE_INSPECTION_FORM_TITLE } from '../constants';

interface TireInspectionFormProps {
  trailer: Trailer;
  onSave: (updatedTrailer: Trailer) => void;
  onCancel: () => void;
}

const AxleVisual: React.FC = () => {
  const fieldLabels = ["Měřený tlak", "Měřená hloubka"]; // Removed bellows and shocks
  return (
    <div className="hidden md:flex flex-col md:w-1/3 items-center">
      {/* Spacer to align with content after H5 in side columns.
          H5 (text-md, line-height 1.5rem) + H5's mb-3 (0.75rem) */}
      <div className="h-[calc(1.5rem_+_0.75rem)] flex-shrink-0"></div> 
      
      <div className="flex items-center w-full max-w-[120px] mb-4 flex-shrink-0"> {/* Axle graphic */}
        <div className="w-1/3 h-12 sm:h-16 bg-gray-700 rounded-md shadow"></div>
        <div className="flex-grow h-1.5 sm:h-2 bg-gray-500 shadow"></div>
        <div className="w-1/3 h-12 sm:h-16 bg-gray-700 rounded-md shadow"></div>
      </div>

      <div className="w-full text-center">
        {fieldLabels.map((text, index) => (
          // Each block tries to match FormField's vertical rhythm
          // We need to account for 2 FormFields per label now.
          // FormField height: label (1.25rem) + input (mt-1 + py-2 + border ~2.5rem typically) + mb-4 (1rem) = ~4.75rem per original FormField
          // Since we removed two FormFields, the placeholder spacing might need adjustment if strict alignment is desired.
          // For simplicity, keeping current structure, labels will appear above where the inputs would have been.
          <div key={index} className="mb-4 h-[calc(1.25rem_+_0.25rem_+_2rem_+_0.5rem)] flex items-center justify-center"> {/* Adjusted height to better align two inputs */}
            <div className="mt-1 text-xs text-gray-600 py-2 px-1">
               &lt;= {text} =&gt;
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


const TireInspectionForm: React.FC<TireInspectionFormProps> = ({ trailer, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Trailer>({ ...trailer });
  const [inspectionData, setInspectionData] = useState<TrailerTireInspectionData>(
    trailer.lastTireInspectionData || {
      inspectionDate: new Date().toISOString().split('T')[0],
      odometerKm: null,
      purpose: 'Standardní kontrola',
      mechanicName: '',
      // puncturePreventionApplied removed
      recommendedPressure: 9.5,
    }
  );
  const [tireStates, setTireStates] = useState<TireState[]>([...trailer.tires.map(t => ({...t}))]);

  useEffect(() => {
    setFormData({ ...trailer });
    setInspectionData(
      trailer.lastTireInspectionData || {
        inspectionDate: new Date().toISOString().split('T')[0],
        odometerKm: null,
        purpose: 'Standardní kontrola',
        mechanicName: '',
        // puncturePreventionApplied removed
        recommendedPressure: 9.5,
      }
    );
    const initializedTires = trailer.tires.map(t => ({
        ...t,
        pressure: t.pressure ?? null,
        depth: t.depth ?? null,
        // bellowsStatus and shockAbsorberStatus removed
    }));
    setTireStates(initializedTires);
  }, [trailer]);

  const handleInspectionDataChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setInspectionData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? null : parseFloat(value)) : value,
    }));
  };

  const handleTireStateChange = (tireId: string, field: keyof TireState, value: string | number) => {
    setTireStates(prevTires =>
      prevTires.map(tire => {
        if (tire.id === tireId) {
          const updatedTire = { ...tire };
          if (field === 'pressure' || field === 'depth') {
            (updatedTire[field] as number | null) = value === '' ? null : parseFloat(value as string);
          } else {
            // This else case might not be needed anymore if only pressure and depth are settable this way
            (updatedTire[field] as string) = value as string;
          }
          return updatedTire;
        }
        return tire;
      })
    );
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedTrailer = {
      ...formData,
      lastTireInspectionData: inspectionData,
      tires: tireStates,
    };
    onSave(updatedTrailer);
  };

  const axles = [1, 2, 3];

  return (
    <div className="bg-neutral-light p-4 sm:p-6 md:p-8 rounded-lg shadow-xl w-full mx-auto max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex items-center mb-4 sm:mb-0">
           <DocumentCheckIcon className="w-8 h-8 mr-3 text-primary-dark" />
           <h2 className="text-2xl md:text-3xl font-semibold text-primary-dark">{TIRE_INSPECTION_FORM_TITLE}</h2>
        </div>
        <button
          onClick={onCancel}
          className="flex items-center px-4 py-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors duration-150 ease-in-out self-start sm:self-center rounded-md border border-primary hover:bg-primary-light hover:text-white"
          aria-label="Zpět na seznam návěsů"
        >
          <BackArrowIcon className="w-5 h-5 mr-2" />
          Zpět na Seznam Návěsů
        </button>
      </div>
      
      <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-white">
        <p className="text-lg font-semibold text-gray-700">Návěs: <span className="font-normal">{formData.nickname || 'Nezadáno'}</span></p>
        <p className="text-lg font-semibold text-gray-700">SPZ: <span className="font-normal">{formData.licensePlate}</span></p>
        <p className="text-lg font-semibold text-gray-700">Řidič: <span className="font-normal">{formData.driverName || 'Nezadán'}</span></p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Údaje o Kontrole</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            <FormField label="Datum měření" id="inspectionDate" name="inspectionDate" type="date" value={inspectionData.inspectionDate} onChange={handleInspectionDataChange} required />
            <FormField label="Stav km" id="odometerKm" name="odometerKm" type="number" value={inspectionData.odometerKm ?? ''} onChange={handleInspectionDataChange} placeholder="Např. 123456" />
            <FormField label="Určení (např. dálniční)" id="purpose" name="purpose" value={inspectionData.purpose} onChange={handleInspectionDataChange} placeholder="Např. Dálniční provoz" />
            <FormField label="Mechanik" id="mechanicName" name="mechanicName" value={inspectionData.mechanicName} onChange={handleInspectionDataChange} required placeholder="Jméno mechanika"/>
            <FormField label="Doporučený tlak (Bar)" id="recommendedPressure" name="recommendedPressure" type="number" value={inspectionData.recommendedPressure ?? ''} onChange={handleInspectionDataChange} placeholder="Např. 9.5" />
            {/* FormField for puncturePreventionApplied removed */}
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <TireIcon className="w-6 h-6 mr-2 text-primary-dark"/> Stav Pneumatik dle Náprav
          </h3>
          <div className="space-y-6">
            {axles.map(axleNumber => {
              const leftTire = tireStates.find(t => t.name.includes(`Náprava ${axleNumber} Levá`));
              const rightTire = tireStates.find(t => t.name.includes(`Náprava ${axleNumber} Pravá`));

              return (
                <div key={axleNumber} className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                  <h4 className="text-lg font-medium text-gray-600 mb-4">Náprava {axleNumber}</h4>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start md:space-x-4">
                    {/* Levá pneumatika */}
                    <div className="w-full md:w-1/3 p-3 border border-gray-100 rounded-md bg-neutral-light/30 mb-4 md:mb-0">
                      {leftTire ? (
                        <>
                          <h5 className="text-md font-semibold text-neutral-dark mb-3">{leftTire.name}</h5>
                          <FormField label="" id={`${leftTire.id}_pressure`} name={`${leftTire.id}_pressure`} type="number" value={leftTire.pressure ?? ''} onChange={(e) => handleTireStateChange(leftTire.id, 'pressure', e.target.value)} placeholder="Tlak (Bar)" />
                          <FormField label="" id={`${leftTire.id}_depth`} name={`${leftTire.id}_depth`} type="number" value={leftTire.depth ?? ''} onChange={(e) => handleTireStateChange(leftTire.id, 'depth', e.target.value)} placeholder="Hloubka (mm)" />
                          {/* FormFields for bellowsStatus and shockAbsorberStatus removed */}
                        </>
                      ) : <p className="text-sm text-gray-500">Levá pneu nenalezena.</p>}
                    </div>
                    
                    <AxleVisual />

                    {/* Pravá pneumatika */}
                    <div className="w-full md:w-1/3 p-3 border border-gray-100 rounded-md bg-neutral-light/30">
                      {rightTire ? (
                       <>
                        <h5 className="text-md font-semibold text-neutral-dark mb-3">{rightTire.name}</h5>
                        <FormField label="" id={`${rightTire.id}_pressure`} name={`${rightTire.id}_pressure`} type="number" value={rightTire.pressure ?? ''} onChange={(e) => handleTireStateChange(rightTire.id, 'pressure', e.target.value)} placeholder="Tlak (Bar)" />
                        <FormField label="" id={`${rightTire.id}_depth`} name={`${rightTire.id}_depth`} type="number" value={rightTire.depth ?? ''} onChange={(e) => handleTireStateChange(rightTire.id, 'depth', e.target.value)} placeholder="Hloubka (mm)" />
                        {/* FormFields for bellowsStatus and shockAbsorberStatus removed */}
                       </>
                      ) : <p className="text-sm text-gray-500">Pravá pneu nenalezena.</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="mt-8 flex justify-end space-x-3">
          <button type="button" onClick={onCancel} className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">Zrušit</button>
          <button type="submit" className="px-6 py-2.5 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark">Uložit Kontrolu Pneumatik</button>
        </div>
      </form>
    </div>
  );
};

export default TireInspectionForm;