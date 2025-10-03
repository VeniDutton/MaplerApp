
import React from 'react';

interface IconProps {
  className?: string;
}

export const PlusIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

export const EditIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
  </svg>
);

export const FuelIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.375A1.125 1.125 0 0 1 9.375 5.25h5.25A1.125 1.125 0 0 1 15.75 6.375V7.5m-7.5 0V12.375c0 .621.504 1.125 1.125 1.125H13.5A1.125 1.125 0 0 0 14.625 12.375V7.5m-7.5 0h7.5M12 15.375V18m0 0H9.375A1.125 1.125 0 0 1 8.25 16.875V15.375m3.75 0H14.625A1.125 1.125 0 0 0 15.75 16.875V18m0 0h.008v.008H18V18Zm-3.75 0h.008v.008H14.25V18Zm-3.75 0h.008v.008H10.5V18Z" />
  </svg>
);

export const TireIcon: React.FC<IconProps> = ({ className }) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 6.75v10.5M7.5 12h9M12 3.75a1.5 1.5 0 0 1 1.5 1.5v.75a1.5 1.5 0 0 1-3 0v-.75a1.5 1.5 0 0 1 1.5-1.5ZM12 18.75a1.5 1.5 0 0 1-1.5-1.5v-.75a1.5 1.5 0 0 1 3 0v.75a1.5 1.5 0 0 1-1.5-1.5Z" />
  </svg>
);

export const PalletIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125V6.375c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v.001c0 .621.504 1.125 1.125 1.125Z" />
  </svg>
);

export const HookIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.396 2.892a1.509 1.509 0 0 0-2.792 0L6.363 7.194a1.751 1.751 0 0 1-2.474-2.475L6.75 1.875C8.184.44 10.502.44 11.936 1.875l2.861 2.844a1.751 1.751 0 0 1-2.474 2.475L9.082 4.132V15.75a3 3 0 0 0 3 3h.375A2.625 2.625 0 0 1 15 16.125V8.625c0-.778.428-1.48 1.089-1.835l.002-.001.002-.001A2.25 2.25 0 0 1 19.5 8.625v1.125c0 .621.504 1.125 1.125 1.125H21a.75.75 0 0 0 .75-.75V8.625a4.5 4.5 0 0 0-4.5-4.5c-.94 0-1.825.288-2.565.778l-.002.001-.002.001Z" />
  </svg>
);

export const LoadBarIcon: React.FC<IconProps> = ({ className }) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
  </svg>
);

export const DamageIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.008v.008H12v-.008Z" />
  </svg>
);

export const CloseIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const RefrigeratorIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h12A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6zM12 8.25v7.5M12 8.25a.75.75 0 00-.75-.75H9a.75.75 0 000 1.5h2.25A.75.75 0 0012 8.25zM12 15.75a.75.75 0 01.75.75H15a.75.75 0 010 1.5h-2.25a.75.75 0 01-.75-.75V15.75zM7.5 12a.75.75 0 00-.75-.75H6a.75.75 0 000 1.5h.75a.75.75 0 00.75-.75zM17.25 12a.75.75 0 00-.75-.75H15a.75.75 0 000 1.5h1.5a.75.75 0 00.75-.75z" />
  </svg>
);

export const UserIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A1.875 1.875 0 0 1 17.624 22.5H6.375A1.875 1.875 0 0 1 4.5 20.118Z" />
  </svg>
);

export const CameraIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.04l-.821 1.316Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
  </svg>
);

export const TrashIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.56 0c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
);

export const TruckIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-10 h-10"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.508 1.129-1.125V14.25m-16.5 0V9.75M21.75 9.75A2.25 2.25 0 0 0 19.5 7.5H18V6c0-.828-.672-1.5-1.5-1.5H6c-.828 0-1.5.672-1.5 1.5v1.5H3.75A2.25 2.25 0 0 0 1.5 9.75v4.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 14.25h15M4.5 9.75h15" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 9.75V6" />
 </svg>
);

export const BackArrowIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
  </svg>
);

export const WrenchScrewdriverIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-10 h-10"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.83-5.83M11.42 15.17l-4.95-4.95a2.652 2.652 0 0 1 0-3.749l5.036-5.036a2.652 2.652 0 0 1 3.749 0l4.95 4.95M11.42 15.17 7.621 11.372a2.652 2.652 0 0 0-3.749 0L2.25 12.999a2.652 2.652 0 0 0 0 3.749l4.95 4.95M11.42 15.17l5.83 5.83" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 2.25 17.25 12.75" />
 </svg>
);

export const SparklesIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.25 10.5V8.25L17.187 5.25l-3.09-.814L12.75 1.5 11.686 4.436l-3.09.814L5.563 8.25v2.25l3.09.814 1.25 3.031.063-.001.062.001L11.25 18l.813-2.846a4.5 4.5 0 0 0 3.09-3.09l2.846-.813Zm-9.75 6.75h.008v.008H8.5v-.008ZM12 21h.008v.008H12v-.008Zm3.5-6.75h.008v.008H15.5v-.008Z" />
  </svg>
);

export const DocumentCheckIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-4.5L6.75 11.25m6.75 0L11.25 15M6.75 15m0 0A2.25 2.25 0 0 0 4.5 17.25v.875c0 .621.504 1.125 1.125 1.125h5.25c.621 0 1.125-.504 1.125-1.125v-.875a2.25 2.25 0 0 0-2.25-2.25H6.75Z" />
  </svg>
);

export const FuelPumpIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-10 h-10"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.375A1.125 1.125 0 0 1 9.375 5.25h5.25A1.125 1.125 0 0 1 15.75 6.375V7.5m-7.5 0V12.375c0 .621.504 1.125 1.125 1.125H13.5A1.125 1.125 0 0 0 14.625 12.375V7.5m-7.5 0h7.5M12 15.375V18m0 0H9.375A1.125 1.125 0 0 1 8.25 16.875V15.375m3.75 0H14.625A1.125 1.125 0 0 0 15.75 16.875V18m3.75-3.75H18a1.125 1.125 0 0 0 1.125-1.125V7.875A1.125 1.125 0 0 0 18 6.75h-1.125" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7.5h6M9 18.75h6" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 21.75H8.25A2.25 2.25 0 0 1 6 19.5V7.5A2.25 2.25 0 0 1 8.25 5.25h7.5A2.25 2.25 0 0 1 18 7.5v12a2.25 2.25 0 0 1-2.25 2.25Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 12.75a.75.75 0 0 0 .75.75h.75a.75.75 0 0 0 .75-.75v-2.25a.75.75 0 0 0-.75-.75h-.75a.75.75 0 0 0-.75.75V12.75Z" />
  </svg>
);

export const MapPinIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
  </svg>
);

export const HistoryIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-16 h-16"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);
