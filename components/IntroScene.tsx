
import React, { useState, useEffect, useRef } from 'react';
import { NavButtons } from './CommonUI';

// 跑步小朋友组件
const RunningKid: React.FC<{ x: number; y: number; color: string; gender: 'boy' | 'girl'; scale?: number }> = ({ x, y, color, gender, scale = 1 }) => {
  const isBlue = color === 'blue';
  const clothColor = isBlue ? '#4dabf7' : '#ffc021'; 

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <g transform="skewX(-5)">
        <path d="M-5,10 L-15,35 L-25,30" stroke="#333" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5,10 L15,30 L25,40" stroke="#333" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-15,-25 L15,-28 L18,10 L-12,12 Z" fill={clothColor} stroke="#333" strokeWidth="2.5" />
        <path d="M-12,-20 L-25,0" stroke="#333" strokeWidth="5" strokeLinecap="round" />
        <path d="M12,-22 L25,-5" stroke="#333" strokeWidth="5" strokeLinecap="round" />
      </g>
      <g transform="translate(5, -45)">
        <circle cx="0" cy="0" r="18" fill="#FFE0BD" stroke="#333" strokeWidth="2" />
        {gender === 'boy' ? (
          <path d="M-18,0 Q-18,-25 0,-25 Q18,-25 18,0" fill="#444" />
        ) : (
          <g>
            <path d="M-18,0 Q-18,-25 0,-25 Q18,-25 18,0" fill="#444" />
            <path d="M-18,-5 Q-25,-15 -20,-25" stroke="#444" strokeWidth="8" fill="none" strokeLinecap="round" />
          </g>
        )}
        <circle cx="6" cy="-2" r="2" fill="#333" />
        <path d="M8,8 Q12,8 12,5" stroke="#333" strokeWidth="2" fill="none" />
      </g>
    </g>
  );
};

// 修正坐标后的插图，确保所有人都在 1600x900 范围内
const RunningIllustration = () => (
  <svg viewBox="0 0 1600 900" className="w-full h-full bg-white select-none rounded-[3rem]">
    <rect width="1600" height="900" fill="white" />
    <path d="M-100,200 L1700,950" stroke="#f8fafc" strokeWidth="300" fill="none" />
    <path d="M-100,100 L1700,850" stroke="#f1f5f9" strokeWidth="5" fill="none" strokeDasharray="20,20" />

    {/* 后方小组：5人 (向左移动并微调坐标) */}
    <g transform="translate(80, 120)">
      <RunningKid x={40} y={40} color="blue" gender="boy" scale={1.1} />
      <RunningKid x={180} y={130} color="blue" gender="boy" scale={1.1} />
      <RunningKid x={320} y={60} color="yellow" gender="girl" scale={1.1} />
      <RunningKid x={460} y={160} color="yellow" gender="boy" scale={1.1} />
      <RunningKid x={580} y={50} color="blue" gender="boy" scale={1.1} />
    </g>

    {/* 前方小组：8人 (将 translate 的 X 从 550 移至 450，并压缩内部间距) */}
    <g transform="translate(450, 320)">
      {/* 第一排 4人 */}
      <RunningKid x={200} y={80} color="blue" gender="boy" scale={1.2} />
      <RunningKid x={420} y={60} color="blue" gender="boy" scale={1.2} />
      <RunningKid x={640} y={120} color="yellow" gender="girl" scale={1.2} />
      <RunningKid x={860} y={180} color="blue" gender="boy" scale={1.2} />
      
      {/* 第二排 4人 */}
      <RunningKid x={300} y={300} color="yellow" gender="girl" scale={1.3} />
      <RunningKid x={520} y={370} color="blue" gender="boy" scale={1.3} />
      <RunningKid x={740} y={320} color="yellow" gender="girl" scale={1.3} />
      <RunningKid x={960} y={420} color="blue" gender="boy" scale={1.3} />
    </g>
  </svg>
);

interface IntroSceneProps {
  onComplete: () => void;
}

