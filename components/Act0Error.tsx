import React, { useState } from 'react';
import { ShieldAlert, Power, AlertTriangle } from 'lucide-react';

interface Act0ErrorProps {
  onComplete: () => void;
}

const Act0Error: React.FC<Act0ErrorProps> = ({ onComplete }) => {
  const [accepted, setAccepted] = useState(false);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [shouldShake, setShouldShake] = useState(false);

  const handleStartProcess = () => {
    if (!accepted) {
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 500);
      return;
    }
    
    setIsShuttingDown(true);
    setTimeout(() => onComplete(), 1500);
  };

  if (isShuttingDown) {
    return (
      <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center font-mono text-[#8EFF8E]">
        <div className="w-10 h-10 border-2 border-[#8EFF8E]/20 border-t-[#8EFF8E] rounded-full animate-spin mb-6"></div>
        <p className="text-sm md:text-lg tracking-widest animate-pulse uppercase">
          &gt; INITIATING_BIO_SYNC...
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-black text-white min-h-screen overflow-y-auto relative font-sans selection:bg-[#8EFF8E] selection:text-black">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
      
      <div className="max-w-xl w-full p-4 md:p-10 relative z-10 animate-in fade-in zoom-in duration-700 landscape:py-8">
        <div className="flex items-center justify-start mb-8 md:mb-14 landscape:mb-6">
           <div className="flex items-center gap-3 text-[#FFA500] font-bold text-sm md:text-lg uppercase tracking-wider">
             <AlertTriangle className="w-6 h-6 animate-pulse" />
             <span>Alto nível de stress detectado</span>
           </div>
        </div>

        <div className="space-y-8 md:space-y-12 landscape:space-y-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-red-500 mb-2">
              <ShieldAlert className="w-7 h-7" />
              <span className="text-xs md:text-sm font-black uppercase tracking-[0.2em] font-mono">CRITICAL_OVERLOAD</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] italic text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.1)] landscape:text-6xl">
              STRESS<br/>
              DETECTADO<span className="text-red-600">_</span>
            </h1>
          </div>

          <div className="space-y-8 landscape:space-y-6">
            <div className="text-base md:text-xl leading-relaxed text-zinc-400">
              <div className="font-mono mb-6 md:mb-8 text-[#8EFF8E]/80 text-sm md:text-lg leading-relaxed bg-[#8EFF8E]/5 p-6 border-l-4 border-[#8EFF8E]">
                <span className="bg-[#8EFF8E]/20 text-[#8EFF8E] px-2 font-bold mr-2">AVISO:</span> 
                Seus níveis de cortisol estão críticos. Recomendamos reiniciar seu sistema imediatamente e realizar uma respiração profunda.
              </div>
            </div>

            <div className="space-y-6 md:space-y-8">
              <label 
                className={`flex items-start space-x-[20px] cursor-pointer group p-6 md:p-10 bg-zinc-900/60 border rounded-[2rem] transition-all duration-500 landscape:p-6
                  ${shouldShake ? 'animate-shake border-red-500' : ''}
                  ${accepted 
                    ? 'border-[#8EFF8E]/50 bg-zinc-800/80 shadow-[0_0_30px_rgba(142,255,142,0.15)]' 
                    : !shouldShake ? 'border-white/5 hover:border-white/30' : ''
                  }
                `}
              >
                <div className="relative mt-1.5 shrink-0">
                  <input 
                    type="checkbox" 
                    className={`w-10 h-10 md:w-12 md:h-12 bg-black border-2 border-zinc-700 cursor-pointer appearance-none checked:bg-[#8EFF8E] checked:border-[#8EFF8E] transition-all rounded-xl
                      ${!accepted ? 'animate-pulse-highlight' : ''}
                    `}
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                  />
                  {accepted && (
                    <span className="absolute inset-0 flex items-center justify-center text-black font-black text-xl pointer-events-none">
                      ✓
                    </span>
                  )}
                </div>
                <span className={`text-base md:text-2xl leading-tight transition-all uppercase font-mono font-black pt-1
                  ${accepted 
                    ? 'text-[#8EFF8E]' 
                    : 'text-zinc-500 group-hover:text-white group-hover:brightness-150 group-hover:scale-[1.01] transform-gpu'
                  }
                `}>
                  confesso que não li e declaro que concordo com os termos de uso
                </span>
              </label>

              <button 
                onClick={handleStartProcess}
                className={`w-full py-7 md:py-9 px-8 rounded-[2rem] font-black text-xl md:text-2xl transition-all flex items-center justify-start space-x-5 uppercase tracking-[0.2em] italic
                  ${accepted 
                    ? 'bg-zinc-800 border-2 border-[#8EFF8E] text-white shadow-[0_0_50px_rgba(142,255,142,0.25)] hover:scale-[1.02] active:scale-[0.98]' 
                    : 'bg-zinc-900/90 border border-zinc-800 text-zinc-600 cursor-not-allowed'
                  }`}
              >
                <Power className="w-8 h-8 md:w-10 md:h-10 shrink-0" />
                <span>INICIAR REINICIALIZAÇÃO PROFUNDA</span>
              </button>
            </div>
          </div>
        </div>

        {/* Rodapé Padronizado com a Landing Page */}
        <div className="mt-16 md:mt-24 pt-10 border-t border-white/5 flex flex-col items-center gap-6 text-center opacity-40 hover:opacity-100 transition-opacity duration-700">
           <p className="text-[10px] text-zinc-700 uppercase tracking-[0.4em] font-black">
              Feito com ❤️ pel'O Forno
           </p>
        </div>
      </div>
    </div>
  );
};

export default Act0Error;