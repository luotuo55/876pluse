
import React, { useState } from 'react';
import { LessonStep } from './types';
import IntroScene from './components/IntroScene';
import StickMethod from './components/StickMethod';
import TreeDiagram from './components/TreeDiagram';
import CirclePractice from './components/CirclePractice';
import ComparisonSection from './components/ComparisonSection';
import { ProgressHeader } from './components/CommonUI';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<LessonStep>(LessonStep.INTRO);

  const steps = Object.values(LessonStep);
  const currentStepIdx = steps.indexOf(currentStep);
  const totalSteps = steps.length;

  const goToNext = () => {
    const nextIdx = currentStepIdx + 1;
    if (nextIdx < steps.length) {
      setCurrentStep(steps[nextIdx]);
      window.scrollTo(0, 0);
    }
  };

  const goToPrev = () => {
    const prevIdx = currentStepIdx - 1;
    if (prevIdx >= 0) {
      setCurrentStep(steps[prevIdx]);
      window.scrollTo(0, 0);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case LessonStep.INTRO:
        return (
          <IntroScene 
            onComplete={goToNext} 
          />
        );
      case LessonStep.STICK_METHOD:
        return <StickMethod onComplete={goToNext} onPrev={goToPrev} />;
      case LessonStep.TREE_DIAGRAM:
        return <TreeDiagram onComplete={goToNext} onPrev={goToPrev} />;
      case LessonStep.CIRCLE_PRACTICE:
        return <CirclePractice onComplete={goToNext} onPrev={goToPrev} />;
      case LessonStep.COMPARISON:
        return <ComparisonSection onComplete={goToNext} onPrev={goToPrev} />;
      case LessonStep.SUMMARY:
        return (
          <div className="flex flex-col items-center justify-center space-y-8 animate-fade-in h-full py-2">
            <div className="w-48 h-48 bg-yellow-400 rounded-full flex items-center justify-center text-[8rem] shadow-xl border-[12px] border-white ring-[15px] ring-yellow-100">
              🏆
            </div>
            <h2 className="text-6xl font-black kids-font text-sky-900 tracking-tight">课堂总结</h2>
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border-8 border-sky-100 w-full max-w-[1000px] text-center space-y-8">
              <p className="text-4xl text-gray-700 font-black mb-4">凑十口诀，牢记心间：</p>
              <div className="grid grid-cols-3 gap-8">
                <div className="bg-sky-50 p-8 rounded-[2rem] border-2 border-sky-200 shadow-sm">
                  <p className="text-sky-800 font-bold text-3xl mb-4">看到 8</p>
                  <p className="text-sky-600 font-black text-6xl">想到 2</p>
                </div>
                <div className="bg-sky-50 p-8 rounded-[2rem] border-2 border-sky-200 shadow-sm">
                  <p className="text-sky-800 font-bold text-3xl mb-4">看到 7</p>
                  <p className="text-sky-600 font-black text-6xl">想到 3</p>
                </div>
                <div className="bg-sky-50 p-8 rounded-[2rem] border-2 border-sky-200 shadow-sm">
                  <p className="text-sky-800 font-bold text-3xl mb-4">看到 6</p>
                  <p className="text-sky-600 font-black text-6xl">想到 4</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setCurrentStep(LessonStep.INTRO)}
              className="bg-sky-500 text-white px-24 py-6 rounded-full font-black text-4xl shadow-lg hover:bg-sky-600 transition-all active:scale-95 border-b-8 border-sky-800"
            >
              重新演示
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen h-screen flex flex-col bg-sky-100 font-sans text-gray-900 overflow-hidden select-none">
      <div className="h-[12vh] flex-shrink-0">
        <ProgressHeader 
          currentStep={currentStepIdx} 
          totalSteps={totalSteps} 
          title="《8、7、6 加几》—— 希沃白板互动课件" 
        />
      </div>
      
      <main className="flex-1 w-full p-4 flex items-stretch overflow-hidden">
        <div className="w-full h-full bg-white/95 rounded-[3rem] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.15)] border-[12px] border-white flex flex-col relative overflow-visible">
          {renderStep()}
        </div>
      </main>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.98) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        * {
          user-select: none;
          -webkit-user-drag: none;
        }
      `}</style>
    </div>
  );
};

export default App;
