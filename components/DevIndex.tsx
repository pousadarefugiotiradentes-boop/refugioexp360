
import React from 'react';
import { FunnelStep } from '../types';
import { 
  LayoutGrid, 
  Fingerprint, 
  AlertCircle, 
  Wind, 
  Monitor, 
  MessageSquare, 
  Phone, 
  Lock, 
  Trash2, 
  ShoppingBag,
  Play,
  Volume2,
  Headphones,
  Settings,
  ShieldCheck,
  Instagram,
  ClipboardCheck,
  Terminal
} from 'lucide-react';

interface DevIndexProps {
  onSelectStep: (step: FunnelStep, mode?: string) => void;
  onStartNormalFlow: () => void;
}

const DevIndex: React.FC<DevIndexProps> = ({ onSelectStep, onStartNormalFlow }) => {
  const steps = [
    { 
      id: FunnelStep.START_SCREEN, 
      name: '0.0 Intro Experience', 
      desc: 'Tela preta: Iniciar Diagnóstico',
      icon: Volume2, 
      color: 'text-amber-400' 
    },
    { 
      id: FunnelStep.BIOMETRIC_ANALYSIS, 
      name: '0.1 Biometria', 
      desc: 'Simulação de leitura de ECG',
      icon: Fingerprint, 
      color: 'text-red-500' 
    },
    { 
      id: FunnelStep.ERROR_SCREEN, 
      name: '0.2 Critical Overload', 
      desc: 'Tela de erro e aceitação de termos',
      icon: AlertCircle, 
      color: 'text-orange-500' 
    },
    { 
      id: FunnelStep.BLUE_SCREEN, 
      name: '0.3 BSOD Intro', 
      mode: 'blue-intro',
      desc: 'Terminal de comandos travando',
      icon: Terminal, 
      color: 'text-blue-500' 
    },
    { 
      id: FunnelStep.INSTAGRAM_SCROLL, 
      name: '0.4 Instagram Scroll', 
      desc: 'Sobrecarga de rede social e exclusão',
      icon: Instagram, 
      color: 'text-fuchsia-500' 
    },
    { 
      id: FunnelStep.BLUE_SCREEN, 
      name: '0.5 BSOD Final', 
      mode: 'blue-final',
      desc: 'Tela Azul da Morte Windows',
      icon: Monitor, 
      color: 'text-blue-700' 
    },
    { 
      id: FunnelStep.BREATHING, 
      name: '0.6 Respiração', 
      desc: 'Protocolo de reinicialização zen',
      icon: Wind, 
      color: 'text-[#8EFF8E]' 
    },
    { 
      id: FunnelStep.WHATSAPP, 
      name: '2.0 WhatsApp Chat', 
      desc: 'Conversa inicial com Joaquim',
      icon: MessageSquare, 
      color: 'text-[#00a884]' 
    },
    { 
      id: FunnelStep.PHONE_CALL, 
      name: '3.0 Phone Call', 
      desc: 'Ligação recebida (Voz Joaquim)',
      icon: Phone, 
      color: 'text-green-500' 
    },
    { 
      id: FunnelStep.WHATSAPP, 
      name: '2.1 WhatsApp Audio', 
      mode: 'after-decline',
      desc: 'Áudio enviado após recusar chamada',
      icon: Headphones, 
      color: 'text-emerald-400' 
    },
    { 
      id: FunnelStep.SECRET_LOGIN, 
      name: '5.0 Login Secreto', 
      desc: 'Terminal de acesso (SUPERADMIN)',
      icon: Lock, 
      color: 'text-amber-500' 
    },
    { 
      id: FunnelStep.STRESS_QUIZ, 
      name: 'STRESS DETECTOR 2.0', 
      desc: 'Quiz ácido e Receituário Médico',
      icon: ClipboardCheck, 
      color: 'text-red-600' 
    },
    { 
      id: FunnelStep.OFFER, 
      name: '4.0 Oferta Final', 
      desc: 'Landing Page e Tour Virtual',
      icon: ShoppingBag, 
      color: 'text-amber-600' 
    },
    { 
      id: FunnelStep.AUTODESTRUCT, 
      name: '6.0 Auto-destruição', 
      desc: 'Wipe de dados e encerramento',
      icon: Trash2, 
      color: 'text-red-900' 
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-400 p-6 md:p-12 font-mono relative overflow-x-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500/0 via-amber-500/50 to-amber-500/0"></div>

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
          <div>
            <div className="flex items-center gap-3 text-amber-500 mb-3">
              <div className="p-1.5 bg-amber-500/10 rounded-md">
                <Settings className="w-4 h-4 animate-spin-slow" />
              </div>
              <span className="text-[10px] font-black tracking-[0.4em] uppercase">Ambiente de Desenvolvimento Ativo</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
              MISSION <span className="text-amber-500">CONTROL</span> <span className="text-zinc-700">V2.5</span>
            </h1>
            <p className="text-zinc-600 text-[10px] mt-4 uppercase tracking-widest font-bold">Gerenciamento de Atos e Fluxos Narrativos</p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={onStartNormalFlow}
              className="flex items-center gap-4 bg-[#8EFF8E] text-black px-8 py-4 rounded-2xl font-black text-xs hover:scale-105 transition-all shadow-[0_10px_30px_rgba(142,255,142,0.2)] group"
            >
              <Play className="w-4 h-4 fill-current group-hover:translate-x-1 transition-transform" />
              INICIAR FLUXO NORMAL (PRODUCTION)
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <button
                key={`${step.id}-${idx}`}
                onClick={() => onSelectStep(step.id, step.mode)}
                className="flex flex-col gap-5 p-6 bg-zinc-900/30 border border-white/5 rounded-3xl hover:border-amber-500/30 hover:bg-zinc-800/50 transition-all text-left group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                   <Icon className="w-16 h-16" />
                </div>

                <div className={`w-12 h-12 rounded-2xl bg-black border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform ${step.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-black text-sm uppercase tracking-tight group-hover:text-amber-500 transition-colors">
                      {step.name}
                    </h3>
                    {step.mode && (
                      <span className="text-[8px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded font-bold border border-amber-500/20">
                        {step.mode}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-600 font-bold leading-relaxed mb-3">
                    {step.desc}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <span className="text-[9px] text-zinc-700 font-mono tracking-widest">{step.id}</span>
                    <ShieldCheck className="w-3 h-3 text-zinc-800" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <footer className="pt-16 pb-8 border-t border-white/5 flex flex-col items-center gap-6 opacity-30">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-white rounded-full p-2 grayscale">
               <img src="https://i.postimg.cc/q7hsz5Yd/logo-refugio-quadrada-sem-fundo.png" alt="Logo" className="w-full h-full object-contain" />
             </div>
          </div>
          <p className="text-[10px] uppercase tracking-[0.6em] font-black text-center">Tiradentes Attraction Code • Refúgio Experiência</p>
          <div className="flex flex-wrap justify-center gap-8 text-[8px] tracking-[0.3em] font-black">
            <span>BIT_OS v2.4.2</span>
            <span>KERNEL: STABLE</span>
            <span>DEBUG: ENABLED</span>
            <span>© 2026 LOVART IND.</span>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default DevIndex;
