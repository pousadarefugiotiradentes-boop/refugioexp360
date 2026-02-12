import React, { useState, useEffect, useRef } from 'react';

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
  
  const cycleTimerRef = useRef<any>(null);
  const isTransitioningRef = useRef(false);

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

  const handleComplete = () => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    if (cycleTimerRef.current) clearTimeout(cycleTimerRef.current);
    onComplete();
  };

  useEffect(() => {
    if (showWarning) {
      const timer = setInterval(() => {
        setWarningStep(prev => {
          if (prev < warnings.length - 1) return prev + 1;
          clearInterval(timer);
          cycleTimerRef.current = setTimeout(() => setShowWarning(false), 1550);
          return prev;
        });
      }, 1850);
      return () => {
        clearInterval(timer);
        if (cycleTimerRef.current) clearTimeout(cycleTimerRef.current);
      };
    }
  }, [showWarning]);

  useEffect(() => {
    if (showWarning || isTransitioningRef.current) return;

    const totalCycles = 3; 
    const runCycle = (current: number) => {
      if (isTransitioningRef.current) return;
      if (current >= totalCycles) {
        cycleTimerRef.current = setTimeout(handleComplete, 1500);
        return;
      }
      setPhase('inhale');
      cycleTimerRef.current = setTimeout(() => {
        if (isTransitioningRef.current) return;
        setPhase('exhale');
        cycleTimerRef.current = setTimeout(() => {
          if (isTransitioningRef.current) return;
          setCycle(current + 1);
          runCycle(current + 1);
        }, 2500);
      }, 2500);
    };
    runCycle(0);
    return () => { if (cycleTimerRef.current) clearTimeout(cycleTimerRef.current); };
  }, [showWarning]);

  if (showWarning) {
    return (
      <div className={`flex-1 flex flex-col items-center justify-center bg-black h-screen overflow-hidden p-6 transition-colors duration-300 ${warningStep === 1 ? 'bg-red-950/20' : ''}`}>
        {warningStep === 1 && <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(255,0,0,0.3)] animate-pulse z-0"></div>}
        <div className="text-center space-y-6 md:space-y-8 max-w-sm mx-auto relative z-10 landscape:space-y-4">
          <div className="space-y-2 md:space-y-4">
            <h2 className={`text-2xl sm:text-3xl md:text-6xl font-black italic tracking-tighter uppercase leading-[0.9] transition-all duration-700 landscape:text-3xl
              ${warningStep === 1 ? 'text-red-500 scale-110 md:scale-125 animate-glitch' : ''}
              ${warningStep === 2 ? 'text-[#8EFF8E] scale-100 md:scale-110' : 'text-red-600'}
            `}>
              {warnings[warningStep]}
            </h2>
            <div className={`h-1 mx-auto rounded-full transition-all duration-700 
              ${warningStep === 1 ? 'bg-red-600 w-32 md:w-48' : ''}
              ${warningStep === 2 ? 'bg-[#8EFF8E] w-24 md:w-32' : 'bg-red-900 w-12'} 
              animate-pulse
            `}></div>
          </div>
          <p className="text-[8px] md:text-[10px] text-zinc-600 font-mono tracking-[0.3em] uppercase">Protocolo de emergência...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-black h-screen overflow-hidden relative font-sans p-4 landscape:flex-row landscape:gap-12">
      <HeartbeatLine />
      <div className={`absolute inset-0 transition-all duration-[2500ms] ${phase === 'inhale' ? 'bg-[#8EFF8E]/5' : 'bg-black'}`}></div>
      
      <div className="text-center mb-10 md:mb-16 space-y-2 relative z-30 px-6 landscape:mb-0 landscape:text-left landscape:px-0">
        <p className="text-[#8EFF8E] text-[8px] md:text-[10px] tracking-[0.2em] font-black uppercase mb-2 opacity-60">PROTOCOLO DE REINICIALIZAÇÃO</p>
        <h2 className={`text-[#8EFF8E] font-black text-4xl md:text-8xl italic tracking-tighter uppercase transition-all duration-[2500ms] landscape:text-5xl ${phase === 'inhale' ? 'scale-105 opacity-100' : 'scale-90 opacity-40'}`}>
          {phase === 'inhale' ? 'Inspire' : 'Expire'}
        </h2>
      </div>

      <div className="relative flex items-center justify-center landscape:scale-75">
        <div 
          className={`
            w-28 h-40 md:w-48 md:h-64 bg-gradient-to-br from-[#8EFF8E] via-[#4ade80] to-[#22c55e] 
            rounded-[45%_45%_55%_55%_/_40%_40%_60%_60%] 
            relative transition-all duration-[2500ms] ease-in-out z-10
            ${phase === 'inhale' ? 'scale-[1.5] shadow-[0_0_80px_rgba(142,255,142,0.4)]' : 'scale-100 shadow-[0_0_20px_rgba(142,255,142,0.1)]'}
          `}
        >
          <div className="absolute top-4 left-4 w-6 h-10 bg-white/25 rounded-full blur-lg opacity-30"></div>
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="text-black font-black text-[10px] md:text-base text-center uppercase italic tracking-tighter leading-none">
               {popups[cycle] || "CONCLUÍDO"}
            </div>
          </div>
        </div>

        {[1, 2].map((i) => (
          <div 
            key={i}
            className={`absolute rounded-full border border-[#8EFF8E]/10 transition-all duration-[2500ms] ${phase === 'inhale' ? 'scale-[2.5] opacity-0' : 'scale-100 opacity-20'}`}
            style={{ width: `${120 + i * 40}px`, height: `${160 + i * 40}px` }}
          ></div>
        ))}
      </div>

      <div className="mt-12 md:mt-20 flex flex-col items-center space-y-6 md:space-y-8 relative z-30 landscape:mt-0 landscape:items-end">
        <div className="flex space-x-2 md:space-x-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-700 ${i < cycle ? 'bg-[#8EFF8E] scale-125' : 'bg-zinc-800'}`} />
          ))}
        </div>
        <button onClick={handleComplete} className="text-[#8EFF8E]/40 text-[8px] font-black uppercase tracking-[0.4em] italic hover:text-[#8EFF8E] transition-colors py-2">
          Pular
        </button>
      </div>
    </div>
  );
};

export default Act0Breathing;