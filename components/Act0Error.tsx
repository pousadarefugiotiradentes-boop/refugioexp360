
import React, { useState } from 'react';
import { ShieldAlert, Power, AlertTriangle, Heart } from 'lucide-react';

interface Act0ErrorProps {
  onComplete: () => void;
}

const Act0Error: React.FC<Act0ErrorProps> = ({ onComplete }) => {
  const [accepted, setAccepted] = useState(false);
  const [isShuttingDown, setIsShuttingDown] = useState(false);

  const handleStartProcess = () => {
    setIsShuttingDown(true);
    setTimeout(() => onComplete(), 1500);
  };

  if (isShuttingDown) {
    return (
      <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center font-mono text-[#8EFF8E]">
        <div className="w-8 h-8 border-2 border-[#8EFF8E]/20 border-t-[#8EFF8E] rounded-full animate-spin mb-4"></div>
        <p className="text-[10px] tracking-widest animate-pulse uppercase">
          > INITIATING_BIO_SYNC...
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 bg-black text-white h-screen overflow-hidden relative font-sans selection:bg-[#8EFF8E] selection:text-black">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
      
      <div className="max-w-md w-full p-8 md:p-10 relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="flex items-center justify-start mb-12">
           <div className="flex items-center gap-2 text-[#FFA500] font-bold text-sm uppercase tracking-wider">
             <AlertTriangle className="w-4 h-4 animate-pulse" />
             <span>ERROR: Alto nível de stress detectado</span>
           </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-red-500 mb-1">
              <ShieldAlert className="w-5 h-5" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] font-mono">CRITICAL_OVERLOAD | SOBRECARGA CRÍTICA</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[0.85] italic text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              STRESS<br/>
              DETECTADO<span className="text-red-600">_</span>
            </h1>
          </div>

          <div className="space-y-6">
            <div className="text-[14px] leading-relaxed text-zinc-400">
              <div className="font-mono mb-4 text-[#8EFF8E]/80 text-[12px] leading-relaxed">
                <span className="bg-[#8EFF8E]/20 text-[#8EFF8E] px-1 font-bold mr-2 border border-[#8EFF8E]/30">LOG:</span> 
                Atividade biométrica irregular. Seus níveis de cortisol estão acima dos limites saudáveis. Recomendamos realizar uma respiração profunda e reiniciar seu sistema.
              </div>
            </div>

            <div className="space-y-4">
              <label 
                className={`flex items-start space-x-[12px] cursor-pointer group p-5 pl-[20px] bg-zinc-900/60 border rounded-2xl transition-all duration-500
                  ${accepted 
                    ? 'border-[#8EFF8E]/50 bg-zinc-800/80 shadow-[0_0_20px_rgba(142,255,142,0.1)]' 
                    : 'border-red-900/40 animate-pulse-red'
                  }
                `}
              >
                <div className="relative mt-1 shrink-0">
                  <input 
                    type="checkbox" 
                    className="w-6 h-6 bg-black border-2 border-zinc-700 cursor-pointer appearance-none checked:bg-[#8EFF8E] checked:border-[#8EFF8E] transition-all rounded-lg"
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                  />
                  {accepted && (
                    <span className="absolute inset-0 flex items-center justify-center text-black font-black text-xs pointer-events-none">
                      ✓
                    </span>
                  )}
                </div>
                <span className={`text-[11px] leading-tight transition-colors uppercase font-mono font-bold pt-1
                  ${accepted ? 'text-[#8EFF8E]' : 'text-zinc-400 group-hover:text-red-400'}
                `}>
                  Confesso que NÃO LI mas CONCORDO com os termos de uso.
                </span>
              </label>

              <button 
                disabled={!accepted}
                onClick={handleStartProcess}
                className={`w-full py-[16px] px-[24px] pl-[20px] rounded-2xl font-black text-sm transition-all flex items-center justify-start space-x-[12px] uppercase tracking-[0.2em] italic
                  ${accepted 
                    ? 'bg-zinc-800 border-2 border-[#8EFF8E] text-white shadow-[0_0_40px_rgba(142,255,142,0.2)] hover:scale-[1.02] active:scale-[0.98]' 
                    : 'bg-zinc-900/90 border border-zinc-700 text-zinc-500 cursor-not-allowed opacity-90'
                  }`}
              >
                <Power className="w-6 h-6 shrink-0" />
                <span>INICIAR REINICIALIZAÇÃO PROFUNDA</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-white/5 flex justify-center items-center text-[11px] text-zinc-500 font-normal">
          <span>Feito com <Heart className="inline w-3 h-3 text-red-500/80 mx-1 mb-0.5 fill-red-500/20" /> pel'O Forno</span>
        </div>
      </div>
    </div>
  );
};

export default Act0Error;
