
import React from 'react';
import ComparisonSlider from './ComparisonSlider';

interface ComparisonModalProps {
  original: string;
  modified: string;
  onClose: () => void;
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({ original, modified, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 animate-fade-in">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-zinc-950/90 backdrop-blur-md cursor-zoom-out"
        onClick={onClose}
      />
      
      {/* 内容卡片 */}
      <div className="relative w-full max-w-6xl aspect-[16/10] bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20 animate-scale-up">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-[110] p-3 bg-white/20 hover:bg-white text-zinc-900 backdrop-blur rounded-full transition-all group shadow-xl"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="absolute top-6 left-6 z-[110] flex space-x-2">
          <div className="px-4 py-1.5 bg-zinc-950/40 backdrop-blur rounded-full border border-white/20 text-white text-xs font-bold uppercase tracking-widest">
            拖动滑块查看细节
          </div>
        </div>

        <ComparisonSlider 
          original={original} 
          modified={modified} 
          className="w-full h-full" 
          showLabels={true} 
        />
      </div>
    </div>
  );
};

export default ComparisonModal;