const IntroScene: React.FC<IntroSceneProps> = ({ onComplete }) => {
  const [showEquation, setShowEquation] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = 12;
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)'; 
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const getPos = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const startDrawing = (e: any) => {
    if (!isDrawingMode) return;
    isDrawing.current = true;
    lastPos.current = getPos(e);
  };

  const draw = (e: any) => {
    if (!isDrawing.current || !isDrawingMode) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPos.current = pos;
  };

  return (
    <div className="flex flex-col h-full animate-fade-in overflow-hidden">
      <div className="flex justify-between items-center border-b-4 border-sky-50 pb-2 flex-shrink-0">
        <div>
          <h2 className="text-4xl font-black kids-font text-sky-800">情景导入：跑步比赛</h2>
          <p className="text-2xl text-gray-500 font-bold">前面有 8 人，后面有 5 人，一共多少人？</p>
        </div>
        <div className="flex space-x-4">
           <button 
             onClick={() => setIsDrawingMode(!isDrawingMode)} 
             className={`px-8 py-3 rounded-full font-black text-2xl border-4 transition-all shadow-sm ${isDrawingMode ? 'bg-red-500 text-white border-red-300' : 'bg-white text-gray-500 border-gray-100'}`}
           >
             {isDrawingMode ? '🎨 正在圈画' : '✏️ 圈一圈'}
           </button>
           <button 
             onClick={() => canvasRef.current?.getContext('2d')?.clearRect(0,0,9999,9999)} 
             className="bg-white text-gray-400 px-8 py-3 rounded-full border-4 border-gray-100 font-black text-2xl"
           >
             🗑️ 擦除
           </button>
        </div>
      </div>

      <div className="flex items-stretch space-x-6 flex-1 min-h-0 mt-4 overflow-hidden">
        <div className="relative flex-[2.6] bg-white rounded-[2rem] overflow-hidden shadow-inner border-4 border-sky-50 flex items-center justify-center">
          <RunningIllustration />
          <canvas 
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={() => { isDrawing.current = false; }}
            onMouseLeave={() => { isDrawing.current = false; }}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={() => { isDrawing.current = false; }}
            className={`absolute inset-0 z-20 ${isDrawingMode ? 'cursor-crosshair' : 'pointer-events-none'}`}
          />
        </div>

        <div className="flex-[1.4] flex flex-col space-y-4">
          <div className="bg-white p-8 rounded-[3rem] shadow-xl border-8 border-sky-50 flex-1 flex flex-col items-center justify-center space-y-10">
            {!showEquation ? (
              <div className="flex flex-col items-center space-y-8">
                <div className="w-40 h-40 bg-sky-100 rounded-full flex items-center justify-center animate-bounce shadow-inner">
                  <span className="text-8xl">💡</span>
                </div>
                <button 
                  onClick={() => setShowEquation(true)} 
                  className="bg-sky-500 text-white px-16 py-6 rounded-[2rem] font-black text-4xl shadow-[0_12px_0_#0369a1] active:translate-y-2 active:shadow-none transition-all"
                >
                  列式反馈
                </button>
                <p className="text-gray-400 font-bold text-2xl">点击看看算式怎么列？</p>
              </div>
            ) : (
              <div className="animate-fade-in w-full flex flex-col items-center space-y-12">
                <div className="relative flex flex-col items-center w-full">
                  <div className="flex items-center justify-center space-x-2 md:space-x-4 mb-4">
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-black text-sky-500 mb-2">前面</span>
                      <div className="w-1 h-6 bg-sky-200 rounded-full mb-2"></div>
                      <span className="text-7xl md:text-8xl font-black text-sky-800">8</span>
                    </div>
                    <span className="text-5xl md:text-6xl font-black text-sky-300 mt-10">+</span>
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-black text-orange-500 mb-2">后面</span>
                      <div className="w-1 h-6 bg-orange-200 rounded-full mb-2"></div>
                      <span className="text-7xl md:text-8xl font-black text-sky-800">5</span>
                    </div>
                    <span className="text-5xl md:text-6xl font-black text-sky-300 mt-10">=</span>
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-black text-green-600 mb-2">一共</span>
                      <div className="w-1 h-6 bg-green-200 rounded-full mb-2"></div>
                      <span className="text-8xl md:text-9xl font-black text-red-500">13</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 px-10 py-6 rounded-3xl border-4 border-green-200 text-center shadow-sm">
                  <p className="text-4xl font-black text-green-700 kids-font tracking-wide">算得快：8 + 5 = 13</p>
                </div>
                
                <button 
                  onClick={() => setShowEquation(false)}
                  className="text-gray-400 font-bold text-xl hover:text-sky-500 underline decoration-dotted"
                >
                  隐藏解析
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-shrink-0">
        <NavButtons onNext={onComplete} />
      </div>
    </div>
  );
};

export default IntroScene;
