
import React from 'react';
import { Reflection } from '../types';

interface ReflectionCardProps {
  reflection: Reflection;
  onDelete: (id: string) => void;
  onGenerate: () => void;
}

const ReflectionCard: React.FC<ReflectionCardProps> = ({ reflection, onDelete, onGenerate }) => {
  const date = new Date(reflection.timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 flex flex-col h-full">
      <div 
        className="h-32 w-full transition-transform duration-700 group-hover:scale-105" 
        style={{ background: reflection.gradient }}
      />
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">
            {reflection.vibe} • {date}
          </span>
          <div className="flex gap-2">
            <button 
              onClick={onGenerate}
              title="Manifest Postcard"
              className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-indigo-400 transition-opacity p-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            <button 
              onClick={() => onDelete(reflection.id)}
              className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-opacity p-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <p className="font-serif text-xl text-slate-700 italic leading-snug flex-grow">
          "{reflection.text}"
        </p>
      </div>
    </div>
  );
};

export default ReflectionCard;
