
import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Zap, Terminal, ShieldX } from 'lucide-react';

interface Act6AutodestructProps {
  onComplete?: () => void;
}

const Act6Autodestruct: React.FC<Act6AutodestructProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [messageIdx, setMessageIdx] = useState(0);
  const [isDead, setIsDead] = useState(false);
  const errorAudioRef = useRef<HTMLAudioElement | null>(null);

  const ERROR_SFX_URL = "https://dl.dropboxusercontent.com/scl/fi/0h55rla37zwcxpuy57jv3/error-sound.mp3?rlkey=n1lmk8iwk3pef8k8blc4ognlg";

  const messages = [
    "Encerrando conversa...",
    "Eliminando todos os dados da conversa...",
    "Eliminando todos os dados do usuário...",
    "Fingindo que eliminei todos os dados...",
    "Apresentando uma mensagem polida ao usuário..."
  ];

  useEffect(() => {
    // Inicializa o som de erro
    const audio = new Audio(ERROR_SFX_URL);
    audio.volume = 0.7;
    errorAudioRef.current = audio;

    return () => {
      if (errorAudioRef.current) {
        errorAudioRef.current.pause();
        errorAudioRef.current = null;
      }
    };
  }, []);

  // Intervalo para trocar as mensagens de forma mais lenta
  useEffect(() => {
    const messageTimer = setInterval(() => {
      setMessageIdx(prev => {
        if (prev < messages.length - 1) return prev + 1;
        return prev;
      });
    }, 3500); // Mensagens duram mais tempo para aumentar a duração da tela

    return () => clearInterval(messageTimer);
  }, []);

  // Intervalo para o progresso da barra, com lógica de retroação
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          triggerShortCircuit();
          return 100;
        }

        // Lógica de progresso baseada na mensagem atual
        // Index 3: "Fingindo que eliminei todos os dados..."
        if (messageIdx === 3) {
          // Retroação da barra conforme solicitado
          return Math.max(10, prev - 0.7); 
        }

        // Se chegarmos na última mensagem, aceleramos para concluir o "erro"
        if (messageIdx === 4) {
          return Math.min(100, prev + 1.5);
        }

        // Progresso normal, agora significativamente mais lento
        return prev + 0.12;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [messageIdx]); // Re-executa para garantir que o setInterval use o messageIdx atualizado

  const triggerShortCircuit = () => {
    // Toca o som de erro no final do progresso
    if (errorAudioRef.current) {
      errorAudioRef.current.play().catch(() => {});
    }

    // Transição para a Oferta Final conforme correções anteriores
    if (onComplete) {
      setTimeout(onComplete, 1200);
    } else {
      // Fallback visual se não houver callback
      setTimeout(() => setIsDead(true), 1200);
    }
  };

  if (isDead) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-6 cursor-none select-none">
        <div className="w-1 h-1 bg-white rounded-full animate-ping opacity-20"></div>
        <p className="mt-8 text-zinc-900 font-mono text-[9px] uppercase tracking-[2em]">NO_SIGNAL</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-12 text-zinc-800 hover:text-zinc-600 transition-colors uppercase text-[10px] tracking-widest font-black"
        >
          Reiniciar Sistema?
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#0a0000] text-red-100 font-mono h-screen text-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,118,0.06))] bg-[length:100%_2px,3px_100%]"></div>
      
      <div className="max-w-md w-full space-y-12 relative z-10 animate-in fade-in duration-500">
        <div className="space-y-4">
          <div className="w-20 h-20 bg-red-950/30 border-2 border-red-600/50 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(220,38,38,0.2)] animate-pulse">
            <ShieldX className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tighter leading-tight text-white/90">
            BLOQUEIO DE CONTATO<br/>
            <span className="text-red-600">INICIADO</span>
          </h1>
        </div>

        <div className="space-y-6">
          <div className="w-full bg-zinc-900/50 h-3 rounded-full border border-red-900/20 overflow-hidden shadow-inner">
            <div 
              className={`h-full bg-gradient-to-r from-red-900 to-red-600 shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all duration-300 ${messageIdx === 3 ? 'animate-pulse' : ''}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="flex justify-between text-[10px] font-bold text-red-900 uppercase tracking-widest">
            <span>Progress: {Math.floor(progress)}%</span>
            <span className="animate-pulse">{messageIdx === 3 ? "SYSTEM_STRUGGLE" : "Erase_Active"}</span>
          </div>
        </div>

        <div className="h-24 flex items-center justify-center relative">
          <p className="text-red-500 text-sm font-black uppercase tracking-widest animate-short-circuit drop-shadow-[0_0_8px_rgba(220,38,38,0.8)] px-4 py-2 border border-red-600/20 rounded-lg max-w-[280px]">
            {messages[messageIdx]}
          </p>
          
          {(progress > 95 || messageIdx === 3) && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Zap className={`w-12 h-12 text-white animate-ping ${messageIdx === 3 ? 'opacity-40' : 'opacity-100'}`} />
            </div>
          )}
        </div>

        <div className="pt-12 flex flex-col items-center space-y-2 opacity-30">
          <div className="flex items-center space-x-2">
            <Terminal className="w-3 h-3" />
            <span className="text-[9px] uppercase tracking-[0.4em]">system_override_protocol_7</span>
          </div>
          <p className="text-[8px] uppercase tracking-[0.2em] italic">"Você não verá Tiradentes hoje."</p>
        </div>
      </div>
    </div>
  );
};

export default Act6Autodestruct;
