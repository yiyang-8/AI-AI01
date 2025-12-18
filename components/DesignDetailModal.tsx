
import React, { useState } from 'react';
import { DesignResult, Product } from '../types';
import ComparisonSlider from './ComparisonSlider';

interface DesignDetailModalProps {
  data: DesignResult;
  onClose: () => void;
  onEdit?: (instruction: string) => void;
  onRequestProducts?: (products: Product[]) => void;
}

const DesignDetailModal: React.FC<DesignDetailModalProps> = ({ data, onClose, onEdit, onRequestProducts }) => {
  const [activeTab, setActiveTab] = useState<'design' | 'compare'>('design');
  const [hoveredProduct, setHoveredProduct] = useState<Product | null>(null);
  const [isInpainting, setIsInpainting] = useState(false);
  const [editPrompt, setEditPrompt] = useState('');

  const handleInpaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editPrompt.trim() && onEdit) {
      onEdit(editPrompt);
      setIsInpainting(false);
      setEditPrompt('');
    }
  };

  const handleGetProducts = () => {
    if (onRequestProducts && data.products) {
      onRequestProducts(data.products);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 animate-fade-in">
      <div className="absolute inset-0 bg-zinc-950/95 backdrop-blur-2xl cursor-zoom-out" onClick={onClose} />
      
      <div className="relative w-full max-w-6xl h-full flex flex-col bg-transparent overflow-hidden animate-scale-up">
        
        {/* Top Toggle Controls */}
        <div className="flex justify-center mb-6">
          <div className="bg-white/10 backdrop-blur-xl rounded-full p-1 border border-white/10 shadow-2xl">
            <button 
              onClick={() => setActiveTab('design')}
              className={`px-6 py-2 rounded-full text-[11px] font-bold tracking-widest uppercase transition-all ${activeTab === 'design' ? 'bg-white text-zinc-950' : 'text-white/60 hover:text-white'}`}
            >
              沉浸预览
            </button>
            <button 
              onClick={() => setActiveTab('compare')}
              className={`px-6 py-2 rounded-full text-[11px] font-bold tracking-widest uppercase transition-all ${activeTab === 'compare' ? 'bg-white text-zinc-950' : 'text-white/60 hover:text-white'}`}
            >
              对比模式
            </button>
          </div>
        </div>

        {/* Main Canvas Area - Dominant Space */}
        <div className="relative flex-1 bg-zinc-900/50 rounded-[40px] overflow-hidden border border-white/5 shadow-2xl group">
          {activeTab === 'design' ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <img src={data.modified} className="w-full h-full object-contain" alt="Design detail" />
              
              {/* Minimal Product Dots */}
              {!isInpainting && data.products?.map((product) => (
                <div 
                  key={product.id}
                  className="absolute"
                  style={{ left: `${product.x}%`, top: `${product.y}%` }}
                >
                  <button 
                    onMouseEnter={() => setHoveredProduct(product)}
                    onMouseLeave={() => setHoveredProduct(null)}
                    className="w-4 h-4 bg-white border-2 border-zinc-950 rounded-full flex items-center justify-center shadow-xl hover:scale-150 transition-transform duration-300"
                  >
                    <div className="w-1 h-1 bg-zinc-950 rounded-full" />
                  </button>
                  
                  {hoveredProduct?.id === product.id && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-40 bg-white/90 backdrop-blur-md rounded-2xl p-2 shadow-2xl border border-white/40 animate-fade-in z-50">
                      <p className="text-[10px] font-bold text-zinc-900 truncate">{product.name}</p>
                      <p className="text-[9px] font-bold text-indigo-600 mt-0.5">{product.price}</p>
                    </div>
                  )}
                </div>
              ))}

              {/* Inpaint Overlay */}
              {isInpainting && (
                <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm cursor-crosshair flex items-center justify-center p-6">
                  <div className="bg-white rounded-3xl p-6 shadow-2xl border border-white/20 w-full max-w-sm animate-scale-up">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center">
                      <span className="mr-2">🪄</span> 描述选区的修改想法
                    </p>
                    <form onSubmit={handleInpaintSubmit}>
                      <textarea 
                        autoFocus
                        value={editPrompt}
                        onChange={(e) => setEditPrompt(e.target.value)}
                        placeholder="例如：'把地毯换成浅灰色大理石'..."
                        className="w-full bg-zinc-50 border-none rounded-2xl text-sm py-4 px-4 focus:ring-2 focus:ring-zinc-950 transition-all h-24 mb-4 resize-none"
                      />
                      <div className="flex gap-3">
                        <button type="button" onClick={() => setIsInpainting(false)} className="flex-1 py-3 text-xs font-bold text-zinc-400 hover:text-zinc-600">取消</button>
                        <button type="submit" className="flex-1 py-3 text-xs font-bold bg-zinc-950 text-white rounded-xl shadow-lg">提交生成</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <ComparisonSlider 
              original={data.original} 
              modified={data.modified} 
              className="w-full h-full" 
              showLabels={true} 
            />
          )}
        </div>

        {/* Floating Toolbar - Bottom */}
        <div className="flex justify-center mt-8">
          <div className="bg-zinc-900/80 backdrop-blur-2xl px-4 py-3 rounded-3xl border border-white/10 shadow-2xl flex items-center space-x-6">
            <button 
              onClick={() => setIsInpainting(true)}
              className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all group relative"
              title="局部重绘"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">魔法画笔</span>
            </button>
            
            <button 
              className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all group relative"
              title="生成变体"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">风格探索</span>
            </button>

            <div className="w-[1px] h-6 bg-white/10" />

            <button 
              onClick={handleGetProducts}
              className="flex items-center space-x-2 bg-white text-zinc-950 px-5 py-2.5 rounded-2xl text-[11px] font-bold hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              <span>想要这套家具？</span>
            </button>
          </div>
        </div>

        {/* Close UI */}
        <button 
          onClick={onClose}
          className="absolute top-0 right-0 p-3 text-white/40 hover:text-white transition-all"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  );
};

export default DesignDetailModal;
