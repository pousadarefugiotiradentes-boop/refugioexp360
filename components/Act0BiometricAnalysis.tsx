import React, { useState, useEffect } from 'react';

interface Act0BiometricAnalysisProps {
  onComplete: () => void;
}

const HeartbeatMonitor = ({ speed, isAlert }: { speed: number; isAlert: boolean }) => {
  return (
    <div className="w-full h-48 relative overflow-hidden flex items-center justify-center">
      <svg width="100%" height="100%" viewBox="0 0 800 200" preserveAspectRatio="none" className={`transition-opacity duration-500 ${isAlert ? 'opacity-100' : 'opacity-60'}`}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d="M 0 100 L 100 100 L 110 80 L 120 120 L 135 40 L 150 160 L 165 100 L 180 110 L 190 100 L 300 100 L 310 80 L 320 120 L 335 40 L 350 160 L 365 100 L 380 110 L 390 100 L 500 100 L 510 80 L 520 120 L 535 40 L 550 160 L 565 100 L 580 110 L 590 100 L 700 100 L 710 80 L 720 120 L 735 40 L 750 160 L 765 100 L 780 110 L 800 100"
          fill="none"
          stroke={isAlert ? "#ff0000" : "#ef4444"}
          strokeWidth={isAlert ? "4" : "3"}
          filter="url(#glow)"
          className="animate-ecg"
          style={{ animationDuration: `${Math.max(0.5, 2.5 / (1 + speed / 80))}s` }}
        />
      </svg>
    </div>
  );
};

