
import React, { useState } from 'react';
import { NavButtons, FeedbackToast } from './CommonUI';

const TreeDiagram: React.FC<{ onComplete: () => void; onPrev: () => void }> = ({ onComplete, onPrev }) => {
  const [val1, setVal1] = useState(''); // 5 分解出的 2
  const [val2, setVal2] = useState(''); // 5 分解出的 3
  const [valSumTen, setValSumTen] = useState(''); // 凑出的 10
  const [finalSum, setFinalSum] = useState(''); // 结果 13
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  
  const [activeField, setActiveField] = useState<'val1' | 'val2' | 'valSumTen' | 'finalSum' | null>(null);

  const check = () => {
    if (val1 === '2' && val2 === '3' && valSumTen === '10' && finalSum === '13') {
      setFeedback('太棒了！算理分析非常正确。点击“做一做”开始练习吧！');
      setIsCorrect(true);
      setActiveField(null);
    } else {
      if (val1 !== '2') {
        setFeedback('凑十法：8加几等于十');
      } else if (val2 !== '3') {
        setFeedback('看一看，5 可以分成 2 和几？');
      } else if (valSumTen !== '10') {
        setFeedback('8 和 2 凑成了多少？填入红色的框框里。');
      } else {
        setFeedback('最后算算，10 加 3 等于多少？');
      }
      setIsCorrect(false);
    }
  };

  const handleKeyClick = (num: string) => {
    if (!activeField || isCorrect) return;
    
    if (num === 'DEL') {
      if (activeField === 'val1') setVal1(prev => prev.slice(0, -1));
      if (activeField === 'val2') setVal2(prev => prev.slice(0, -1));
      if (activeField === 'valSumTen') setValSumTen(prev => prev.slice(0, -1));
      if (activeField === 'finalSum') setFinalSum(prev => prev.slice(0, -1));
      return;
    }

    if (feedback) setFeedback(null);

    if (activeField === 'val1') setVal1(num.slice(0, 1)); 
    if (activeField === 'val2') setVal2(num.slice(0, 1)); 
    if (activeField === 'valSumTen') setValSumTen(prev => (prev + num).slice(0, 2)); 
    if (activeField === 'finalSum') setFinalSum(prev => (prev + num).slice(0, 2)); 
  };

  const layout = {
    x8: 80,    
    xPlus: 165,
    x5: 252,   // 统一对齐，解决视觉偏移
    xEqual: 340,
    xBox: 450, 
    yRow1: 60, 
    xBranchL: 200, 
    xBranchR: 300, 
    yRow2: 200,    
    yBracketBottom: 310 
  };

  return (
    <div className="flex flex-col items-center justify-between h-full py-4 overflow-hidden select-none bg-white relative">
      <div className="text-center mb-1 flex-shrink-0">
        <h2 className="text-5xl font-black kids-font text-sky-900 mb-1">探究新知：算理分解图</h2>
        <p className="text-xl text-gray-400 font-bold">点击方框，使用右侧小键盘填入数字</p>
      </div>
      
      <div className="flex flex-row items-center justify-center w-full max-w-[1200px] flex-1 min-h-0 space-x-12 px-6">
        
        <div className="relative w-[560px] h-[420px] border-4 border-sky-50 rounded-[3rem] shadow-sm bg-slate-50/30">
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 560 420">
            {/* V形线：起点 layout.x5 对齐数字中心 */}
            <path 
              d={`M${layout.x5},${layout.yRow1 + 45} L${layout.xBranchL + 15},${layout.yRow2 - 40} M${layout.x5},${layout.yRow1 + 45} L${layout.xBranchR - 15},${layout.yRow2 - 40}`} 
              stroke="#666" strokeWidth="2.5" fill="none" strokeLinecap="round" 
            />
            {/* L形线：起点 layout.x8 对齐数字中心 */}
            <path 
              d={`M${layout.x8},${layout.yRow1 + 45} L${layout.x8},${layout.yBracketBottom} L${layout.xBranchL},${layout.yBracketBottom} L${layout.xBranchL},${layout.yRow2 + 45}`} 
              stroke="#666" strokeWidth="2.5" fill="none" strokeLinecap="round"
            />
          </svg>

          <div className="absolute text-[7rem] font-black text-gray-800 leading-none" style={{ left: layout.x8, top: layout.yRow1, transform: 'translate(-50%, -50%)' }}>8</div>
          <div className="absolute text-[5rem] font-bold text-gray-300 leading-none" style={{ left: layout.xPlus, top: layout.yRow1, transform: 'translate(-50%, -50%)' }}>+</div>
          <div className="absolute text-[7rem] font-black text-gray-800 leading-none" style={{ left: layout.x5, top: layout.yRow1, transform: 'translate(-50%, -50%)' }}>5</div>
          <div className="absolute text-[5rem] font-bold text-gray-300 leading-none" style={{ left: layout.xEqual, top: layout.yRow1, transform: 'translate(-50%, -50%)' }}>=</div>
          
          <div 
            onClick={() => !isCorrect && setActiveField('finalSum')}
            className={`absolute flex items-center justify-center cursor-pointer transition-all duration-200 border-4 rounded-xl w-32 h-32 ${activeField === 'finalSum' ? 'border-sky-500 bg-sky-50 ring-4 ring-sky-200 shadow-lg scale-105' : isCorrect ? 'border-green-500 bg-green-50' : 'border-gray-400 bg-white shadow-sm'}`}
            style={{ left: layout.xBox, top: layout.yRow1, transform: 'translate(-50%, -50%)' }}
          >
            <span className={`text-6xl font-black ${isCorrect ? 'text-green-700' : 'text-gray-800'}`}>{finalSum}</span>
          </div>

          <div 
            onClick={() => !isCorrect && setActiveField('val1')}
            className={`absolute flex items-center justify-center cursor-pointer transition-all duration-200 border-4 rounded-xl w-20 h-20 ${activeField === 'val1' ? 'border-sky-500 bg-sky-50 ring-4 ring-sky-200 shadow-lg scale-110' : isCorrect ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-white shadow-sm'}`}
            style={{ left: layout.xBranchL, top: layout.yRow2, transform: 'translate(-50%, -50%)' }}
          >
            <span className={`text-5xl font-black ${isCorrect ? 'text-green-700' : 'text-gray-800'}`}>{val1}</span>
          </div>

          <div 
            onClick={() => !isCorrect && setActiveField('val2')}
            className={`absolute flex items-center justify-center cursor-pointer transition-all duration-200 border-4 rounded-xl w-20 h-20 ${activeField === 'val2' ? 'border-sky-500 bg-sky-50 ring-4 ring-sky-200 shadow-lg scale-110' : isCorrect ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-white shadow-sm'}`}
            style={{ left: layout.xBranchR, top: layout.yRow2, transform: 'translate(-50%, -50%)' }}
          >
            <span className={`text-5xl font-black ${isCorrect ? 'text-green-700' : 'text-gray-800'}`}>{val2}</span>
          </div>

          <div 
            onClick={() => !isCorrect && setActiveField('valSumTen')}
            className={`absolute flex items-center justify-center cursor-pointer transition-all duration-200 border-4 rounded-xl w-24 h-16 ${activeField === 'valSumTen' ? 'border-red-500 bg-red-50 ring-4 ring-red-200 shadow-lg scale-110' : isCorrect ? 'border-green-500 bg-green-50' : 'border-red-300 bg-white shadow-sm'}`}
            style={{ left: (layout.x8 + layout.xBranchL) / 2, top: layout.yBracketBottom + 35, transform: 'translate(-50%, -50%)' }}
          >
            <span className={`text-4xl font-black ${isCorrect ? 'text-green-700' : 'text-red-500'}`}>{valSumTen}</span>
          </div>
        </div>

        <div className="flex flex-col space-y-6 w-80">
          <div className="bg-red-50/50 p-6 rounded-3xl border-2 border-red-100 flex flex-col space-y-2">
             <p className="text-4xl font-black text-red-500 kids-font leading-relaxed">
                <span className="text-red-600">想：</span>8 加 2 得 10，
             </p>
             <p className="text-4xl font-black text-red-500 kids-font leading-relaxed ml-12">
                10 加 3 得 13。
             </p>
          </div>

          <div className="bg-white p-4 rounded-[2rem] shadow-xl border-4 border-sky-100 grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(n => (
              <button
                key={n}
                disabled={isCorrect}
                onClick={() => handleKeyClick(n.toString())}
                className={`h-16 text-3xl font-black bg-sky-50 rounded-xl transition-all shadow-sm border-b-4 border-sky-200 ${isCorrect ? 'opacity-50 grayscale' : 'hover:bg-sky-200 text-sky-800 active:scale-95'}`}
              >
                {n}
              </button>
            ))}
            <button
              disabled={isCorrect}
              onClick={() => handleKeyClick('DEL')}
              className={`col-span-2 h-16 text-2xl font-black bg-red-50 rounded-xl transition-all shadow-sm border-b-4 border-red-200 ${isCorrect ? 'opacity-50 grayscale' : 'hover:bg-red-100 text-red-600 active:scale-95'}`}
            >
              ← 删除
            </button>
          </div>
        </div>
      </div>

      <div className="w-full flex-shrink-0 flex flex-col items-center space-y-2 px-8">
        {!isCorrect ? (
          <button 
            onClick={check} 
            className="bg-orange-500 text-white px-24 py-4 rounded-full text-4xl font-black shadow-lg hover:bg-orange-600 active:scale-95 transition-all border-b-8 border-orange-800"
          >
            确定算理
          </button>
        ) : (
          <button 
            onClick={onComplete} 
            className="bg-gradient-to-r from-green-500 to-emerald-700 text-white px-28 py-5 rounded-full text-5xl font-black shadow-2xl hover:scale-105 active:scale-95 transition-all border-b-8 border-emerald-900 animate-pulse"
          >
            做一做
          </button>
        )}
        <NavButtons onPrev={onPrev} />
      </div>

      {feedback && (
        <FeedbackToast 
          message={feedback} 
          type={feedback.includes('太棒了') ? 'success' : 'error'} 
          position="left"
        />
      )}
    </div>
  );
};

export default TreeDiagram;
