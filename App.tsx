
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Message, DesignStyle, Attachment, DesignResult, Product, DesignMode, InputType } from './types';
import { DESIGN_STYLES } from './constants';
import { GeminiService } from './services/geminiService';
import Header from './components/Header';
import DynamicMessage from './components/DynamicMessage';
import OmniBar from './components/OmniBar';
import DesignDetailModal from './components/DesignDetailModal';

const App: React.FC = () => {
  // 核心状态 V4.0
  const [mode, setMode] = useState<DesignMode>('interior');
  const [inputType, setInputType] = useState<InputType>('photo');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      type: 'text',
      content: '欢迎来到 LumiDecor AI V4.0 全能建筑工作室。在这里，您可以进行室内改造、建筑方案生成以及景观园林设计。',
      timestamp: new Date()
    }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<DesignStyle | null>(null);
  const [detailData, setDetailData] = useState<DesignResult | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const gemini = useRef(new GeminiService());

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = useCallback((msg: Omit<Message, 'id' | 'timestamp'>) => {
    const newMsg: Message = {
      ...msg,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMsg]);
    return newMsg;
  }, []);

  const mockProducts = (styleName: string): Product[] => [
    {
      id: 'p1',
      x: 35 + Math.random() * 30,
      y: 50 + Math.random() * 20,
      name: `${styleName} 设计家具/饰件`,
      price: "¥ 5,999",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=200",
      link: "#"
    },
    {
      id: 'p2',
      x: 15 + Math.random() * 20,
      y: 20 + Math.random() * 15,
      name: `现代艺术照明`,
      price: "¥ 1,800",
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=200",
      link: "#"
    }
  ];

  const handleGenerate = async (text: string, atts: Attachment[], forceStyle?: DesignStyle) => {
    if (isGenerating) return;
    
    const styleToUse = forceStyle || selectedStyle;
    setIsGenerating(true);

    let content = text || "";
    if (!content && styleToUse) {
      content = inputType === 'sketch' 
        ? `将此草图渲染为【${styleToUse.name}】风格的实景方案` 
        : `以【${styleToUse.name}】风格重设计此${mode === 'interior' ? '空间' : (mode === 'exterior' ? '建筑' : '园林')}`;
    }

    addMessage({
      role: 'user',
      type: 'text',
      content,
      attachments: atts
    });

    try {
      if (!styleToUse && atts.length > 0) {
        addMessage({
          role: 'assistant',
          type: 'style-selection',
          content: `识别到您的${inputType === 'sketch' ? '草图' : '实景图'}。请选择一个设计风格以开始生成：`,
          data: DESIGN_STYLES[mode]
        });
      } 
      else if (atts.length > 0 && styleToUse) {
        const results = await Promise.all(atts.map(async (att) => {
          const base64 = att.url.split(',')[1];
          const result = await gemini.current.redesignRoom(base64, styleToUse.prompt, mode, inputType);
          return { 
            original: att.url, 
            modified: result || '',
            products: mode === 'interior' ? mockProducts(styleToUse.name) : undefined 
          };
        }));

        addMessage({
          role: 'assistant',
          type: 'image-gallery',
          content: `这是为您生成的【${styleToUse.name}】方案。${mode === 'interior' ? '点击查看单品清单或局部修改：' : '点击查看方案详情：'}`,
          data: results
        });
      } 
      else {
        const { text: advice, links } = await gemini.current.getAdvice(text, messages);
        addMessage({
          role: 'assistant',
          type: 'text',
          content: advice,
          groundingUrls: links
        });
      }
    } catch (err) {
      addMessage({
        role: 'assistant',
        type: 'text',
        content: '抱歉，大师正在构思，暂时无法回应，请重试。'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMagicEdit = async (instruction: string) => {
    if (!detailData || isGenerating) return;
    setIsGenerating(true);
    addMessage({ role: 'user', type: 'text', content: `🪄 局部修改: ${instruction}` });
    
    try {
      const base64 = detailData.modified.split(',')[1];
      const result = await gemini.current.editDesign(base64, instruction);
      if (result) {
        const updatedDetail = { ...detailData, modified: result };
        setDetailData(updatedDetail);
        addMessage({
          role: 'assistant',
          type: 'text',
          content: '修改已完成。您可以继续调整，或导出最终成果。'
        });
      }
    } catch (err) {
      addMessage({ role: 'assistant', type: 'text', content: '重绘失败，请换个描述试试。' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRequestProducts = (products: Product[]) => {
    addMessage({ role: 'user', type: 'text', content: '我想看看这套方案里的具体产品。' });
    setTimeout(() => {
      addMessage({
        role: 'assistant',
        type: 'product-list',
        content: '这是为您挑选的单品清单，点击即可查看购买详情：',
        data: products
      });
    }, 600);
  };

  return (
    <div className="flex flex-col h-screen bg-[#fafafa] selection:bg-indigo-100">
      <Header 
        mode={mode}
        onModeChange={(m) => {
          setMode(m);
          setSelectedStyle(null);
          addMessage({ role: 'assistant', type: 'text', content: `已切换至【${m === 'interior' ? '室内设计' : (m === 'exterior' ? '建筑方案' : '景观园林')}】模式。您可以开始上传或描述您的构思。` });
        }}
        onStyleSelect={(style) => {
          setSelectedStyle(style);
          const lastImgMsg = [...messages].reverse().find(m => m.attachments && m.attachments.length > 0);
          if (lastImgMsg?.attachments) {
            handleGenerate('', lastImgMsg.attachments, style);
          }
        }}
        selectedStyleId={selectedStyle?.id}
      />

      <main ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
        <div className="flex flex-col">
          {messages.map((msg) => (
            <DynamicMessage 
              key={msg.id} 
              message={msg} 
              onStyleSelect={(s) => {
                setSelectedStyle(s);
                const lastImgMsg = [...messages].reverse().find(m => m.attachments && m.attachments.length > 0);
                handleGenerate('', lastImgMsg?.attachments || [], s);
              }}
              onImageClick={(original, modified, products) => setDetailData({ original, modified, products })}
            />
          ))}
          
          {isGenerating && (
            <div className="w-full py-12 bg-neutral-50/50">
              <div className="max-w-4xl mx-auto px-6">
                <div className="flex items-center space-x-6 animate-pulse">
                  <div className="w-10 h-10 bg-zinc-200 rounded-xl"></div>
                  <div className="space-y-4 flex-1">
                    <div className="h-4 bg-zinc-200 rounded w-1/4"></div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="h-64 bg-zinc-200 rounded-[32px]"></div>
                      <div className="h-64 bg-zinc-200 rounded-[32px]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="h-60" />
      </main>

      <OmniBar 
        mode={mode}
        inputType={inputType}
        onInputTypeToggle={setInputType}
        onSend={(text, atts) => handleGenerate(text, atts)} 
        isGenerating={isGenerating} 
      />

      {detailData && (
        <DesignDetailModal 
          data={detailData} 
          onClose={() => setDetailData(null)} 
          onEdit={handleMagicEdit}
          onRequestProducts={handleRequestProducts}
        />
      )}
    </div>
  );
};

export default App;
