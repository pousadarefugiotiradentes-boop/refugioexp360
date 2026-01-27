
import React, { useState, useEffect } from 'react';

interface Act0BreathingProps {
  onComplete: () => void;
}

const HeartbeatLine = () => {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-10 z-0 flex items-center overflow-hidden">
      <div className="flex animate-heartbeat-scroll whitespace-nowrap">
        {[...Array(6)].map((_, i) => (
          <svg key={i} width="400" height="200" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 shadow-[0_0_8px_#8EFF8E]">
            <path 
              d="M0 100 L150 100 L160 80 L170 120 L185 40 L200 160 L215 100 L230 110 L240 100 L400 100" 
              stroke="#8EFF8E" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </svg>
        ))}
      </div>
    </div>
  );
};

const Act0Breathing: React.FC<Act0BreathingProps> = ({ onComplete }) => {
  const [showWarning, setShowWarning] = useState(true);
  const [warningStep, setWarningStep] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [phase, setPhase] = useState<'inhale' | 'exhale'>('inhale');

  const warnings = [
    "REBOOT_PULMONAR",
    "VOCÊ ESTÁ RESPIRANDO?!",
    "RESPIRE COM O BALÃO!"
  ];

  const popups = [
    "Respire fundo!",
    "Respire bem fundo!",
    "Tem certeza que está respirando?"
  ];

  useEffect(() => {
    if (showWarning) {
      const timer = setInterval(() => {
        setWarningStep(prev => {
          if (prev < warnings.length - 1) return prev + 1;
          clearInterval(timer);
          setTimeout(() => setShowWarning(false), 1500);
          return prev;
        });
      }, 1200);
      return () => clearInterval(timer);
    }
  }, [showWarning]);

  useEffect(() => {
    if (showWarning) return;

    const totalCycles = 3; 
    const runCycle = (current: number) => {
      if (current >= totalCycles) {
        setTimeout(onComplete, 1500);
        return;
      }
      setPhase('inhale');
      setTimeout(() => {
        setPhase('exhale');
        setTimeout(() => {
          setCycle(current + 1);
          runCycle(current + 1);
        }, 2500);
      }, 2500);
    };
    runCycle(0);
  }, [showWarning, onComplete]);

  if (showWarning) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-black h-screen overflow-hidden p-6">
        <div className="text-center space-y-8 max-w-sm mx-auto">
          <div className="space-y-4">
            <h2 className={`text-3xl md:text-6xl font-black italic tracking-tighter uppercase leading-[0.9] transition-all duration-700 ${warningStep === 2 ? 'text-[#8EFF8E] scale-110 drop-shadow-[0_0_15px_rgba(142,255,142,0.5)]' : 'text-red-600'}`}>
              {warnings[warningStep]}
            </h2>
            <div className={`h-1 mx-auto rounded-full transition-all duration-700 ${warningStep === 2 ? 'bg-[#8EFF8E] w-32 shadow-[0_0_20px_#8EFF8E]' : 'bg-red-900 w-16'} animate-pulse`}></div>
          </div>
          <p className="text-[10px] text-zinc-600 font-mono tracking-[0.3em] uppercase">Iniciando protocolo de emergência...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-black h-screen overflow-hidden relative font-sans">
      <HeartbeatLine />
      <div className={`absolute inset-0 transition-all duration-[2500ms] ${phase === 'inhale' ? 'bg-[#8EFF8E]/5' : 'bg-black'}`}></div>
      
      <div className="text-center mb-16 space-y-2 relative z-30 px-6">
        <p className="text-[#8EFF8E] text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.4em] font-black uppercase mb-3 opacity-60">INICIANDO PROTOCOLO DE REINICIALIZAÇÃO PROFUNDA</p>
        <h2 className={`text-[#8EFF8E] font-black text-5xl md:text-8xl italic tracking-tighter uppercase transition-all duration-[2500ms] ${phase === 'inhale' ? 'scale-105 opacity-100' : 'scale-90 opacity-40'}`}>
          {phase === 'inhale' ? 'Inspire' : 'Expire'}
        </h2>
      </div>

      <div className="relative flex items-center justify-center">
        <div 
          className={`
            w-36 h-48 md:w-48 md:h-64 bg-gradient-to-br from-[#8EFF8E] via-[#4ade80] to-[#22c55e] 
            rounded-[45%_45%_55%_55%_/_40%_40%_60%_60%] 
            relative transition-all duration-[2500ms] ease-in-out z-10
            ${phase === 'inhale' ? 'scale-[1.6] shadow-[0_0_120px_rgba(142,255,142,0.4)]' : 'scale-100 shadow-[0_0_30px_rgba(142,255,142,0.1)]'}
          `}
        >
          <div className="absolute top-6 left-6 w-8 h-12 bg-white/30 rounded-full blur-xl opacity-40"></div>
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="text-black font-black text-xs md:text-base text-center uppercase italic tracking-tighter leading-none">
               {popups[cycle] || "CONCLUÍDO"}
            </div>
          </div>
        </div>

        {[1, 2].map((i) => (
          <div 
            key={i}
            className={`absolute rounded-full border border-[#8EFF8E]/10 transition-all duration-[2500ms] ${phase === 'inhale' ? 'scale-[2.8] opacity-0' : 'scale-100 opacity-20'}`}
            style={{ width: `${140 + i * 50}px`, height: `${180 + i * 50}px` }}
          ></div>
        ))}
      </div>

      <div className="mt-20 flex flex-col items-center space-y-8 relative z-30">
        <div className="flex space-x-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all duration-700 ${i < cycle ? 'bg-[#8EFF8E] scale-125 shadow-[0_0_12px_#8EFF8E]' : 'bg-zinc-800'}`} />
          ))}
        </div>
        <button onClick={onComplete} className="text-[#8EFF8E]/40 text-[9px] font-black uppercase tracking-[0.4em] italic hover:text-[#8EFF8E] transition-colors py-2 px-4 border border-transparent active:border-[#8EFF8E]/20 rounded-full">
          Pular Exercício
        </button>
      </div>
    </div>
  );
};

export default Act0Breathing;
