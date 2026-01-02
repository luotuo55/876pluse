
import React, { useState } from 'react';
import { NavButtons, FeedbackToast } from './CommonUI';

const ComparisonSection: React.FC<{ onComplete: () => void; onPrev: () => void }> = ({ onComplete, onPrev }) => {
  const [answers, setAnswers] = useState({
    a1: '', a2: '',
    b1: '', b2: '',
    c1: '', c2: ''
  });
  const [showSummary, setShowSummary] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [activeField, setActiveField] = useState<keyof typeof answers | null>(null);
  const [showKeypad, setShowKeypad] = useState(false);

  const check = () => {
    const isCorrect = 
      answers.a1 === '13' && answers.a2 === '13' &&
      answers.b1 === '12' && answers.b2 === '12' &&
      answers.c1 === '12' && answers.c2 === '12';

    if (isCorrect) {
      setFeedback('全对了！你真是个天才。');
      setShowSummary(true);
      setShowKeypad(false);
      setActiveField(null);
    } else {
      setFeedback('有的小算式写错了，再仔细检查一下！');
    }
  };

  const handleInputClick = (field: keyof typeof answers) => {
    if (showSummary) return;
    setActiveField(field);
    setShowKeypad(true);
  };

  const handleKeyClick = (num: string) => {
    if (!activeField || showSummary) return;
    
    if (num === 'DEL') {
      setAnswers(prev => ({ ...prev, [activeField]: prev[activeField].slice(0, -1) }));
      return;
    }

    if (feedback) setFeedback(null);
    setAnswers(prev => ({ ...prev, [activeField]: (prev[activeField] + num).slice(0, 2) }));
  };

  const ExerciseGroup = ({ label, num1, num2, num3, sum, k1, k2 }: any) => (
    <div className="bg-white p-8 rounded-[3rem] border-4 border-sky-100 shadow-lg flex flex-col space-y-6">
      <div className="flex items-center justify-between space-x-2 text-4xl font-black">
        <span className="text-gray-500 whitespace-nowrap">{num1}+{num2}+{num3} =</span>
        <div 
          onClick={() => handleInputClick(k1)}
          className={`w-24 h-16 flex items-center justify-center cursor-pointer transition-all border-4 rounded-xl ${activeField === k1 ? 'border-sky-500 bg-sky-50 ring-4 ring-sky-100' : 'border-gray-200 bg-sky-50/30'}`}
        >
          <span className="text-sky-600">{answers[k1 as keyof typeof answers]}</span>
        </div>
      </div>
      <div className="h-1 bg-gray-100 rounded-full opacity-50"></div>
      <div className="flex items-center justify-between space-x-2 text-5xl font-black">
        <span className="text-sky-800 whitespace-nowrap">{num1}+{sum} =</span>
        <div 
          onClick={() => handleInputClick(k2)}
          className={`w-24 h-20 flex items-center justify-center cursor-pointer transition-all border-4 rounded-xl ${activeField === k2 ? 'border-sky-500 bg-sky-50 ring-4 ring-sky-100' : 'border-sky-600 bg-orange-50'}`}
        >
          <span className="text-sky-800">{answers[k2 as keyof typeof answers]}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-between h-full py-2 animate-fade-in overflow-hidden relative">
      <div className="text-center space-y-2 flex-shrink-0">
        <h2 className="text-5xl font-black kids-font text-sky-800 tracking-tighter">对比练习：我的新发现</h2>
        <p className="text-2xl text-gray-500 font-bold">计算下面的题目，看看你能发现什么奥秘？</p>
      </div>

      <div className="grid grid-cols-3 gap-6 w-full max-w-[1300px] mt-4 px-4">
        <ExerciseGroup num1="7" num2="3" num3="3" sum="6" k1="a1" k2="a2" />
        <ExerciseGroup num1="6" num2="4" num3="2" sum="6" k1="b1" k2="b2" />
        <ExerciseGroup num1="8" num2="2" num3="2" sum="4" k1="c1" k2="c2" />
      </div>

      <div className="w-full flex flex-col items-center space-y-4 mt-6">
        {!showSummary ? (
          <button 
            onClick={check}
            className="bg-sky-500 text-white px-20 py-4 rounded-full font-black text-3xl shadow-lg hover:bg-sky-600 transition-all border-b-8 border-sky-900 active:scale-95"
          >
            检查所有答案
          </button>
        ) : (
          <div className="bg-green-600 px-8 py-6 rounded-[2.5rem] border-4 border-white shadow-xl animate-fade-in w-full max-w-[1000px] text-center">
            <p className="text-3xl text-white font-black kids-font mb-1 tracking-wide">💡 我的新发现：</p>
            <p className="text-2xl text-white font-bold leading-tight">
              两排题目结果一样！原来第二排就是把第一排后面的两个数合起来了。
            </p>
          </div>
        )}
      </div>

      <div className="w-full px-8">
        <NavButtons onPrev={onPrev} onNext={onComplete} />
      </div>

      {/* 底部数字小键盘 */}
      <div className={`absolute bottom-0 left-0 right-0 p-6 bg-white/95 backdrop-blur-md border-t-4 border-sky-100 shadow-2xl transition-transform duration-500 z-[100] ${showKeypad ? 'translate-y-0' : 'translate-y-full'}`}>
         <div className="max-w-[400px] mx-auto">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-bold text-sky-400">请填入数字</span>
              <button onClick={() => setShowKeypad(false)} className="bg-sky-500 text-white px-6 py-2 rounded-full font-black text-lg shadow-md">确认 ✓</button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(n => (
                <button 
                  key={n} 
                  onClick={() => handleKeyClick(n.toString())} 
                  className="h-14 text-3xl font-black bg-slate-50 rounded-2xl border-b-4 border-slate-200 hover:bg-sky-100 active:translate-y-1 transition-all"
                >
                  {n}
                </button>
              ))}
              <button onClick={() => handleKeyClick('DEL')} className="col-span-2 h-14 text-xl font-black bg-red-50 text-red-600 rounded-2xl border-b-4 border-red-200">← 删除</button>
            </div>
         </div>
      </div>

      {feedback && <FeedbackToast message={feedback} type={feedback.includes('全对') ? 'success' : 'error'} position="bottom" />}
    </div>
  );
};

export default ComparisonSection;
