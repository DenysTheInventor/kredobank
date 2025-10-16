

import React from 'react';
// Fix: Added .tsx extension to the import path.
import { X } from './icons.tsx';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-end" onClick={onClose}>
      <div 
        className="bg-slate-100 dark:bg-slate-800 w-full max-w-md rounded-t-2xl p-6 relative animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h2>
          <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div>{children}</div>
      </div>
       <style>{`
          @keyframes slide-up {
              from { transform: translateY(100%); }
              to { transform: translateY(0); }
          }
          .animate-slide-up { animation: slide-up 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default Modal;