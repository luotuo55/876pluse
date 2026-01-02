
import React, { useState, useRef, useEffect } from 'react';
import { NavButtons, FeedbackToast } from './CommonUI';

// 饼干组件 (用于 7+4)
const Cookie: React.FC = () => (
  <div className="w-16 h-16 bg-amber-700 rounded-full border-4 border-amber-900 shadow-md relative flex items-center justify-center transition-transform hover:scale-110">
    {/* 饼干上的小点点 */}
    <div className="absolute top-3 left-4 w-2 h-2 bg-amber-950 rounded-full opacity-60" />
    <div className="absolute top-5 right-5 w-2 h-2 bg-amber-950 rounded-full opacity-60" />
    <div className="absolute bottom-4 left-6 w-2 h-2 bg-amber-950 rounded-full opacity-60" />
    <div className="absolute bottom-6 right-3 w-2 h-2 bg-amber-950 rounded-full opacity-60" />
    <div className="absolute top-8 left-2 w-2 h-2 bg-amber-950 rounded-full opacity-60" />
    <div className="w-12 h-12 rounded-full border-2 border-amber-800/30" />
  </div>
);

// 水瓶组件 (用于 6+5)
const Bottle: React.FC<{ color: string }> = ({ color }) => (
  <div className="w-12 h-20 relative flex flex-col items-center justify-end transition-transform hover:scale-110 drop-shadow-sm">
    {/* 瓶盖 */}
    <div className="w-6 h-3 bg-gray-100 rounded-t-sm border-2 border-gray-300 z-10" />
    {/* 瓶颈 */}
    <div className="w-4 h-2 bg-blue-100/80 border-x-2 border-blue-200 -mt-0.5" />
    {/* 瓶身 */}
    <div className={`w-12 h-14 rounded-lg border-2 border-blue-300 relative overflow-hidden ${color}`}>
      {/* 液体波纹感 */}
      <div className="absolute inset-0 bg-white/20 h-1/2 -rotate-12 translate-y-1" />
      {/* 红色标签 */}
      <div className="absolute top-1/2 left-0 right-0 h-5 bg-red-400 border-y border-red-500 flex items-center justify-center">
        <div className="w-full h-[1px] bg-red-300/50" />
      </div>
    </div>
  </div>
);

