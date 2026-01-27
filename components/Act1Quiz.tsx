
import React, { useState } from 'react';
import { QUIZ_QUESTIONS, HERO_IMAGE_URL } from '../constants';
import { ChevronRight, Sparkles } from 'lucide-react';

interface Act1QuizProps {
  onComplete: (answers: Record<number, string>) => void;
}

const Act1Quiz: React.FC<Act1QuizProps> = ({ onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  
  const handleOptionSelect = (option: string) => {
    const newAnswers = { ...answers, [QUIZ_QUESTIONS[currentIdx].id]: option };
    setAnswers(newAnswers);

    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  const progress = ((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100;

  return (
    <div className="flex-1 flex flex-col relative min-h-screen overflow-hidden">
      {/* Background da Foto Real sincronizada via Constants */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-110 animate-[pan-bg_30s_infinite_alternate]"
        style={{ 
          backgroundImage: `url('${HERO_IMAGE_URL}'), url('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=2000')`,
          filter: 'brightness(0.25) saturate(0.6)'
        }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80 z-0" />

      <div className="relative z-10 flex-1 flex flex-col p-6 max-w-lg mx-auto w-full">
        <div className="mt-12 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em]">Protocolo de Iniciação</span>
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-amber-700 via-amber-500 to-amber-400 transition-all duration-700 ease-out shadow-[0_0_15px_rgba(245,158,11,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <h2 className="text-4xl md:text-5xl font-black text-white leading-[0.9] mb-12 drop-shadow-2xl italic tracking-tighter uppercase">
            {QUIZ_QUESTIONS[currentIdx].text}
          </h2>

          <div className="space-y-4">
            {QUIZ_QUESTIONS[currentIdx].options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionSelect(option)}
                className="w-full text-left p-6 md:p-8 rounded-[2rem] border border-white/10 bg-black/40 backdrop-blur-3xl hover:bg-amber-500/10 hover:border-amber-500/50 transition-all group flex items-center justify-between shadow-2xl relative overflow-hidden"
              >
                <span className="text-zinc-300 font-bold uppercase tracking-widest text-sm group-hover:text-white transition-colors">{option}</span>
                <ChevronRight className="w-6 h-6 text-amber-500 group-hover:translate-x-2 transition-all" />
              </button>
            ))}
          </div>
        </div>

        <footer className="py-12 text-center opacity-30">
          <p className="text-[9px] text-white uppercase tracking-[1em] font-black italic">
            Refúgio Tiradentes • Experiência Privada
          </p>
        </footer>
      </div>

      <style>{`
        @keyframes pan-bg {
          0% { transform: scale(1.15) translateX(-3%); }
          100% { transform: scale(1.15) translateX(3%); }
        }
      `}</style>
    </div>
  );
};

export default Act1Quiz;
