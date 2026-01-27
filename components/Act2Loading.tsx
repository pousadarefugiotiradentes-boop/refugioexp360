
import React, { useState, useEffect } from 'react';

interface Act2LoadingProps {
  onComplete: () => void;
}

const Act2Loading: React.FC<Act2LoadingProps> = ({ onComplete }) => {
  const [loadingTextIdx, setLoadingTextIdx] = useState(0);
  const loadingTexts = [
    "Analisando suas respostas...",
    "Identificando padrões comportamentais...",
    "Detectando micro-sinais de linguagem corporal...",
    "Cruzando dados com 15.000+ perfis...",
    "Gerando diagnóstico personalizado..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingTextIdx(prev => {
        if (prev < loadingTexts.length - 1) return prev + 1;
        clearInterval(interval);
        setTimeout(onComplete, 1000);
        return prev;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-950 text-white">
      <div className="relative mb-12">
        <div className="w-24 h-24 border-4 border-blue-900 border-t-blue-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-blue-500/20 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-light tracking-widest uppercase text-blue-400 animate-pulse">
          Sistema IA Ativo
        </h3>
        <p className="text-2xl font-bold min-h-[3rem] transition-all duration-500">
          {loadingTexts[loadingTextIdx]}
        </p>
      </div>

      <div className="absolute bottom-12 w-full max-w-xs px-8">
        <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-1000 ease-linear"
            style={{ width: `${((loadingTextIdx + 1) / loadingTexts.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Act2Loading;
