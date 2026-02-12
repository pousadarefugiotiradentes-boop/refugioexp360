import React, { useEffect, useState, useRef } from 'react';
import { Terminal } from 'lucide-react';

interface Act0BlueScreenProps {
  mode?: 'intro' | 'final';
  onComplete: () => void;
}

const Act0BlueScreen: React.FC<Act0BlueScreenProps> = ({ mode = 'intro', onComplete }) => {
  const [percentage, setPercentage] = useState(0);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const errorAudioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<any | null>(null);

  const ERROR_SFX_URL = "https://dl.dropboxusercontent.com/scl/fi/0h55rla37zwcxpuy57jv3/error-sound.mp3?rlkey=n1lmk8iwk3pef8k8blc4ognlg";

  const meditationCommands = [
    "C:\\> CARREGANDO STRESS_DETECTOR v2.0.26...",
    "C:\\> EXECUTANDO STRESS_RELIEF v2.0.26...",
    "C:\\> AJUSTAR_COLUNA.EXE /ALINHAMENTO_VERTICAL",
    "C:\\> CONFIG_MAOS.SYS --PALMAS_PARA_CIMA",
    "C:\\> PUXAR_AR.BAT /PROFUNDO /MODO_ZEN",
    "C:\\> SEGURAR_RESPIRACAO.DLL --TEMPO=4S",
    "C:\\> SOLTAR_AR.CMD /LENTAMENTE /ALIVIO_TOTAL",
    "C:\\> REPETIR_PROCESSO.EXE/FOCO/AGORA",
    "C:\\> FECHAR_OLHOS.BAT /MODO_DARK_ON",
    "!!! ERRO: NOTIFICAÇÃO RECEBIDA! PROCESSO INTERROMPIDO !!!",
    "C:\\> MONITORAR REDES_SOCIAIS.APP/SCROLLING_INFINITO",
    "!!! ALERTA: SOBRECARGA_DE_INFORMAÇÃO !!!",
    "!!! ERRO: CRISE_DE_ANSIEDADE_DETECTADA !!!",
    "C:\\> ANALISAR FEED_INSTAGRAM.APP/MODO_DOPAMINA_BARATA",
    "C:\\> FAZER LOGIN INSTAGRAM.APP/_"
  ];

  useEffect(() => {
    const audio = new Audio(ERROR_SFX_URL);
    audio.volume = 0.9;
    errorAudioRef.current = audio;
    
    if (mode === 'intro') {
      let currentLine = 0;
      const interval = setInterval(() => {
        if (currentLine < meditationCommands.length) {
          const newLine = meditationCommands[currentLine];
          if (newLine) {
            setTerminalLines(prev => [...prev, newLine]);
          }
          
          // Toca o som de erro a partir da linha de erro (índice 9)
          if (currentLine >= 9 && errorAudioRef.current) {
            errorAudioRef.current.play().catch(() => {});
          }
          
          currentLine++;
        } else {
          clearInterval(interval);
          timerRef.current = setTimeout(onComplete, 2000);
        }
      }, 800);

      return () => {
        clearInterval(interval);
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }

    if (mode === 'final') {
      const interval = setInterval(() => {
        setPercentage(prev => {
          if (prev < 100) {
            const inc = Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 1;
            const next = Math.min(100, prev + inc);
            if (next === 100) {
              clearInterval(interval);
              timerRef.current = setTimeout(onComplete, 1200); 
            }
            return next;
          }
          return 100;
        });
      }, 100);
      return () => {
        clearInterval(interval);
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }
  }, [onComplete, mode]);

  if (mode === 'intro') {
    return (
      <div className="flex-1 flex flex-col bg-[#050505] h-screen overflow-hidden font-mono text-[#8EFF8E] p-6 md:p-12 relative selection:bg-[#8EFF8E] selection:text-black">
        <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,118,0.03))] bg-[length:100%_3px,3px_100%] opacity-40"></div>
        
        <div className="max-w-4xl w-full mx-auto flex flex-col h-full space-y-4 animate-in fade-in duration-500 relative z-10">
          <div className="flex items-center justify-between text-[#8EFF8E]/40 mb-6 border-b border-[#8EFF8E]/10 pb-4">
            <div className="flex items-center gap-3">
              <Terminal className="w-4 h-4" />
              <span className="text-[10px] md:text-xs uppercase tracking-[0.3em]">O FORNO INDUSTRIES (R) TERMINAL v2.0</span>
            </div>
            <span className="text-[10px] hidden md:block">MEMORIA: 640KB OK</span>
          </div>

          <div className="space-y-1.5 md:space-y-3 flex-1 overflow-y-auto no-scrollbar">
            {terminalLines.map((line, idx) => {
              if (!line) return null;
              const isError = line.includes("!!!");
              const isWarning = line.includes("ALERTA");
              return (
                <p 
                  key={idx} 
                  className={`text-sm md:text-2xl font-bold tracking-tight animate-in slide-in-from-left-4 duration-300
                    ${isError ? 'text-red-500 animate-pulse' : ''} 
                    ${isWarning ? 'text-amber-500' : ''}
                  `}
                >
                  {line}
                </p>
              );
            })}
            <span className="inline-block w-3 h-6 bg-[#8EFF8E] animate-pulse ml-1 align-middle"></span>
          </div>

          <div className="pt-8 opacity-40 flex flex-col items-center">
             <p className="text-[8px] md:text-[10px] mb-2 uppercase tracking-[0.5em] text-[#8EFF8E] font-black">
                Processando hardware humano...
             </p>
             <div className="w-full max-w-xs bg-[#8EFF8E]/10 h-0.5 relative overflow-hidden">
                <div className="absolute inset-0 bg-[#8EFF8E]/60 animate-[loading-bar_3s_ease-in-out_infinite]"></div>
             </div>
          </div>
        </div>

        <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end opacity-20 text-[7px] md:text-[9px] uppercase tracking-[0.4em] font-black">
          <span>BIOS_O_FORNO_2026</span>
          <span>(C) MICROSOFT DOS 6.22 - MOD: JOAQUIM</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#0000AA] h-screen overflow-hidden font-mono text-white p-6 md:p-16 selection:bg-white selection:text-[#0000AA]">
      <div className="max-w-4xl w-full mx-auto flex flex-col h-full justify-between py-4 animate-in fade-in duration-500">
        <div className="space-y-4">
          <div className="bg-white text-[#0000AA] inline-block px-3 py-1 font-black text-lg shadow-lg">CRITICAL ERROR</div>
          <h1 className="text-3xl md:text-6xl font-black leading-tight uppercase tracking-tighter">FALHA NO PROCESSAMENTO!</h1>
          <div className="space-y-6 text-sm md:text-2xl font-bold leading-tight opacity-90">
            <p>Detectamos excesso de <span className="font-black bg-red-600 px-2 uppercase">DOPAMINA BARATA</span> em sua corrente sanguínea.</p>
            <p>Seus níveis de <span className="font-black bg-red-600 px-2 uppercase">CORTISOL</span> excederam o limite seguro.</p>
            <p>Verifique se seu celular não está consumindo sua sanidade.</p>
            <p>Desative todas as notificações relacionadas ao trabalho.</p>
            <p>O sistema será reiniciado em modo de segurança para evitar danos permanentes.</p>
          </div>
        </div>
        <div className="space-y-8">
          <div className="space-y-2 border-t border-white/20 pt-6">
            <p className="text-[10px] opacity-70">Informações de Depuração:</p>
            <p className="text-[9px] md:text-xs font-black tracking-widest uppercase opacity-80">*** STOP: 0x0000005D (ESTRESSE_CRITICO, 2026_VERSION)</p>
            <p className="text-[9px] md:text-xs font-black tracking-widest uppercase opacity-80">*** RESPIRE_FUNDO.SYS - INICIALIZANDO REBOOT...</p>
          </div>
          <div className="flex flex-col items-center space-y-4">
             <div className="w-full bg-white/10 h-12 border-4 border-white relative overflow-hidden">
                <div className="absolute inset-0 bg-white transition-all duration-300" style={{ width: `${Math.min(percentage, 100)}%` }}></div>
                <div className="absolute inset-0 flex items-center justify-center mix-blend-difference font-black text-sm md:text-base">{Math.min(percentage, 100)}% CONCLUÍDO</div>
             </div>
             <p className="text-[8px] md:text-[12px] uppercase tracking-[0.5em] animate-pulse text-center font-black">Liberando memória RAM (Desinstalando aplicativos de Redes Sociais)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Act0BlueScreen;