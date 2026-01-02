
import React from 'react';

interface ProgressHeaderProps {
  currentStep: number;
  totalSteps: number;
  title: string;
}

export const ProgressHeader: React.FC<ProgressHeaderProps> = ({ currentStep, totalSteps, title }) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="bg-white border-b-[8px] border-sky-200 px-16 h-full flex flex-col justify-center shadow-md">
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-5xl font-black text-sky-950 kids-font tracking-tight">{title}</h1>
        <div className="flex items-center space-x-6">
          <span className="text-3xl font-black text-sky-600 bg-sky-50 px-8 py-2 rounded-full border-2 border-sky-100 shadow-sm">
            {currentStep + 1} / {totalSteps}
          </span>
        </div>
      </div>
      <div className="w-full bg-sky-50 h-6 rounded-full overflow-hidden border-2 border-sky-100">
        <div 
          className="bg-gradient-to-r from-sky-400 to-blue-700 h-full transition-all duration-1000 ease-in-out" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

interface FeedbackToastProps {
  message: string; 
  type: 'success' | 'error' | 'info';
  position?: 'center' | 'left';
}

export const FeedbackToast: React.FC<FeedbackToastProps> = ({ message, type, position = 'center' }) => {
  const colors = {
    success: 'bg-green-600 text-white border-green-200',
    error: 'bg-red-600 text-white border-red-200',
    info: 'bg-blue-600 text-white border-blue-200'
  };

  const positionClasses = position === 'left' 
    ? 'top-[40%] left-[5%] translate-x-0 -translate-y-1/2' 
    : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';

  return (
    <div className={`fixed ${positionClasses} px-16 py-8 rounded-[3rem] border-[8px] shadow-[0_30px_60px_rgba(0,0,0,0.3)] z-[200] animate-bounce text-4xl font-black kids-font flex items-center justify-center text-center max-w-[400px] ${colors[type]}`}>
      {message}
    </div>
  );
};

export const NavButtons: React.FC<{ onNext?: () => void; onPrev?: () => void; nextDisabled?: boolean }> = ({ onNext, onPrev, nextDisabled }) => {
  return (
    <div className="flex justify-between items-center w-full mt-auto pt-6 pb-2">
      {onPrev ? (
        <button 
          onClick={onPrev}
          className="bg-gray-100 text-gray-500 text-4xl px-12 py-5 rounded-full hover:bg-gray-200 transition-all font-black border-2 border-transparent shadow-md active:scale-95"
        >
          ← 返回
        </button>
      ) : <div />}
      
      {onNext && (
        <button 
          onClick={onNext}
          disabled={nextDisabled}
          className={`px-20 py-5 rounded-full font-black text-4xl shadow-lg transition-all flex items-center space-x-4 ${nextDisabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-sky-500 to-blue-700 text-white hover:scale-105 active:scale-95 border-b-8 border-blue-900'}`}
        >
          <span>进入下一步</span>
          <span className="text-5xl">→</span>
        </button>
      )}
    </div>
  );
};
