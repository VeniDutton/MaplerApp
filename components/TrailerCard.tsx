
import React from 'react';
import { Trailer, PhotoMetadata } from '../types';
import { EditIcon, FuelIcon, TireIcon, PalletIcon, HookIcon, LoadBarIcon, DamageIcon, RefrigeratorIcon, UserIcon, CameraIcon, DocumentCheckIcon, MapPinIcon } from './icons';

interface TrailerCardProps {
  trailer: Trailer;
  onEdit: (trailer: Trailer) => void;
  onOpenTireInspection: (trailer: Trailer) => void; // New prop
}

const TrailerCard: React.FC<TrailerCardProps> = ({ trailer, onEdit, onOpenTireInspection }) => {
  const getOverallTireCondition = (): string => {
    const conditions = trailer.tires.map(t => t.condition);
    if (conditions.some(c => c === 'Nutná výměna' || c === 'Poškozená')) return 'text-red-500';
    if (conditions.some(c => c === 'Opotřebená')) return 'text-yellow-500';
    return 'text-green-500'; // This green is for "good" status, distinct from primary theme
  };

  const formatDate = (dateString: string | null | undefined, includeTime: boolean = false): string => {
    if (!dateString) return 'Nezadáno';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return dateString;
    }
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
    }
    return date.toLocaleDateString('cs-CZ', options);
  };

  const mainPhotos: { meta: PhotoMetadata | null, label: string }[] = [
    { meta: trailer.photoRightSide, label: 'P. bok' },
    { meta: trailer.photoRear, label: 'Zadek' },
    { meta: trailer.photoLeftSide, label: 'L. bok' },
  ].filter(p => p.meta !== null);

  const tireDamagePhotos: { meta: PhotoMetadata | null, label: string }[] = [
    { meta: trailer.tireDamagePhoto1, label: 'Pošk. Pneu 1' },
    { meta: trailer.tireDamagePhoto2, label: 'Pošk. Pneu 2' },
  ].filter(p => p.meta !== null);


  return (
    <div id={`trailer-card-${trailer.id}`} className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col justify-between">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-semibold text-primary-dark">{trailer.nickname || 'Návěs bez jména'}</h3>
            <p className="text-sm text-gray-600">{trailer.licensePlate}</p>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onOpenTireInspection(trailer)}
              className="p-2 text-primary hover:text-primary-dark transition-colors"
              aria-label={`Detailní kontrola pneumatik pro ${trailer.licensePlate}`}
              title="Detailní Kontrola Pneu"
            >
              <DocumentCheckIcon className="w-6 h-6" />
            </button>
            <button
              onClick={() => onEdit(trailer)}
              className="p-2 text-primary hover:text-primary-dark transition-colors"
              aria-label={`Upravit návěs ${trailer.licensePlate}`}
              title="Upravit Návěs"
            >
              <EditIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="space-y-3 text-sm text-gray-700">
          {trailer.isRefrigerated && (
            <div className="flex items-center">
              <RefrigeratorIcon className="w-5 h-5 mr-2 text-primary" /> {/* Changed to text-primary */}
              Chladírenský
              {trailer.fuelLevelPercent !== null && (
                 <div className="ml-auto flex items-center">
                    <FuelIcon className="w-5 h-5 mr-1 text-primary" /> {/* Changed to text-primary */}
                    <span>{trailer.fuelLevelPercent}% nafty</span>
                 </div>
              )}
            </div>
          )}

          <div> {/* Wrapper for tire condition and its photos */}
            <div className={`flex items-center ${getOverallTireCondition()}`}>
              <TireIcon className="w-5 h-5 mr-2" />
              Stav pneumatik: {trailer.tires.find(t => t.condition === 'Nutná výměna' || t.condition === 'Poškozená') ? 'Vyžaduje pozornost' : 'Dobrý'}
            </div>
            {tireDamagePhotos.length > 0 && (
              <div className="ml-7 mt-1 pl-0 text-xs"> {/* Indent to associate with tires */}
                  <h5 className="text-xs font-semibold text-gray-500 mb-1 flex items-center"><CameraIcon className="w-3 h-3 mr-1"/>Foto poškození pneu:</h5>
                  <div className="grid grid-cols-3 gap-1.5"> {/* Max 2 photos, so 2 columns is enough, using 3 for small size */}
                      {tireDamagePhotos.map((photoItem, index) =>
                          photoItem.meta ? (
                              <div key={`tire-dmg-${index}`} className="text-center">
                                  <img
                                      src={photoItem.meta.dataUrl}
                                      alt={`Náhled ${photoItem.label}`}
                                      className="w-full h-12 object-cover rounded shadow-sm mb-0.5"
                                  />
                                  <p className="text-[10px] text-gray-500 leading-tight">{photoItem.label}</p>
                                  <div className="flex items-center justify-center text-[10px] text-gray-400 leading-tight">
                                    <span>{formatDate(photoItem.meta.capturedAt, true)}</span>
                                    {/* FIX: The MapPinIcon component does not accept a 'title' prop. Wrap it in a span with a title attribute to show a tooltip. */}
                                    {photoItem.meta.gpsCoordinates && (
                                        <span title={`GPS: ${photoItem.meta.gpsCoordinates.latitude.toFixed(5)}, ${photoItem.meta.gpsCoordinates.longitude.toFixed(5)}`}>
                                            <MapPinIcon className="w-3 h-3 ml-0.5" />
                                        </span>
                                    )}
                                  </div>
                              </div>
                          ) : null
                      )}
                  </div>
              </div>
            )}
          </div>

          <div className="flex items-center">
            <PalletIcon className="w-5 h-5 mr-2 text-gray-500" />
            Europalety: {trailer.europalletCount} ks
          </div>
          <div className="flex items-center">
            <HookIcon className="w-5 h-5 mr-2 text-gray-500" />
            Háků: {trailer.hookCount} ks
          </div>
          <div className="flex items-center">
            <LoadBarIcon className="w-5 h-5 mr-2 text-gray-500" />
            Vzpěrných tyčí: {trailer.loadBarCount} ks
          </div>

          {trailer.damageDetails && trailer.damageDetails.trim() !== "" ? (
            <div className="flex items-start text-red-600">
              <DamageIcon className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>Poškození: <span className="font-medium">{trailer.damageDetails}</span></span>
            </div>
          ) : (
             <div className="flex items-start text-primary"> {/* Changed to text-primary */}
                <DamageIcon className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0 opacity-70" /> {/* Adjusted opacity slightly */}
                <span>Bez evidovaného poškození</span>
            </div>
          )}

          {mainPhotos.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-200">
                <h4 className="text-xs font-semibold text-gray-500 mb-2 flex items-center"><CameraIcon className="w-4 h-4 mr-1"/>Fotografie Návěsu</h4>
                <div className="grid grid-cols-3 gap-2">
                    {mainPhotos.map((photoItem, index) =>
                        photoItem.meta ? (
                            <div key={index} className="text-center">
                                <img
                                    src={photoItem.meta.dataUrl}
                                    alt={`Náhled ${photoItem.label}`}
                                    className="w-full h-16 object-cover rounded shadow-md mb-1"
                                />
                                <p className="text-xs text-gray-500">{photoItem.label}</p>
                                <div className="flex items-center justify-center text-xs text-gray-400">
                                  <span>{formatDate(photoItem.meta.capturedAt, true)}</span>
                                  {/* FIX: The MapPinIcon component does not accept a 'title' prop. Wrap it in a span with a title attribute to show a tooltip. */}
                                  {photoItem.meta.gpsCoordinates && (
                                      <span title={`GPS: ${photoItem.meta.gpsCoordinates.latitude.toFixed(5)}, ${photoItem.meta.gpsCoordinates.longitude.toFixed(5)}`}>
                                        <MapPinIcon className="w-3 h-3 ml-1" />
                                      </span>
                                  )}
                                </div>
                            </div>
                        ) : null
                    )}
                </div>
            </div>
          )}
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3 text-xs text-gray-500 border-t">
        <div className="flex items-center justify-between">
            <div>
                <UserIcon className="w-4 h-4 mr-1 inline-block text-gray-400" />
                Řidič: <span className="font-medium text-gray-700">{trailer.driverName || 'Nezadán'}</span>
            </div>
            <div>
                Posl. kontrola: {formatDate(trailer.lastInspectionDate)}
            </div>
        </div>
      </div>
    </div>
  );
};

export default TrailerCard;