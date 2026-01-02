
import React, { useState } from 'react';
import { NavButtons } from './CommonUI';

const StickMethod: React.FC<{ onComplete: () => void; onPrev: () => void }> = ({ onComplete, onPrev }) => {
  const [movedCount, setMovedCount] = useState(0); // 记录搬走了几根
  const [isBundled, setIsBundled] = useState(false);

  const handleStickClick = (index: number) => {
    // 只有右边前两根可以搬运（凑成十），且按顺序点击
    if (index < 2 && movedCount === index && !isBundled) {
      setMovedCount(prev => prev + 1);
      
      // 如果搬运了2根，触发捆扎逻辑
      if (index === 1) {
        setTimeout(() => {
          setIsBundled(true);
        }, 800);
      }
    }
  };

  const reset = () => {
    setMovedCount(0);
    setIsBundled(false);
  };

  return (
    <div className="flex flex-col items-center h-full py-4 overflow-visible">
      <div className="text-center space-y-2 flex-shrink-0">
        <h2 className="text-5xl font-black kids-font text-sky-900">探究新知：手动凑十</h2>
        <p className="text-3xl text-sky-600 font-bold">
          点击右边的蓝色小棒，把它搬到左边凑成 10 吧！
        </p>
      </div>

      <div className="flex items-center space-x-12 p-10 bg-orange-50 rounded-[4rem] border-[8px] border-orange-100 shadow-inner w-full flex-1 justify-center relative my-4 overflow-visible min-h-0">
        
        {/* 左侧区域：8根红 + 最多2根蓝 */}
        <div className={`flex flex-wrap gap-3 w-[450px] justify-center transition-all duration-700 p-8 relative ${isBundled ? 'bg-white border-8 border-sky-400 rounded-[3rem] shadow-2xl scale-110 z-50' : 'bg-red-50/50 rounded-[3rem] border-4 border-dashed border-red-100'}`}>
          {/* 固定的8根红小棒 */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div 
              key={`red-${i}`} 
              className="w-6 h-56 bg-red-400 rounded-full border-4 border-red-700 shadow-sm transition-transform duration-1000"
              style={{ transform: isBundled ? `rotate(${i * 4 - 20}deg)` : 'none' }}
            />
          ))}
          
          {/* 已搬入的蓝小棒插槽 */}
          <div className="flex gap-3">
            <div className={`w-6 h-56 rounded-full border-4 transition-all duration-700 ${movedCount >= 1 ? 'bg-blue-400 border-blue-700 shadow-md opacity-100 scale-100' : 'bg-transparent border-gray-200 border-dashed opacity-30 scale-90'}`} 
                 style={{ transform: isBundled ? `rotate(16deg)` : 'none' }} />
            <div className={`w-6 h-56 rounded-full border-4 transition-all duration-700 ${movedCount >= 2 ? 'bg-blue-400 border-blue-700 shadow-md opacity-100 scale-100' : 'bg-transparent border-gray-200 border-dashed opacity-30 scale-90'}`}
                 style={{ transform: isBundled ? `rotate(22deg)` : 'none' }} />
          </div>

          {isBundled && (
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap animate-bounce z-[60]">
               <span className="bg-sky-600 text-white px-10 py-4 rounded-full text-5xl font-black shadow-xl border-4 border-white">凑成了 10！</span>
            </div>
          )}
        </div>

        <div className="text-8xl font-black text-orange-200 select-none">+</div>

        {/* 右侧区域：5根蓝 */}
        <div className="flex gap-6 w-[500px] justify-center relative p-12 bg-blue-50/30 rounded-[3rem] border-4 border-dashed border-blue-100">
          {Array.from({ length: 5 }).map((_, i) => {
            const isMoved = i < movedCount;
            const isTarget = i < 2 && movedCount === i && !isBundled;
            
            return (
              <div key={`blue-slot-${i}`} className="relative w-8 flex justify-center">
                {/* 指示小手：确保相对于当前小棒垂直对齐 */}
                {isTarget && (
                  <div className="absolute -top-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center">
                    <span className="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full font-black text-lg shadow-sm whitespace-nowrap mb-1">点这里</span>
                    <span className="text-6xl animate-bounce leading-none">👇</span>
                  </div>
                )}
                
                <div 
                  onClick={() => handleStickClick(i)}
                  className={`w-6 h-56 bg-blue-400 rounded-full border-4 border-blue-700 shadow-md transition-all duration-700
                    ${isMoved ? 'opacity-0 scale-0 -translate-x-40 pointer-events-none' : 'opacity-100 cursor-pointer hover:scale-110 active:scale-95'}
                    ${isTarget ? 'ring-4 ring-yellow-400 ring-offset-4' : ''}
                  `}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full flex-shrink-0 flex flex-col items-center space-y-4">
        {isBundled ? (
          <div className="bg-gradient-to-r from-sky-500 to-blue-700 p-6 rounded-[2.5rem] border-4 border-white shadow-xl animate-fade-in w-full text-center relative flex items-center justify-center">
            <p className="text-4xl font-black text-white kids-font tracking-wide">
              想：8 加 2 得 10，10 再加 3 得 13！
            </p>
            <button 
              onClick={reset} 
              className="ml-8 px-8 py-3 bg-white text-sky-700 rounded-full text-2xl font-black shadow-md hover:bg-sky-50 transition-colors border-b-4 border-gray-200 active:border-b-0 active:translate-y-1"
            >
              🔄 重新演示
            </button>
          </div>
        ) : (
          <div className="h-[104px] flex items-center justify-center">
             <p className="text-3xl text-sky-800 font-black kids-font">
               {movedCount === 0 ? "8 差几个凑成 10？点第 1 根蓝色小棒试试！" : movedCount === 1 ? "太棒了，再点第 2 根就凑满 10 啦！" : "凑够 10 个啦，准备观察..."}
             </p>
          </div>
        )}
        <NavButtons onPrev={onPrev} onNext={onComplete} />
      </div>
    </div>
  );
};

export default StickMethod;