const Act0BiometricAnalysis: React.FC<Act0BiometricAnalysisProps> = ({ onComplete }) => {
  const [baseProgress, setBaseProgress] = useState(0);
  const [displayedProgress, setDisplayedProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isFinalizing, setIsFinalizing] = useState(false);

  const messages = [
    "► Estabelecendo conexão segura...",
    "► Medindo batimentos cardíacos...",
    "► Analisando saturação de oxigênio...",
    "► Detectando níveis de cortisol...",
    "► Avaliando adrenalina e noradrenalina...",
    "► Verificando serotonina e dopamina...",
    "⚠️ ALERTA: Níveis críticos detectados...",
    "🔴 DIAGNÓSTICO COMPLETO"
  ];

  useEffect(() => {
    let currentBase = 0;
    const interval = setInterval(() => {
      const increment = 0.3 + (Math.random() * 0.2);
      currentBase = Math.min(100, currentBase + increment);
      setBaseProgress(currentBase);

      // Oscilação visual realista para simular leitura em tempo real
      const oscillation = (Math.sin(Date.now() / 150) * 1.5) + (Math.random() * 1.2);
      const nextDisplayed = Math.min(100, Math.max(0, currentBase + oscillation));
      setDisplayedProgress(nextDisplayed);

      if (currentBase >= 100) {
        clearInterval(interval);
        setDisplayedProgress(100);
        setIsFinalizing(true);
        setTimeout(() => {
          onComplete();
        }, 1800);
      }
    }, 60);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    if (baseProgress < 15) setCurrentMessage(0);
    else if (baseProgress < 30) setCurrentMessage(1);
    else if (baseProgress < 45) setCurrentMessage(2);
    else if (baseProgress < 60) setCurrentMessage(3);
    else if (baseProgress < 75) setCurrentMessage(4);
    else if (baseProgress < 90) setCurrentMessage(5);
    else if (baseProgress < 100) setCurrentMessage(6);
    else setCurrentMessage(7);
  }, [baseProgress]);

  const isAlert = currentMessage >= 6;

  return (
    <div className={`min-h-screen bg-black flex flex-col items-center justify-between p-6 sm:p-12 font-mono relative overflow-hidden transition-colors duration-500 
      ${isAlert ? 'bg-red-950/30' : 'bg-black'} 
      ${isFinalizing ? 'animate-shake animate-glitch' : ''}
    `}>
      <div className={`absolute top-0 left-0 w-full h-[2px] bg-red-500/50 shadow-[0_0_15px_#ef4444] z-50 pointer-events-none ${isFinalizing ? 'animate-[scan_0.5s_infinite]' : 'animate-scan'}`}></div>
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,118,0.06))] bg-[length:100%_2px,3px_100%] z-20"></div>

      <div className="w-full flex justify-between items-start text-sm text-zinc-600 uppercase tracking-widest z-30">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isAlert ? 'bg-red-500' : 'bg-zinc-700'} animate-pulse`}></div>
          HEALTH_PROTOCOL_v4.2
        </div>
        <div className="text-right">ID: E46820<br/><span className={isAlert ? "text-red-600 font-bold" : "animate-pulse"}>
          {isAlert ? "CRITICAL_LEVEL" : "SINAL_ESTÁVEL"}
        </span></div>
      </div>

      <div className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center space-y-12 z-10">
        <h1 className={`text-red-500 text-3xl sm:text-5xl md:text-6xl font-black text-center uppercase px-4 tracking-tighter leading-[0.9] transition-all duration-300 
          ${isAlert ? 'scale-110 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]' : ''} 
          ${isFinalizing ? 'animate-pulse' : ''}`}>
          {isAlert ? "SISTEMA_SOBRECARREGADO" : "LENDO BIOMETRIA"}
        </h1>

        <div className="w-full relative py-10">
          <HeartbeatMonitor speed={displayedProgress} isAlert={isAlert} />
          <div className={`absolute top-0 right-0 sm:right-10 font-bold text-5xl sm:text-7xl italic transition-colors duration-200 ${isAlert ? 'text-red-500' : 'text-red-900/40'}`}>
            {Math.floor(72 + (displayedProgress * 1.15) + (Math.random() * 5))} <span className="text-xl sm:text-2xl not-italic opacity-50">BPM</span>
          </div>
        </div>

        <div className="min-h-[80px] flex items-center justify-center px-4 w-full">
          <p className={`text-xl sm:text-3xl font-mono text-center transition-all duration-200 uppercase tracking-tight 
            ${isAlert ? 'text-red-400 font-black scale-105 drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'text-zinc-500 font-bold'}`}>
            {messages[currentMessage]}
          </p>
        </div>
      </div>

      <div className="w-full max-w-4xl space-y-6 pb-4 z-30">
        <div className="flex justify-between items-end mb-2">
          <div className={`text-[10px] uppercase tracking-widest font-bold transition-colors ${isAlert ? 'text-red-500' : 'text-zinc-700'}`}>
            Monitoramento Biométrico
          </div>
          <div className={`text-4xl font-black italic transition-all ${isAlert ? 'text-red-500 scale-110' : 'text-red-400'}`}>
            {Math.floor(displayedProgress)}%
          </div>
        </div>

        <div className={`w-full bg-zinc-900/50 h-6 rounded-full border-2 transition-colors duration-500 overflow-hidden relative shadow-[0_0_20px_rgba(0,0,0,1)] 
          ${isAlert ? 'border-red-600' : 'border-red-900/30'}`}>
          <div className="h-full bg-gradient-to-r from-red-950 via-red-600 to-red-400 transition-all duration-100 ease-out shadow-[0_0_30px_rgba(239,68,68,0.8)]" 
               style={{ width: `${displayedProgress}%` }} />
          <div className="absolute top-0 bottom-0 w-24 bg-white/10 blur-md animate-loading-sweep" style={{ left: `${displayedProgress - 10}%` }}></div>
        </div>
        
        <div className="text-center text-[10px] text-zinc-800 uppercase tracking-[0.8em] opacity-40">
          PROPRIEDADE DA LOVART INDUSTRIES • EXTRAÇÃO_DE_DADOS_ATIVA
        </div>
      </div>
    </div>
  );
};

export default Act0BiometricAnalysis;