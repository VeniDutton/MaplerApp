
import React, { useState, useEffect, ChangeEvent, FormEvent, useRef } from 'react';
import { TractorRefuelingRecord, RefrigerationUnitRefuelingEntry, Trailer, PhotoMetadata } from '../types';
import FormField from './FormField';
import { BackArrowIcon, FuelPumpIcon, CameraIcon, TrashIcon, CloseIcon, MapPinIcon } from './icons';
import { REFUELING_FORM_TITLE, generateId } from '../constants';

type RefuelingMode = 'tractor' | 'trailerUnit';

interface RefuelingFormProps {
  trailers: Trailer[]; // Refrigerated trailers for selection
  onSaveTractorRefueling: (record: Omit<TractorRefuelingRecord, 'id'>) => void;
  onSaveTrailerRefrigerationUnitRefueling: (trailerId: string, entry: Omit<RefrigerationUnitRefuelingEntry, 'id'>) => void;
  onCancel: () => void;
}

const RefuelingForm: React.FC<RefuelingFormProps> = ({
  trailers,
  onSaveTractorRefueling,
  onSaveTrailerRefrigerationUnitRefueling,
  onCancel,
}) => {
  const [mode, setMode] = useState<RefuelingMode>('tractor');
  
  // Common fields
  const [refuelingDate, setRefuelingDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dieselLiters, setDieselLiters] = useState<number | null>(null);
  const [receiptPhoto, setReceiptPhoto] = useState<PhotoMetadata | null>(null);

  // Tractor specific fields
  const [tractorLicensePlate, setTractorLicensePlate] = useState<string>('');
  const [adblueLiters, setAdblueLiters] = useState<number | null>(null);
  const [odometerKm, setOdometerKm] = useState<number | null>(null);

  // Trailer unit specific fields
  const [selectedTrailerId, setSelectedTrailerId] = useState<string>('');
  const [fridgeMth, setFridgeMth] = useState<number | null>(null);

  // Camera state
  const [isCameraViewOpen, setIsCameraViewOpen] = useState<boolean>(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Reset fields when mode changes
    setRefuelingDate(new Date().toISOString().split('T')[0]);
    setDieselLiters(null);
    setReceiptPhoto(null);
    setTractorLicensePlate('');
    setAdblueLiters(null);
    setOdometerKm(null);
    setSelectedTrailerId(trailers.length > 0 && trailers.filter(t=>t.isRefrigerated).length > 0 ? trailers.filter(t=>t.isRefrigerated)[0].id : '');
    setFridgeMth(null);
    setCameraError(null);
  }, [mode, trailers]);

   useEffect(() => {
    if (mode === 'trailerUnit' && trailers.length > 0 && !selectedTrailerId) {
        const firstRefrigerated = trailers.find(t => t.isRefrigerated);
        if (firstRefrigerated) {
            setSelectedTrailerId(firstRefrigerated.id);
        }
    }
  }, [mode, trailers, selectedTrailerId]);


  const handleNumericChange = (setter: React.Dispatch<React.SetStateAction<number | null>>) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setter(value === '' ? null : parseFloat(value));
  };

  const startCamera = async () => {
    stopCamera(); 
    setCameraError(null);
    setIsCameraViewOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      setVideoStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Chyba přístupu ke kameře:", err);
      setCameraError("Nepodařilo se získat přístup ke kameře. Zkontrolujte oprávnění v prohlížeči.");
      setIsCameraViewOpen(false);
    }
  };

  const stopCamera = () => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
    }
    setVideoStream(null);
    setIsCameraViewOpen(false);
    if (videoRef.current) {
        videoRef.current.srcObject = null;
    }
  };

  const capturePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        
        let gpsCoordinates: PhotoMetadata['gpsCoordinates'] = null;
        try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                });
            });
            const { latitude, longitude, accuracy } = position.coords;
            gpsCoordinates = { latitude, longitude, accuracy };
        } catch (error) {
            console.warn("Could not get GPS coordinates:", error instanceof GeolocationPositionError ? error.message : String(error));
        }

        const newPhotoData: PhotoMetadata = {
          dataUrl,
          capturedAt: new Date().toISOString(),
          gpsCoordinates,
        };
        setReceiptPhoto(newPhotoData);
      }
      stopCamera();
    }
  };

  const clearPhoto = () => {
    setReceiptPhoto(null);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (mode === 'tractor') {
      if (!tractorLicensePlate.trim() || dieselLiters === null || dieselLiters <=0 || odometerKm === null || odometerKm <=0 ) {
        alert('Prosím, vyplňte všechna povinná pole pro tahač (SPZ, Nafta, Stav km).');
        return;
      }
      onSaveTractorRefueling({
        tractorLicensePlate,
        refuelingDate,
        dieselLiters,
        adblueLiters,
        odometerKm,
        receiptPhoto,
      });
    } else { // mode === 'trailerUnit'
      if (!selectedTrailerId || dieselLiters === null || dieselLiters <=0 || fridgeMth === null || fridgeMth <0) {
        alert('Prosím, vyberte návěs a vyplňte všechna povinná pole pro agregát (Nafta, Mth).');
        return;
      }
      onSaveTrailerRefrigerationUnitRefueling(selectedTrailerId, {
        refuelingDate,
        dieselLiters,
        fridgeMth,
        receiptPhoto,
      });
    }
  };
  
  const refrigeratedTrailers = trailers.filter(t => t.isRefrigerated);

  return (
    <div className="bg-neutral-light p-4 sm:p-6 md:p-8 rounded-lg shadow-xl w-full mx-auto max-w-2xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex items-center mb-4 sm:mb-0">
           <FuelPumpIcon className="w-8 h-8 mr-3 text-primary-dark" />
           <h2 className="text-2xl md:text-3xl font-semibold text-primary-dark">{REFUELING_FORM_TITLE}</h2>
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

      <div className="mb-6">
        <div className="flex border-b border-gray-300">
          <button
            onClick={() => setMode('tractor')}
            className={`py-3 px-4 text-sm font-medium transition-colors ${mode === 'tractor' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Tahač
          </button>
          <button
            onClick={() => setMode('trailerUnit')}
            className={`py-3 px-4 text-sm font-medium transition-colors ${mode === 'trailerUnit' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Agregát Návěsu
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        {mode === 'tractor' && (
          <>
            <FormField label="SPZ Tahače" id="tractorLicensePlate" name="tractorLicensePlate" value={tractorLicensePlate} onChange={(e) => setTractorLicensePlate(e.target.value)} required placeholder="Např. 5AU 1234"/>
            <FormField label="Datum tankování" id="refuelingDateTractor" name="refuelingDate" type="date" value={refuelingDate} onChange={(e) => setRefuelingDate(e.target.value)} required />
            <FormField label="Nafta (litry)" id="dieselLitersTractor" name="dieselLiters" type="number" value={dieselLiters ?? ''} onChange={handleNumericChange(setDieselLiters)} required placeholder="Např. 500"/>
            <FormField label="AdBlue (litry)" id="adblueLitersTractor" name="adblueLiters" type="number" value={adblueLiters ?? ''} onChange={handleNumericChange(setAdblueLiters)} placeholder="Např. 50" />
            <FormField label="Aktuální stav km" id="odometerKmTractor" name="odometerKm" type="number" value={odometerKm ?? ''} onChange={handleNumericChange(setOdometerKm)} required placeholder="Např. 350123"/>
          </>
        )}

        {mode === 'trailerUnit' && (
          <>
            <FormField
              label="Vyberte chladírenský návěs"
              id="selectedTrailerId"
              name="selectedTrailerId"
              value={selectedTrailerId}
              onChange={(e) => setSelectedTrailerId(e.target.value)}
              options={refrigeratedTrailers.map(t => ({ value: t.id, label: `${t.nickname || 'Návěs'} (${t.licensePlate})` }))}
              required
              disabled={refrigeratedTrailers.length === 0}
              placeholder={refrigeratedTrailers.length === 0 ? "Žádné chladírenské návěsy k dispozici" : "Vyberte návěs"}
            />
            <FormField label="Datum tankování" id="refuelingDateTrailer" name="refuelingDate" type="date" value={refuelingDate} onChange={(e) => setRefuelingDate(e.target.value)} required />
            <FormField label="Nafta (litry) pro agregát" id="dieselLitersTrailer" name="dieselLiters" type="number" value={dieselLiters ?? ''} onChange={handleNumericChange(setDieselLiters)} required placeholder="Např. 100" />
            <FormField label="Aktuální Mth agregátu" id="fridgeMthTrailer" name="fridgeMth" type="number" value={fridgeMth ?? ''} onChange={handleNumericChange(setFridgeMth)} required placeholder="Např. 1250.5"/>
          </>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Foto účtenky</label>
          {receiptPhoto ? (
            <div className="mt-2 relative group w-32 h-auto"> {/* Adjusted for potentially taller receipts */}
              <img src={receiptPhoto.dataUrl} alt="Účtenka náhled" className="w-full h-auto object-contain rounded-md shadow max-h-64" />
              {receiptPhoto.gpsCoordinates && (
                  <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white p-1 rounded-full" title={`GPS: ${receiptPhoto.gpsCoordinates.latitude.toFixed(5)}, ${receiptPhoto.gpsCoordinates.longitude.toFixed(5)}`}>
                      <MapPinIcon className="w-3 h-3" />
                  </div>
              )}
              <button
                type="button"
                onClick={clearPhoto}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"
                aria-label="Odstranit foto účtenky"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={startCamera}
              className="mt-1 w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 h-24"
            >
              <CameraIcon className="w-5 h-5 mr-2 text-primary" />
              Pořídit foto účtenky
            </button>
          )}
          {cameraError && !isCameraViewOpen && <p className="text-red-500 text-sm mt-1">{cameraError}</p>}
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <button type="button" onClick={onCancel} className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">Zrušit</button>
          <button type="submit" className="px-6 py-2.5 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark">Uložit Záznam</button>
        </div>
      </form>

      {/* Camera View Modal/Overlay */}
      {isCameraViewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-[60] p-4">
          <video ref={videoRef} autoPlay playsInline className="w-full max-w-lg h-auto mb-4 rounded-md shadow-xl bg-gray-800" />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          {cameraError && <p className="text-red-400 bg-red-900 bg-opacity-50 p-2 rounded text-sm mb-3">{cameraError}</p>}
          <div className="flex space-x-4">
            <button 
              onClick={capturePhoto} 
              className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 text-lg font-medium flex items-center"
              disabled={!videoStream || !!cameraError}
            >
              <CameraIcon className="w-6 h-6 mr-2"/> Zachytit
            </button>
            <button 
              onClick={stopCamera} 
              className="px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 text-lg font-medium"
            >
              Zrušit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RefuelingForm;