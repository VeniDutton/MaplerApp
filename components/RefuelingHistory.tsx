
import React, { useMemo, useState } from 'react';
import { TractorRefuelingRecord, Trailer, RefrigerationUnitRefuelingEntry, PhotoMetadata } from '../types';
import { BackArrowIcon, CameraIcon, CloseIcon, FuelPumpIcon, MapPinIcon } from './icons';

interface CombinedRefuelingRecord {
  id: string;
  type: 'Tahač' | 'Agregát';
  date: string;
  licensePlate: string;
  nickname?: string;
  diesel: number | null;
  adblue?: number | null;
  odometer?: number | null;
  mth?: number | null;
  photo: PhotoMetadata | null;
}

interface RefuelingHistoryProps {
  tractorRefuelingRecords: TractorRefuelingRecord[];
  trailers: Trailer[];
  onCancel: () => void;
}

const PhotoViewerModal: React.FC<{ photo: PhotoMetadata; onClose: () => void }> = ({ photo, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="relative max-w-4xl max-h-[90vh] bg-white p-4 rounded-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-3 -right-3 bg-white text-gray-700 rounded-full p-1 shadow-lg hover:bg-gray-200 z-10" aria-label="Zavřít náhled">
          <CloseIcon className="w-6 h-6" />
        </button>
        <img src={photo.dataUrl} alt="Detail účtenky" className="max-w-full max-h-[85vh] object-contain" />
         <div className="mt-2 text-xs text-center text-gray-500">
            Foceno: {new Date(photo.capturedAt).toLocaleString('cs-CZ')}
            {photo.gpsCoordinates && (
                <span className="ml-2 inline-flex items-center" title={`GPS: ${photo.gpsCoordinates.latitude.toFixed(5)}, ${photo.gpsCoordinates.longitude.toFixed(5)}`}>
                    <MapPinIcon className="w-3 h-3 mr-1"/> Lokace zaznamenána
                </span>
            )}
        </div>
      </div>
    </div>
  );
};

const RefuelingHistory: React.FC<RefuelingHistoryProps> = ({ tractorRefuelingRecords, trailers, onCancel }) => {
  const [viewingPhoto, setViewingPhoto] = useState<PhotoMetadata | null>(null);

  const combinedRecords = useMemo((): CombinedRefuelingRecord[] => {
    const tractorRecords: CombinedRefuelingRecord[] = tractorRefuelingRecords.map(r => ({
      id: r.id,
      type: 'Tahač',
      date: r.refuelingDate,
      licensePlate: r.tractorLicensePlate,
      diesel: r.dieselLiters,
      adblue: r.adblueLiters,
      odometer: r.odometerKm,
      photo: r.receiptPhoto,
    }));

    const trailerRecords: CombinedRefuelingRecord[] = trailers.flatMap(trailer =>
      (trailer.refrigerationUnitRefuelings || []).map(r => ({
        id: r.id,
        type: 'Agregát',
        date: r.refuelingDate,
        licensePlate: trailer.licensePlate,
        nickname: trailer.nickname,
        diesel: r.dieselLiters,
        mth: r.fridgeMth,
        photo: r.receiptPhoto,
      }))
    );

    return [...tractorRecords, ...trailerRecords].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [tractorRefuelingRecords, trailers]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('cs-CZ', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <>
      <div className="bg-neutral-light p-4 sm:p-6 md:p-8 rounded-lg shadow-xl w-full mx-auto max-w-4xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="flex items-center mb-4 sm:mb-0">
             <FuelPumpIcon className="w-8 h-8 mr-3 text-primary-dark" />
             <h2 className="text-2xl md:text-3xl font-semibold text-primary-dark">Historie Tankování (Admin)</h2>
          </div>
          <button
            onClick={onCancel}
            className="flex items-center px-4 py-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors duration-150 ease-in-out self-start sm:self-center rounded-md border border-primary hover:bg-primary-light hover:text-white"
            aria-label="Zpět na hlavní menu"
          >
            <BackArrowIcon className="w-5 h-5 mr-2" />
            Hlavní Menu
          </button>
        </div>
        
        <div className="space-y-4">
            {combinedRecords.length > 0 ? (
                combinedRecords.map(record => (
                    <div key={record.id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col sm:flex-row items-start gap-4">
                        <div className="flex-grow">
                            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-2">
                                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${record.type === 'Tahač' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                    {record.type}
                                </span>
                                <p className="text-lg font-bold text-gray-800">{formatDate(record.date)}</p>
                                <p className="text-gray-600 font-medium">{record.licensePlate} {record.nickname ? `(${record.nickname})` : ''}</p>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2 text-sm">
                                <div className="text-gray-700"><span className="font-semibold text-red-600">{record.diesel}</span> L Nafty</div>
                                {record.adblue != null && <div className="text-gray-700"><span className="font-semibold text-blue-600">{record.adblue}</span> L AdBlue</div>}
                                {record.odometer != null && <div className="text-gray-700"><span className="font-semibold">{record.odometer.toLocaleString('cs-CZ')}</span> km</div>}
                                {record.mth != null && <div className="text-gray-700"><span className="font-semibold">{record.mth}</span> Mth</div>}
                            </div>
                        </div>
                        {record.photo && (
                            <div className="flex-shrink-0 mt-2 sm:mt-0">
                                <button onClick={() => setViewingPhoto(record.photo)} className="flex items-center text-sm text-primary hover:text-primary-dark transition-colors">
                                    <img src={record.photo.dataUrl} alt="Náhled účtenky" className="w-16 h-16 object-cover rounded-md shadow-sm mr-2"/>
                                    <div className="text-left">
                                      <div className="flex items-center"><CameraIcon className="w-4 h-4 mr-1"/> Zobrazit</div>
                                      <span className="text-xs text-gray-500">Účtenku</span>
                                    </div>
                                </button>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                    <p className="text-xl text-gray-600">Nebyly nalezeny žádné záznamy o tankování.</p>
                </div>
            )}
        </div>
      </div>
      {viewingPhoto && <PhotoViewerModal photo={viewingPhoto} onClose={() => setViewingPhoto(null)} />}
    </>
  );
};

export default RefuelingHistory;
