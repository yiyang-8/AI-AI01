
import React from 'react';
import { Message, DesignStyle, Product } from '../types';
import ComparisonSlider from './ComparisonSlider';

interface DynamicMessageProps {
  message: Message;
  onStyleSelect?: (style: DesignStyle) => void;
  onImageClick?: (original: string, modified: string, products?: Product[]) => void;
}

const DynamicMessage: React.FC<DynamicMessageProps> = ({ message, onStyleSelect, onImageClick }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`w-full py-10 border-b border-zinc-50 animate-fade-in ${isUser ? 'bg-white' : 'bg-zinc-50/30'}`}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-start space-x-6">
          {/* Avatar */}
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isUser ? 'bg-zinc-100' : 'bg-zinc-950 shadow-lg'}`}>
            {isUser ? (
              <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            ) : (
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 space-y-5 min-w-0">
            {message.content && (
              <p className="text-zinc-900 text-[15px] leading-relaxed whitespace-pre-wrap font-medium">
                {message.content}
              </p>
            )}

            {message.attachments && message.attachments.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {message.attachments.map(att => (
                  <div key={att.id} className="relative w-56 aspect-[4/3] rounded-3xl overflow-hidden border border-zinc-100 shadow-sm">
                    <img src={att.url} className="w-full h-full object-cover" alt="Upload" />
                  </div>
                ))}
              </div>
            )}

            {renderContentByType(message, onStyleSelect, onImageClick)}

            {message.groundingUrls && message.groundingUrls.length > 0 && (
              <div className="mt-6 pt-6 border-t border-zinc-100">
                <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest mb-3">知识图谱推荐 & 购买途径</p>
                <div className="flex flex-wrap gap-2">
                  {message.groundingUrls.map((link, idx) => (
                    <a key={idx} href={link.uri} target="_blank" className="px-4 py-1.5 bg-white border border-zinc-200 rounded-full text-xs text-zinc-600 hover:border-zinc-950 hover:text-zinc-950 transition-all shadow-sm">
                      {link.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const renderContentByType = (message: Message, onStyleSelect?: (s: DesignStyle) => void, onImageClick?: (o: string, m: string, p?: Product[]) => void) => {
  switch (message.type) {
    case 'style-selection':
      return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          {(message.data as DesignStyle[]).map(style => (
            <button 
              key={style.id}
              onClick={() => onStyleSelect?.(style)}
              className="group text-left space-y-3"
            >
              <div className="aspect-[4/5] rounded-[24px] overflow-hidden border-2 border-transparent group-hover:border-zinc-950 transition-all shadow-md">
                <img src={style.previewUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={style.name} />
              </div>
              <p className="text-xs font-bold text-zinc-800 text-center uppercase tracking-wider">{style.name}</p>
            </button>
          ))}
        </div>
      );

    case 'image-gallery':
      return (
        <div className="columns-1 sm:columns-2 gap-6 mt-6 space-y-6">
          {(message.data as any[]).map((pair, idx) => (
            <div 
              key={idx} 
              className="break-inside-avoid group relative rounded-[32px] overflow-hidden cursor-zoom-in border border-zinc-100 shadow-md hover:shadow-2xl transition-all duration-500"
              onClick={() => onImageClick?.(pair.original, pair.modified, pair.products)}
            >
              <img src={pair.modified} className="w-full h-auto" alt="AI Generated Design" />
              <div className="absolute inset-0 bg-zinc-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center space-y-3">
                <span className="text-white text-[10px] font-bold bg-white/20 backdrop-blur-xl px-5 py-2 rounded-full border border-white/40 uppercase tracking-widest scale-90 group-hover:scale-100 transition-transform">
                  点击进入编辑器
                </span>
                {pair.products && pair.products.length > 0 && (
                  <div className="flex -space-x-2">
                    {pair.products.slice(0, 3).map((p: any) => (
                      <div key={p.id} className="w-6 h-6 rounded-full border-2 border-white overflow-hidden shadow-lg bg-white">
                         <img src={p.image} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {pair.products.length > 3 && (
                      <div className="w-6 h-6 rounded-full border-2 border-white bg-zinc-900 flex items-center justify-center text-[8px] text-white font-bold">
                        +{pair.products.length - 3}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      );

    case 'comparison':
      return (
        <div className="mt-6 rounded-[40px] overflow-hidden shadow-2xl border border-zinc-100 bg-zinc-100">
          <ComparisonSlider 
            original={message.data.original} 
            modified={message.data.modified} 
            className="w-full aspect-video" 
          />
        </div>
      );

    case 'product-list':
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {(message.data as Product[]).map(product => (
            <div key={product.id} className="bg-white border border-zinc-100 rounded-[28px] p-4 flex items-center space-x-4 shadow-sm hover:shadow-md transition-shadow">
              <img src={product.image} className="w-16 h-16 rounded-2xl object-cover" alt={product.name} />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-zinc-900 truncate">{product.name}</h4>
                <p className="text-[10px] font-bold text-indigo-600 mt-1">{product.price}</p>
                <a 
                  href={product.link} 
                  target="_blank" 
                  className="inline-block mt-2 text-[9px] font-bold text-zinc-400 hover:text-zinc-950 uppercase tracking-widest"
                >
                  查看详情 →
                </a>
              </div>
            </div>
          ))}
        </div>
      );

    default:
      return null;
  }
};

export default DynamicMessage;
