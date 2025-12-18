
import React, { useState, useRef, useEffect } from 'react';
// Corrected import: ChatMessage was not exported, using Message instead
import { Message } from '../types';

interface ChatInterfaceProps {
  // Corrected type reference from ChatMessage to Message
  messages: Message[];
  onSendMessage: (msg: string) => void;
  isLoading: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 flex flex-col h-[500px]">
      <div className="p-4 border-b border-neutral-100 bg-neutral-50 rounded-t-2xl flex items-center justify-between">
        <h3 className="font-semibold text-neutral-800">设计助手</h3>
        <div className="text-xs text-neutral-400">上下文感知</div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-10">
            <div className="bg-neutral-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
            </div>
            <p className="text-neutral-500 text-sm">让我帮您完善设计或寻找单品！</p>
            <p className="text-neutral-400 text-xs mt-2 italic">“加一个蓝色地毯” 或 “在哪能买到那盏灯？”</p>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-neutral-100 text-neutral-800 rounded-tl-none'
            }`}>
              {msg.content}
              {msg.groundingUrls && msg.groundingUrls.length > 0 && (
                <div className="mt-2 pt-2 border-t border-neutral-200/20">
                  <p className="text-[10px] uppercase font-bold mb-1 text-indigo-800">发现相关产品：</p>
                  <ul className="space-y-1">
                    {msg.groundingUrls.map((link, i) => (
                      <li key={i}>
                        <a 
                          href={link.uri} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-indigo-600 hover:underline block truncate"
                        >
                          {link.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-neutral-100 rounded-2xl rounded-tl-none p-3 flex space-x-1">
              <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-neutral-100">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入您的设计反馈..."
            className="w-full pl-4 pr-12 py-3 bg-neutral-100 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-sm text-neutral-900 font-medium"
          />
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
