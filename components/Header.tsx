
import React from 'react';
import { DESIGN_STYLES } from '../constants';
import { DesignStyle, DesignMode } from '../types';

interface HeaderProps {
  mode: DesignMode;
  onModeChange: (mode: DesignMode) => void;
  onStyleSelect: (style: DesignStyle) => void;
  selectedStyleId?: string;
}

const Header: React.FC<HeaderProps> = ({ mode, onModeChange, onStyleSelect, selectedStyleId }) => {
  return (
    <header className="h-24 border-b border-zinc-100 bg-white/80 backdrop-blur-xl z-50 flex flex-col justify-center px-8 sticky top-0 space-y-2">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-3 group cursor-pointer">
          <div className="w-9 h-9 bg-zinc-950 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-bold text-zinc-950 tracking-tight leading-none">LumiDecor AI</h1>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1 block">Studio V4.0 Master</span>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex bg-zinc-100 p-1 rounded-2xl border border-zinc-200 shadow-inner">
          <button 
            onClick={() => onModeChange('interior')}
            className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${mode === 'interior' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-800'}`}
          >
            🏠 室内
          </button>
          <button 
            onClick={() => onModeChange('exterior')}
            className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${mode === 'exterior' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-800'}`}
          >
            🏛️ 建筑
          </button>
          <button 
            onClick={() => onModeChange('landscape')}
            className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${mode === 'landscape' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-800'}`}
          >
            🌳 景观
          </button>
        </div>
      </div>

      <nav className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
        {DESIGN_STYLES[mode].map((style) => (
          <button
            key={style.id}
            onClick={() => onStyleSelect(style)}
            className={`px-4 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all duration-300 border ${
              selectedStyleId === style.id
                ? 'bg-zinc-950 text-white border-zinc-950 shadow-md scale-105'
                : 'bg-zinc-50 text-zinc-500 border-zinc-100 hover:bg-zinc-100 hover:text-zinc-900'
            }`}
          >
            {style.name}
          </button>
        ))}
      </nav>
    </header>
  );
};

export default Header;