const CirclePractice: React.FC<{ onComplete: () => void; onPrev: () => void }> = ({ onComplete, onPrev }) => {
  const [stage, setStage] = useState(1); 
  const [isDrawingMode, setIsDrawingMode] = useState(true);
  
  const [val1, setVal1] = useState(''); 
  const [val2, setVal2] = useState(''); 
  const [valSumTen, setValSumTen] = useState(''); 
  const [finalSum, setFinalSum] = useState(''); 
  
  const [isStageDone, setIsStageDone] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [activeField, setActiveField] = useState<'val1' | 'val2' | 'valSumTen' | 'finalSum' | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const dotsData = stage === 1 
    ? { 
        left: 7, right: 4, target: 11, v1: '3', v2: '1', 
        item: 'cookie', color: 'bg-orange-400/80', 
        title: '圈一圈，算一算：7 + 4', 
        subtitle: '手动圈出10个饼干，再点击方框填写分解图',
        leftCols: 4, rightCols: 2 
      } 
    : { 
        left: 6, right: 5, target: 11, v1: '4', v2: '1', 
        item: 'bottle', color: 'bg-blue-400/80', 
        title: '圈一圈，算一算：6 + 5', 
        subtitle: '手动圈出10个瓶子，再点击方框填写分解图',
        leftCols: 3, rightCols: 3 
      };

  const layout = {
    xL: 80, xPlus: 165, xR: 252, xEqual: 340, xBox: 450,
    yRow1: 70, xBranchL: 200, xBranchR: 304, yRow2: 215, yBracketBottom: 335 
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const initCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) { canvas.width = parent.clientWidth; canvas.height = parent.clientHeight; }
    };
    initCanvas();
    window.addEventListener('resize', initCanvas);
    return () => window.removeEventListener('resize', initCanvas);
  }, [stage]);

  const handleInputClick = (field: typeof activeField) => {
    if (isStageDone) return;
    setActiveField(field);
    setShowKeypad(true);
  };

  const handleKeyClick = (num: string) => {
    if (!activeField) return;
    if (feedback) setFeedback(null);
    if (num === 'DEL') {
      if (activeField === 'val1') setVal1(prev => prev.slice(0, -1));
      if (activeField === 'val2') setVal2(prev => prev.slice(0, -1));
      if (activeField === 'valSumTen') setValSumTen(prev => prev.slice(0, -1));
      if (activeField === 'finalSum') setFinalSum(prev => prev.slice(0, -1));
      return;
    }
    if (activeField === 'val1') setVal1(num.slice(0, 1));
    if (activeField === 'val2') setVal2(num.slice(0, 1));
    if (activeField === 'valSumTen') setValSumTen(prev => (prev + num).slice(0, 2));
    if (activeField === 'finalSum') setFinalSum(prev => (prev + num).slice(0, 2));
  };

  const check = () => {
    const correct = val1 === dotsData.v1 && val2 === dotsData.v2 && valSumTen === '10' && finalSum === dotsData.target.toString();
    if (correct) {
      setFeedback(stage === 1 ? '太棒了！第一题正确。' : '恭喜你！全部做完了！');
      setIsStageDone(true);
      setShowKeypad(false);
      setActiveField(null);
    } else {
      if (val1 !== dotsData.v1) setFeedback(`凑十：${dotsData.left} 加几等于 10？`);
      else if (val2 !== dotsData.v2) setFeedback(`分解：${dotsData.right} 可以分成 ${dotsData.v1} 和几？`);
      else if (valSumTen !== '10') setFeedback('填：凑起来的 10 填入红色方框。');
      else setFeedback('算：最后的结果是多少？');
    }
  };

  const nextStage = () => {
    if (stage === 1) {
      setStage(2); setVal1(''); setVal2(''); setValSumTen(''); setFinalSum('');
      setIsStageDone(false); setShowKeypad(false); setFeedback(null);
      canvasRef.current?.getContext('2d')?.clearRect(0, 0, 9999, 9999);
    } else { onComplete(); }
  };

  return (
    <div className="flex flex-col items-center justify-between h-full py-2 overflow-hidden select-none bg-white">
      <div className="text-center mb-2 flex-shrink-0 w-full px-8">
        <h2 className="text-5xl font-black kids-font text-sky-900 mb-1">{dotsData.title}</h2>
        <p className="text-xl text-gray-400 font-bold">{dotsData.subtitle}</p>
      </div>

      <div className="flex flex-row items-center justify-center w-full max-w-[1500px] flex-1 min-h-0 space-x-8 px-6">
        <div className="flex-[1.6] h-[520px] bg-orange-50/40 rounded-[4.5rem] border-4 border-orange-100 relative shadow-inner flex items-center justify-center p-12 overflow-hidden">
          <div className="flex items-center space-x-16 pointer-events-none">
            <div className="grid gap-x-8 gap-y-12 items-center justify-center" style={{ gridTemplateColumns: `repeat(${dotsData.leftCols}, minmax(0, 1fr))` }}>
              {Array.from({ length: dotsData.left }).map((_, i) => (
                <div key={`l-${i}`} className="flex justify-center items-center h-20 w-16">
                  {dotsData.item === 'cookie' ? <Cookie /> : <Bottle color={dotsData.color} />}
                </div>
              ))}
            </div>
            <div className="w-16 h-1 flex-shrink-0" /> 
            <div className="grid gap-x-8 gap-y-12 items-center justify-center" style={{ gridTemplateColumns: `repeat(${dotsData.rightCols}, minmax(0, 1fr))` }}>
              {Array.from({ length: dotsData.right }).map((_, i) => (
                <div key={`r-${i}`} className="flex justify-center items-center h-20 w-16">
                  {dotsData.item === 'cookie' ? <Cookie /> : <Bottle color={dotsData.color} />}
                </div>
              ))}
            </div>
          </div>
          <canvas ref={canvasRef}
            onMouseDown={(e) => { if (isDrawingMode && !isStageDone) { isDrawing.current = true; lastPos.current = {x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY}; } }}
            onMouseMove={(e) => {
              if (!isDrawing.current) return;
              const ctx = canvasRef.current?.getContext('2d');
              if (ctx) {
                ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)'; ctx.lineWidth = 12; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(lastPos.current.x, lastPos.current.y);
                ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY); ctx.stroke();
                lastPos.current = {x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY};
              }
            }}
            onMouseUp={() => isDrawing.current = false}
            className={`absolute inset-0 z-20 ${isDrawingMode && !isStageDone ? 'cursor-crosshair' : 'pointer-events-none'}`}
          />
          <div className="absolute top-6 left-10 flex space-x-4 z-30">
            <button onClick={() => setIsDrawingMode(!isDrawingMode)} className={`px-8 py-3 rounded-full font-black text-2xl border-4 shadow-md ${isDrawingMode ? 'bg-red-500 text-white border-red-300' : 'bg-white text-gray-500 border-gray-100'}`}>{isDrawingMode ? '🎨 正在圈画' : '✏️ 圈一圈'}</button>
            <button onClick={() => canvasRef.current?.getContext('2d')?.clearRect(0,0,9999,9999)} className="bg-white text-gray-400 px-8 py-3 rounded-full border-4 border-gray-100 font-black text-2xl shadow-sm">🗑️ 擦除</button>
          </div>
        </div>

        <div className="flex-1 h-[520px] flex flex-col items-center justify-center bg-slate-50/50 rounded-[4rem] border-4 border-slate-100 shadow-sm relative overflow-hidden">
          <div className="relative w-[560px] h-[440px] translate-y-4">
             <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 560 440">
                <path d={`M${layout.xR},${layout.yRow1 + 50} L${layout.xBranchL + 12},${layout.yRow2 - 45} M${layout.xR},${layout.yRow1 + 50} L${layout.xBranchR - 12},${layout.yRow2 - 45}`} stroke="#666" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d={`M${layout.xL},${layout.yRow1 + 55} L${layout.xL},${layout.yBracketBottom} L${layout.xBranchL},${layout.yBracketBottom} L${layout.xBranchL},${layout.yRow2 + 45}`} stroke="#666" strokeWidth="3" fill="none" strokeLinecap="round" />
             </svg>

             <div className="absolute text-[7.5rem] font-black text-gray-800 leading-none" style={{ left: layout.xL, top: layout.yRow1, transform: 'translate(-50%, -50%)' }}>{dotsData.left}</div>
             <div className="absolute text-[5rem] font-bold text-gray-300 leading-none" style={{ left: layout.xPlus, top: layout.yRow1, transform: 'translate(-50%, -50%)' }}>+</div>
             <div className="absolute text-[7.5rem] font-black text-gray-800 leading-none" style={{ left: layout.xR, top: layout.yRow1, transform: 'translate(-50%, -50%)' }}>{dotsData.right}</div>
             <div className="absolute text-[5rem] font-bold text-gray-300 leading-none" style={{ left: layout.xEqual, top: layout.yRow1, transform: 'translate(-50%, -50%)' }}>=</div>

             {/* 结果输入框 */}
             <div onClick={() => handleInputClick('finalSum')} className={`absolute flex items-center justify-center cursor-pointer transition-all border-4 rounded-xl w-28 h-28 ${activeField === 'finalSum' ? 'border-sky-500 bg-sky-50 ring-8 ring-sky-100 scale-105' : isStageDone ? 'border-green-500 bg-green-50' : 'border-gray-400 bg-white shadow-sm'}`} style={{ left: layout.xBox, top: layout.yRow1, transform: 'translate(-50%, -50%)' }}>
               <span className={`text-6xl font-black ${isStageDone ? 'text-green-700' : 'text-gray-800'}`}>{finalSum}</span>
             </div>

             {/* 分解左输入框 */}
             <div onClick={() => handleInputClick('val1')} className={`absolute flex items-center justify-center cursor-pointer transition-all border-4 rounded-xl w-16 h-16 ${activeField === 'val1' ? 'border-sky-500 bg-sky-50 ring-8 ring-sky-100 scale-110' : isStageDone ? 'border-green-500 bg-green-50' : 'border-gray-500 bg-white shadow-sm'}`} style={{ left: layout.xBranchL, top: layout.yRow2, transform: 'translate(-50%, -50%)' }}>
               <span className={`text-4xl font-black ${isStageDone ? 'text-green-700' : 'text-gray-800'}`}>{val1}</span>
             </div>

             {/* 分解右输入框 */}
             <div onClick={() => handleInputClick('val2')} className={`absolute flex items-center justify-center cursor-pointer transition-all border-4 rounded-xl w-16 h-16 ${activeField === 'val2' ? 'border-sky-500 bg-sky-50 ring-8 ring-sky-100 scale-110' : isStageDone ? 'border-green-500 bg-green-50' : 'border-gray-500 bg-white shadow-sm'}`} style={{ left: layout.xBranchR, top: layout.yRow2, transform: 'translate(-50%, -50%)' }}>
               <span className={`text-4xl font-black ${isStageDone ? 'text-green-700' : 'text-gray-800'}`}>{val2}</span>
             </div>

             {/* 凑十汇总输入框 */}
             <div onClick={() => handleInputClick('valSumTen')} className={`absolute flex items-center justify-center cursor-pointer transition-all border-4 rounded-xl w-28 h-18 ${activeField === 'valSumTen' ? 'border-red-500 bg-red-50 ring-8 ring-red-100 scale-105' : isStageDone ? 'border-green-500 bg-green-50' : 'border-red-400 bg-white shadow-sm'}`} style={{ left: (layout.xL + layout.xBranchL) / 2, top: layout.yBracketBottom + 35, transform: 'translate(-50%, -50%)' }}>
               <span className={`text-4xl font-black ${isStageDone ? 'text-green-700' : 'text-red-500'}`}>{valSumTen}</span>
             </div>
          </div>

          <div className={`absolute bottom-0 left-0 right-0 p-6 bg-white/95 backdrop-blur-md border-t-4 border-sky-100 shadow-2xl transition-transform duration-500 z-[100] ${showKeypad ? 'translate-y-0' : 'translate-y-full'}`}>
             <div className="max-w-[400px] mx-auto">
                <div className="flex justify-between items-center mb-4"><span className="text-xl font-bold text-sky-400">正在填写过程...</span><button onClick={() => setShowKeypad(false)} className="bg-sky-500 text-white px-6 py-2 rounded-full font-black text-lg shadow-md">确认完成 ✓</button></div>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(n => (
                    <button key={n} onClick={() => handleKeyClick(n.toString())} className="h-14 text-3xl font-black bg-slate-50 rounded-2xl border-b-4 border-slate-200 hover:bg-sky-100 active:translate-y-1 transition-all">{n}</button>
                  ))}
                  <button onClick={() => handleKeyClick('DEL')} className="col-span-2 h-14 text-xl font-black bg-red-50 text-red-600 rounded-2xl border-b-4 border-red-200">← 删除</button>
                </div>
             </div>
          </div>
          {!showKeypad && !isStageDone && <div className="absolute bottom-6 animate-bounce text-sky-400 font-black text-xl">提示：点击横线和方框填写数字</div>}
        </div>
      </div>

      <div className="w-full flex-shrink-0 flex flex-col items-center space-y-3 mt-4">
        {!isStageDone ? (
          <button onClick={check} className="bg-orange-500 text-white px-28 py-4 rounded-full text-4xl font-black shadow-lg hover:bg-orange-600 active:scale-95 transition-all border-b-8 border-orange-800">检查闯关</button>
        ) : (
          <button onClick={nextStage} className="bg-gradient-to-r from-green-500 to-emerald-700 text-white px-32 py-5 rounded-full text-5xl font-black shadow-2xl hover:scale-105 active:scale-95 transition-all border-b-8 border-emerald-900 animate-pulse">{stage === 1 ? '下一题' : '完成全部练习'}</button>
        )}
        <div className="w-full px-12"><NavButtons onPrev={onPrev} /></div>
      </div>
      {feedback && <FeedbackToast message={feedback} type={feedback.includes('太棒了') || feedback.includes('恭喜') ? 'success' : 'error'} position="bottom" />}
    </div>
  );
};

export default CirclePractice;
