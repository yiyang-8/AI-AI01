
import React, { useState, useRef, useEffect } from 'react';

interface ComparisonSliderProps {
  original: string;
  modified: string;
  className?: string;
  showLabels?: boolean;
}

const ComparisonSlider: React.FC<ComparisonSliderProps> = ({ original, modified, className = "", showLabels = true }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const relativeX = x - containerRect.left;
    const percentage = Math.max(0, Math.min(100, (relativeX / containerRect.width) * 100));
    
    setSliderPos(percentage);
  };

  const startDragging = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    // Prevent scroll on touch
    if (e.type === 'touchstart') {
      // e.preventDefault(); // Might block click if not careful
    }
  };
  const stopDragging = () => { isDragging.current = false; };

  useEffect(() => {
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', stopDragging);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', stopDragging);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', stopDragging);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', stopDragging);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`comparison-slider-container group relative cursor-ew-resize overflow-hidden rounded-xl bg-neutral-200 select-none ${className}`}
      onMouseDown={startDragging}
      onTouchStart={startDragging}
    >
      {/* 修改后的 (新) 图像 - 背景 */}
      <img 
        src={modified} 
        alt="Modified" 
        className="block w-full h-full object-cover pointer-events-none"
      />
      
      {/* 原始图像层 */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
         <img src={original} className="w-full h-full object-cover" alt="Original" />
      </div>

      {showLabels && (
        <>
          <div className="absolute left-2 bottom-2 bg-black/40 backdrop-blur-md text-white px-2 py-0.5 text-[10px] rounded uppercase font-bold pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            改造前
          </div>
          <div className="absolute right-2 bottom-2 bg-indigo-600/60 backdrop-blur-md text-white px-2 py-0.5 text-[10px] rounded uppercase font-bold pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            改造后
          </div>
        </>
      )}

      {/* 滑块手柄 */}
      <div 
        className="comparison-slider-handle pointer-events-none"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="handle-circle flex items-center justify-center bg-white/90 backdrop-blur shadow-lg border border-neutral-200 pointer-events-auto">
          <svg className="w-4 h-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 7l-4 4m0 0l4 4m-4-4h18m-4-4l4 4m0 0l-4 4" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ComparisonSlider;
