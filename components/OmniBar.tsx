
import React, { useState, useRef, useEffect } from 'react';
import { Attachment, InputType, DesignMode } from '../types';

interface OmniBarProps {
  mode: DesignMode;
  inputType: InputType;
  onInputTypeToggle: (type: InputType) => void;
  onSend: (text: string, attachments: Attachment[]) => void;
  isGenerating: boolean;
}

const OmniBar: React.FC<OmniBarProps> = ({ mode, inputType, onInputTypeToggle, onSend, isGenerating }) => {
  const [inputText, setInputText] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (ev) => {
              const url = ev.target?.result as string;
              setAttachments(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), url, type: inputType === 'sketch' ? 'drawing' : 'image' }]);
            };
            reader.readAsDataURL(blob);
          }
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [inputType]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result as string;
        setAttachments(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), url, type: inputType === 'sketch' ? 'drawing' : 'image' }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!inputText.trim() && attachments.length === 0) || isGenerating) return;
    onSend(inputText, attachments);
    setInputText('');
    setAttachments([]);
  };

  const getPlaceholder = () => {
    if (inputType === 'sketch') return "上传您的建筑草图，AI 将为您建造梦想豪宅...";
    if (mode === 'exterior') return "描述您的建筑外观愿景，或上传实景图...";
    if (mode === 'landscape') return "描述您的景观构思，如：'带无边泳池的现代中庭'...";
    return "描述您的室内空间改造设想，或直接粘贴图片...";
  };

  return (
    <div className="fixed bottom-0 inset-x-0 p-8 z-40 bg-gradient-to-t from-[#fafafa] via-[#fafafa] to-transparent">
      <div className="max-w-3xl mx-auto">
        {attachments.length > 0 && (
          <div className="flex gap-3 mb-4 p-3 bg-white/90 backdrop-blur border border-zinc-200 rounded-2xl shadow-xl overflow-x-auto no-scrollbar animate-fade-in">
            {attachments.map(att => (
              <div key={att.id} className="relative group flex-shrink-0 w-24 aspect-square rounded-xl overflow-hidden border border-zinc-100">
                <img src={att.url} className={`w-full h-full object-cover ${inputType === 'sketch' ? 'invert opacity-80' : ''}`} alt="preview" />
                <button 
                  onClick={() => setAttachments(prev => prev.filter(a => a.id !== att.id))}
                  className="absolute top-1 right-1 bg-zinc-900/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-[32px] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative bg-white border border-zinc-200 rounded-[28px] p-2 shadow-2xl flex items-center space-x-2 transition-all group-focus-within:border-zinc-400">
            {/* Input Type Toggle */}
            <div className="flex bg-zinc-50 rounded-2xl p-1 border border-zinc-100 ml-1">
              <button 
                onClick={() => onInputTypeToggle('photo')}
                className={`p-2 rounded-xl transition-all ${inputType === 'photo' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
                title="实景照片模式"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
              </button>
              <button 
                onClick={() => onInputTypeToggle('sketch')}
                className={`p-2 rounded-xl transition-all ${inputType === 'sketch' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
                title="草图渲染模式"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </button>
            </div>

            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-3 text-zinc-400 hover:text-zinc-900 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </button>
            
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder={getPlaceholder()}
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-4 px-2 text-zinc-900 font-medium placeholder-zinc-400"
            />

            <button 
              onClick={() => handleSubmit()}
              disabled={isGenerating || (!inputText.trim() && attachments.length === 0)}
              className={`p-3.5 rounded-2xl transition-all flex items-center justify-center ${
                isGenerating ? 'bg-zinc-100 text-zinc-300' : 'bg-zinc-950 text-white shadow-lg hover:scale-105'
              }`}
            >
              {isGenerating ? (
                <div className="w-5 h-5 border-2 border-zinc-300 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 12h14M12 5l7 7-7 7" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <input 
        type="file" 
        multiple 
        ref={fileInputRef} 
        className="hidden" 
        onChange={handleFileChange} 
        accept="image/*"
      />
    </div>
  );
};

export default OmniBar;
