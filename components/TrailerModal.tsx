
import React, { useState, useEffect, ChangeEvent, FormEvent, useRef, useMemo } from 'react';
import { Trailer, TireState, TIRE_CONDITIONS_OPTIONS, PhotoMetadata } from '../types';
import { INITIAL_TRAILER_DATA } from '../constants';
import FormField from './FormField';
import { CloseIcon, CameraIcon, TrashIcon, TireIcon, SparklesIcon, MapPinIcon } from './icons'; // Přidána TireIcon a SparklesIcon
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (trailer: Trailer) => void;
  trailerToEdit: Trailer | null;
}

type PhotoKey = keyof Pick<Trailer, 'photoRightSide' | 'photoRear' | 'photoLeftSide' | 'tireDamagePhoto1' | 'tireDamagePhoto2'>;

const TrailerModal: React.FC<TrailerModalProps> = ({ isOpen, onClose, onSave, trailerToEdit }) => {
  const [trailerData, setTrailerData] = useState<Trailer>(INITIAL_TRAILER_DATA(''));
  
  const [activeCameraKey, setActiveCameraKey] = useState<PhotoKey | null>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // AI Damage Analysis State
  const [aiDamageAnalysis, setAiDamageAnalysis] = useState<string>('');
  const [isAnalyzingDamage, setIsAnalyzingDamage] = useState<boolean>(false);
  const [aiAnalysisError, setAiAnalysisError] = useState<string | null>(null);

  const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.API_KEY! }), []);

  useEffect(() => {
    if (isOpen) {
      if (trailerToEdit) {
        const photosToEdit = {
          photoRightSide: trailerToEdit.photoRightSide || null,
          photoRear: trailerToEdit.photoRear || null,
          photoLeftSide: trailerToEdit.photoLeftSide || null,
          tireDamagePhoto1: trailerToEdit.tireDamagePhoto1 || null,
          tireDamagePhoto2: trailerToEdit.tireDamagePhoto2 || null,
        };
        setTrailerData({ ...trailerToEdit, ...photosToEdit });
      } else {
        setTrailerData(INITIAL_TRAILER_DATA(Date.now().toString()));
      }
      setCameraError(null);
      // Reset AI analysis state on modal open/trailer change
      setAiDamageAnalysis('');
      setIsAnalyzingDamage(false);
      setAiAnalysisError(null);
    } else {
      // Clean up camera and AI state when modal is closed
      stopCamera();
      setAiDamageAnalysis('');
      setIsAnalyzingDamage(false);
      setAiAnalysisError(null);
    }
  }, [trailerToEdit, isOpen]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setTrailerData(prev => ({
        ...prev,
        [name]: checked,
        fuelLevelPercent: !checked && name === 'isRefrigerated' ? null : prev.fuelLevelPercent
      }));
    } else {
       setTrailerData(prev => ({ ...prev, [name]: type === 'number' ? (value === '' ? null : parseFloat(value)) : value }));
    }
  };

  const handleTireConditionChange = (tireId: string, condition: TireState['condition']) => {
    setTrailerData(prev => ({
      ...prev,
      tires: prev.tires.map(tire => tire.id === tireId ? { ...tire, condition } : tire)
    }));
  };

  const startCamera = async (photoKey: PhotoKey) => {
    stopCamera(); 
    setCameraError(null);
    setActiveCameraKey(photoKey);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      setVideoStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Chyba přístupu ke kameře:", err);
      setCameraError("Nepodařilo se získat přístup ke kameře. Zkontrolujte oprávnění v prohlížeči.");
      setActiveCameraKey(null);
    }
  };

  const stopCamera = () => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
    }
    setVideoStream(null);
    setActiveCameraKey(null);
    if (videoRef.current) {
        videoRef.current.srcObject = null;
    }
  };

  const capturePhoto = async () => {
    if (videoRef.current && canvasRef.current && activeCameraKey) {
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
        setTrailerData(prev => ({ ...prev, [activeCameraKey]: newPhotoData }));
      }
      stopCamera();
    }
  };

  const clearPhoto = (photoKey: PhotoKey) => {
    setTrailerData(prev => ({ ...prev, [photoKey]: null }));
  };

  const handleAnalyzeDamage = async () => {
    if (!trailerData.damageDetails.trim()) {
      setAiAnalysisError("Nejprve zadejte popis poškození.");
      setAiDamageAnalysis('');
      return;
    }
    setIsAnalyzingDamage(true);
    setAiDamageAnalysis('');
    setAiAnalysisError(null);

    try {
      const prompt = `Jsi asistent pro správu vozového parku ve firmě Mapler s.r.o. Analyzuj následující popis poškození návěsu. Poskytni stručné shrnutí poškození (max 2 věty) a 2-3 konkrétní, praktická doporučení pro další kroky nebo opravu. Odpovídej v češtině. Popis: '${trailerData.damageDetails}'`;
      
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      
      setAiDamageAnalysis(response.text);
    } catch (error) {
      console.error("Chyba při analýze poškození pomocí AI:", error);
      setAiAnalysisError("Během AI analýzy došlo k chybě. Zkuste to prosím později.");
    } finally {
      setIsAnalyzingDamage(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!trailerData.licensePlate.trim()) {
        alert("SPZ je povinné pole.");
        return;
    }
    if (!trailerData.driverName.trim()) {
        alert("Jméno řidiče je povinné pole.");
        return;
    }
    onSave(trailerData);
    onClose();
  };

  if (!isOpen) return null;

  const renderPhotoInput = (label: string, photoKey: PhotoKey, isSmall: boolean = false) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {trailerData[photoKey]?.dataUrl ? (
        <div className={`mt-2 relative group ${isSmall ? 'w-28 h-20' : 'w-32 h-24'}`}>
          <img src={trailerData[photoKey]?.dataUrl as string} alt={`${label} náhled`} className="w-full h-full object-cover rounded-md shadow" />
          {trailerData[photoKey]?.gpsCoordinates && (
            <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white p-1 rounded-full" title={`GPS: ${trailerData[photoKey]!.gpsCoordinates!.latitude.toFixed(5)}, ${trailerData[photoKey]!.gpsCoordinates!.longitude.toFixed(5)}`}>
                <MapPinIcon className="w-3 h-3" />
            </div>
          )}
          <button
            type="button"
            onClick={() => clearPhoto(photoKey)}
            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"
            aria-label={`Odstranit ${label}`}
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => startCamera(photoKey)}
          className={`mt-1 w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 ${isSmall ? 'h-20' : 'h-24'}`}
        >
          <CameraIcon className="w-5 h-5 mr-2 text-primary" />
          Pořídit foto
        </button>
      )}
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="bg-neutral-light p-6 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 id="modal-title" className="text-2xl font-semibold text-primary-dark">
              {trailerToEdit ? 'Upravit Návěs' : 'Přidat Nový Záznam Návěsu'}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Zavřít modal">
              <CloseIcon className="w-7 h-7" />
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Základní informace */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <FormField label="SPZ (Registrační značka)" id="licensePlate" name="licensePlate" value={trailerData.licensePlate} onChange={handleChange} required placeholder="Např. 1AB 2345" />
              <FormField label="Pojmenování / Označení" id="nickname" name="nickname" value={trailerData.nickname} onChange={handleChange} placeholder="Např. Návěs modrý Kogel" />
            </div>
            <FormField label="Jméno řidiče" id="driverName" name="driverName" value={trailerData.driverName} onChange={handleChange} required placeholder="Např. Jan Novák" />
            <FormField label="Datum poslední kontroly / Zápřahu" id="lastInspectionDate" name="lastInspectionDate" type="date" value={trailerData.lastInspectionDate} onChange={handleChange} required />

            <hr className="my-6"/>
            <FormField label="Chladírenský" id="isRefrigerated" name="isRefrigerated" type="checkbox" checked={trailerData.isRefrigerated} onChange={handleChange} value={trailerData.isRefrigerated.toString()} />
            {trailerData.isRefrigerated && (
                <FormField label="Stav nafty v nádrži (%)" id="fuelLevelPercent" name="fuelLevelPercent" type="number" value={trailerData.fuelLevelPercent} onChange={handleChange} min={0} max={100} placeholder="0-100" />
            )}

            <hr className="my-6"/>
            <h3 className="text-lg font-medium text-gray-800 mb-1 flex items-center">
              <CameraIcon className="w-6 h-6 mr-2 text-primary-dark"/> Fotografie Návěsu
            </h3>
            <p className="text-xs text-gray-500 mb-3">Nahrajte fotografie aktuálního stavu návěsu.</p>
            {cameraError && <p className="text-red-500 text-sm mb-2">{cameraError}</p>}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {renderPhotoInput('Pravý bok', 'photoRightSide')}
              {renderPhotoInput('Zadní část (vrata)', 'photoRear')}
              {renderPhotoInput('Levý bok', 'photoLeftSide')}
            </div>
            
            <hr className="my-6"/>
            <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                <TireIcon className="w-6 h-6 mr-2 text-primary-dark"/> Stav Pneumatik
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {trailerData.tires.map(tire => (
                <FormField key={tire.id} label={tire.name} id={tire.id} name={tire.id} value={tire.condition} onChange={(e) => handleTireConditionChange(tire.id, e.target.value as TireState['condition'])} options={TIRE_CONDITIONS_OPTIONS.map(opt => ({ value: opt, label: opt }))} />
              ))}
            </div>
            <h4 className="text-md font-medium text-gray-700 mt-4 mb-1 col-span-full">Fotodokumentace poškození pneu <span className="text-xs text-gray-500">(volitelné)</span></h4>
            {cameraError && activeCameraKey?.startsWith('tireDamage') && <p className="text-red-500 text-sm mb-2">{cameraError}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {renderPhotoInput('Foto poškození pneu 1', 'tireDamagePhoto1', true)}
              {renderPhotoInput('Foto poškození pneu 2', 'tireDamagePhoto2', true)}
            </div>


            <hr className="my-6"/>
            <h3 className="text-lg font-medium text-gray-800 mb-3">Vybavení</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              <FormField label="Počet háků" id="hookCount" name="hookCount" type="number" value={trailerData.hookCount} onChange={handleChange} min={0} />
              <FormField label="Počet europalet" id="europalletCount" name="europalletCount" type="number" value={trailerData.europalletCount} onChange={handleChange} min={0} />
              <FormField label="Počet vzpěrných tyčí" id="loadBarCount" name="loadBarCount" type="number" value={trailerData.loadBarCount} onChange={handleChange} min={0} />
            </div>

            <hr className="my-6"/>
            <FormField label="Popis poškození" id="damageDetails" name="damageDetails" isTextarea value={trailerData.damageDetails} onChange={handleChange} placeholder="Detailní popis jakéhokoliv poškození..." />
            
            {/* AI Analysis Section */}
            <div className="mt-1 mb-4">
              <button
                type="button"
                onClick={handleAnalyzeDamage}
                disabled={isAnalyzingDamage || !trailerData.damageDetails?.trim()}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-secondary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                aria-label="Analyzovat poškození pomocí AI"
              >
                <SparklesIcon className="w-4 h-4 mr-1.5" />
                Analyzovat poškození AI
              </button>
              {isAnalyzingDamage && <p className="text-xs text-gray-600 mt-1.5 animate-pulse">Probíhá analýza pomocí AI...</p>}
              {aiAnalysisError && <p className="text-xs text-red-600 mt-1.5" role="alert">{aiAnalysisError}</p>}
              {aiDamageAnalysis && (
                <div className="mt-2 p-2.5 border border-primary-light bg-primary-light/10 rounded-md" aria-live="polite">
                  <h5 className="text-xs font-semibold text-primary-dark mb-1">Výsledek AI analýzy:</h5>
                  <p className="text-xs text-neutral-dark whitespace-pre-wrap">{aiDamageAnalysis}</p>
                </div>
              )}
            </div>


            <div className="mt-8 flex justify-end space-x-3">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">Zrušit</button>
              <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark">{trailerToEdit ? 'Uložit Změny' : 'Přidat Záznam Návěsu'}</button>
            </div>
          </form>
        </div>
      </div>

      {/* Camera View Modal/Overlay */}
      {activeCameraKey && (
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
    </>
  );
};

export default TrailerModal;
