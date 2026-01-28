import React, { useState, useEffect, useRef } from 'react';

interface HeartbeatMonitorProps {
  speed: number;
  isAlert: boolean;
}

const HeartbeatMonitor: React.FC<HeartbeatMonitorProps> = ({ speed, isAlert }) => {
  const pulsePattern = "l 10 0 l 5 -5 l 5 5 l 5 0 l 5 -40 l 5 80 l 5 -40 l 10 0 l 10 -10 l 10 10 l 10 0";
  const repeatedPath = `M -100 100 ${Array(30).fill(pulsePattern).join(' ')}`;

  return (
    <div className="w-full h-48 relative overflow-hidden flex items-center justify-center">
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 800 200" 
        preserveAspectRatio="none" 
        className={`transition-opacity duration-500 animate-jitter ${isAlert ? 'opacity-100' : 'opacity-60'}`}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d={repeatedPath}
          fill="none"
          stroke={isAlert ? "#ff0000" : "#ef4444"}
          strokeWidth={isAlert ? "3" : "2"}
          filter="url(#glow)"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-ecg"
          style={{ 
            animationDuration: `${Math.max(0.6, 2.5 / (1 + speed / 60))}s`,
            filter: isAlert ? 'drop-shadow(0 0 8px rgba(255,0,0,0.8))' : 'none'
          }}
        />
      </svg>
    </div>
  );
};

const Act0BiometricAnalysis: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [baseProgress, setBaseProgress] = useState(0);
  const [displayedProgress, setDisplayedProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const errorAudioRef = useRef<HTMLAudioElement | null>(null);
  // Replaced NodeJS.Timeout with any to avoid build errors in browser environment
  const timerRef = useRef<any | null>(null);

  const ERROR_SFX_URL = "https://dl.dropboxusercontent.com/scl/fi/0h55rla37zwcxpuy57jv3/error-sound.mp3?rlkey=n1lmk8iwk3pef8k8blc4ognlg";

  const messages = [
    "► Estabelecendo conexão segura...",
    "► Medindo batimentos cardíacos...",
    "► Analisando saturação de oxigênio...",
    "► Detectando níveis de cortisol...",
    "► Avaliando adrenalina e noradrenalina...",
    "► Verificando serotonina e dopamina...",
    "⚠️ ALERTA: Níveis críticos detectados...",
    "🔴 CHAMAR SAMU (192)"
  ];

  useEffect(() => {
    const audio = new Audio(ERROR_SFX_URL);
    // Aumentado em 50%: 0.7 * 1.5 = 1.05 -> 1.0 (limitado ao máximo)
    audio.volume = 1.0;
    errorAudioRef.current = audio;

    let currentBase = 0;
    const interval = setInterval(() => {
      const increment = 0.3 + (Math.random() * 0.2);
      currentBase = Math.min(100, currentBase + increment);
      setBaseProgress(currentBase);

      const oscillation = (Math.sin(Date.now() / 150) * 1.5) + (Math.random() * 1.2);
      const nextDisplayed = Math.min(100, Math.max(0, currentBase + oscillation));
      setDisplayedProgress(nextDisplayed);

      if (currentBase >= 100) {
        clearInterval(interval);
        setDisplayedProgress(100);
        setIsFinalizing(true);
        if (errorAudioRef.current) errorAudioRef.current.play().catch(() => {});
        
        // Proteção contra múltiplos disparos
        if (!timerRef.current) {
          timerRef.current = setTimeout(onComplete, 1200);
        }
      }
    }, 60);

    return () => {
      clearInterval(interval);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (errorAudioRef.current) {
        errorAudioRef.current.pause();
        errorAudioRef.current = null;
      }
    };
  }, [onComplete]);

  useEffect(() => {
    const step = 100 / (messages.length - 1);
    setCurrentMessage(Math.min(messages.length - 1, Math.floor(baseProgress / step)));
  }, [baseProgress, messages.length]);

  const isAlert = currentMessage >= 6;

  return (
    <div className={`min-h-screen flex flex-col items-center justify-between p-6 sm:p-12 font-mono relative overflow-hidden transition-colors duration-500 
      ${isAlert ? 'bg-red-950/30' : 'bg-black'}`}>
      
      <div className={`absolute top-0 left-0 w-full h-[2px] bg-red-500/50 shadow-[0_0_15px_#ef4444] z-50 pointer-events-none ${isFinalizing ? 'animate-[scan_0.5s_infinite]' : 'animate-scan'}`}></div>

      <div className="w-full flex flex-col items-center text-center space-y-1 text-zinc-600 uppercase tracking-widest z-30 pt-2 px-12">
        <div className="flex items-center gap-2 text-[10px] md:text-sm">
          <div className={`w-2 h-2 rounded-full ${isAlert ? 'bg-red-500' : 'bg-zinc-700'} animate-pulse`}></div>
          STRESS_DETECTOR_v2.1
        </div>
        <div className="text-[10px] md:text-sm flex items-center justify-center gap-2">
          <span>ID: E46820</span>
          <span>•</span>
          <span className={isAlert ? "text-red-600 font-bold" : "animate-pulse"}>
            {isAlert ? "CRITICAL_LEVEL" : "SINAL_ESTÁVEL"}
          </span>
        </div>
      </div>

      <div className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center space-y-12 z-10">
        <h1 className={`text-red-500 text-3xl sm:text-5xl md:text-6xl font-black text-center uppercase px-4 tracking-tighter leading-[0.9] transition-all duration-300 
          ${isAlert ? 'scale-110 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]' : ''}`}>
          {isAlert ? "SISTEMA_SOBRECARREGADO" : "LENDO BIOMETRIA"}
        </h1>

        <div className="w-full relative py-10">
          <HeartbeatMonitor speed={displayedProgress} isAlert={isAlert} />
          <div className={`absolute top-0 right-0 sm:right-10 font-bold text-5xl sm:text-7xl italic transition-colors duration-200 ${isAlert ? 'text-red-500' : 'text-red-900/40'}`}>
            {Math.floor(72 + (displayedProgress * 1.15) + (Math.random() * 5))} <span className="text-xl sm:text-2xl not-italic opacity-50">BPM</span>
          </div>
        </div>

        <div className="min-h-[100px] flex items-center justify-center px-4 w-full">
          <p className={`text-xl sm:text-3xl font-mono text-center transition-all duration-200 uppercase tracking-tight 
            ${isAlert 
              ? 'text-red-500 font-black scale-105 drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]' 
              : 'text-[#8EFF8E] font-black'
            }`}>
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
        </div>
        
        <div className="text-center text-[10px] text-zinc-800 uppercase tracking-[0.8em] opacity-40">
          FEITO COM ♡ PEL´O FORNO • COLETA_DADOS_BIOMETRICOS
        </div>
      </div>
    </div>
  );
};

export default Act0BiometricAnalysis;