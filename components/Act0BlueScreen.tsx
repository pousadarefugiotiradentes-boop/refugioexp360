import React, { useEffect, useState, useRef } from 'react';
import { Monitor, Terminal } from 'lucide-react';

interface Act0BlueScreenProps {
  mode?: 'intro' | 'final';
  onComplete: () => void;
}

const Act0BlueScreen: React.FC<Act0BlueScreenProps> = ({ mode = 'intro', onComplete }) => {
  const [percentage, setPercentage] = useState(0);
  const errorAudioRef = useRef<HTMLAudioElement | null>(null);

  const ERROR_SFX_URL = "https://dl.dropboxusercontent.com/scl/fi/0h55rla37zwcxpuy57jv3/error-sound.mp3?rlkey=n1lmk8iwk3pef8k8blc4ognlg";

  useEffect(() => {
    const audio = new Audio(ERROR_SFX_URL);
    audio.volume = 0.6;
    errorAudioRef.current = audio;
    
    audio.play().catch(e => {
      console.warn("Autoplay do som de erro bloqueado ou falhou. Requer interação prévia.");
    });

    return () => {
      if (errorAudioRef.current) {
        errorAudioRef.current.pause();
        errorAudioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mode === 'intro') {
      const timer = setTimeout(onComplete, 5500);
      return () => clearTimeout(timer);
    }

    if (mode === 'final') {
      const interval = setInterval(() => {
        setPercentage(prev => {
          if (prev < 100) {
            const inc = Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 1;
            const next = Math.min(100, prev + inc);
            
            if (next === 100) {
              clearInterval(interval);
              setTimeout(onComplete, 1200); 
            }
            return next;
          }
          return 100;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [onComplete, mode]);

  if (mode === 'intro') {
    return (
      <div className="flex-1 flex flex-col bg-black h-screen overflow-hidden font-mono text-[#8EFF8E] p-6 relative selection:bg-[#8EFF8E] selection:text-black">
        <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,118,0.06))] bg-[length:100%_2px,3px_100%] opacity-40"></div>
        
        <div className="max-w-3xl w-full mx-auto flex flex-col h-full justify-between py-4 animate-in fade-in duration-300">
          <div>
            <div className="border-b border-[#8EFF8E]/30 pb-2 mb-4 flex justify-between items-center uppercase tracking-widest text-[10px]">
               <div className="flex items-center space-x-2">
                 <Terminal className="w-3 h-3" />
                 <span>OFORNO_OS_V.02.2026</span>
               </div>
               <span>64KB_RAM</span>
            </div>

            <div className="space-y-1 text-xs md:text-base">
              <p className="flex items-center space-x-2">
                <span className="bg-[#8EFF8E] text-black px-1 font-bold">FATAL ERROR</span>
                <span>at 0x27012026</span>
              </p>
              <p className="opacity-60 text-[10px]">*** STOP: 0x0000007B (0xF741B84C, 0xC0000034)</p>
            </div>

            <div className="mt-8 space-y-4">
              <h2 className="text-xl md:text-3xl font-black uppercase italic leading-tight text-white border-l-4 border-red-600 pl-4">
                INICIANDO SEQUÊNCIA DE<br/>
                RESPIRAÇÃO PROFUNDA!
              </h2>
              
              <div className="space-y-1 text-[10px] md:text-sm text-zinc-400">
                <p>&gt; Verificando atividade dos pulmões...</p>
                <p>&gt; Carregando balão de oxigênio</p>
                <p className="text-[#8EFF8E] animate-pulse">&gt; STATUS: Chamando SAMU...</p>
              </div>
            </div>
          </div>

          <div className="pb-8">
            <div className="w-full bg-zinc-900 h-1 relative overflow-hidden">
               <div className="absolute inset-0 bg-[#8EFF8E] animate-[loading-bar_2s_ease-in-out_infinite]"></div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end opacity-20 text-[7px] uppercase tracking-[0.3em]">
          <span>BIOS: 01/23/26</span>
          <span>(C) OFORNO_INDUSTRIES</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#0000AA] h-screen overflow-hidden font-mono text-white p-6 md:p-16 selection:bg-white selection:text-[#0000AA]">
      <div className="max-w-4xl w-full mx-auto flex flex-col h-full justify-between py-4 animate-in fade-in duration-500">
        <div className="space-y-4">
          <div className="bg-white text-[#0000AA] inline-block px-3 py-1 font-black text-lg">CRITICAL ERROR</div>
          <h1 className="text-2xl md:text-5xl font-black leading-tight uppercase tracking-tighter">PROBLEMA DETECTADO:</h1>
          
          <div className="space-y-4 text-sm md:text-xl font-bold leading-tight opacity-90">
            <p>Seu dispositivo detectou que você <span className="font-black">NÃO</span> respirou fundo o suficiente.</p>
            <p>Se é a primeira vez que vê essa tela, respire fundo novamente.</p>
            <p>Verifique se seu celular não está consumindo sua sanidade e desative todas as notificações relacionadas ao trabalho.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2 border-t border-white/20 pt-4">
            <p className="text-[10px] opacity-70">Informações Técnicas:</p>
            <p className="text-[9px] md:text-xs font-black tracking-widest uppercase opacity-80">*** STOP: 0x000000D1 (0x0000000C, 0xF765A908)</p>
            <p className="text-[9px] md:text-xs font-black tracking-widest uppercase opacity-80">*** STRESS_DRV.SYS - BASE AT F7650000, 20260123</p>
          </div>

          <div className="flex flex-col items-center space-y-4">
             <div className="w-full bg-white/10 h-10 border-2 border-white relative overflow-hidden">
                <div className="absolute inset-0 bg-white transition-all duration-300" style={{ width: `${Math.min(percentage, 100)}%` }}></div>
                <div className="absolute inset-0 flex items-center justify-center mix-blend-difference font-black text-xs">{Math.min(percentage, 100)}% CONCLUÍDO</div>
             </div>
             <p className="text-[8px] md:text-[10px] uppercase tracking-[0.4em] animate-pulse text-center">Chamando o SAMU...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Act0BlueScreen;