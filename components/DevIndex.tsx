
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
  Volume2
} from 'lucide-react';

interface DevIndexProps {
  onSelectStep: (step: FunnelStep) => void;
  onStartNormalFlow: () => void;
}

const DevIndex: React.FC<DevIndexProps> = ({ onSelectStep, onStartNormalFlow }) => {
  const steps = [
    { id: FunnelStep.START_SCREEN, name: 'Act 0: Sexto Sentido', icon: Volume2, color: 'text-amber-400' },
    { id: FunnelStep.BIOMETRIC_ANALYSIS, name: 'Act 0: Biometria', icon: Fingerprint, color: 'text-red-500' },
    { id: FunnelStep.ERROR_SCREEN, name: 'Act 0: Tela de Erro', icon: AlertCircle, color: 'text-orange-500' },
    { id: FunnelStep.BLUE_SCREEN, name: 'Act 0: Blue Screen', icon: Monitor, color: 'text-blue-500' },
    { id: FunnelStep.BREATHING, name: 'Act 0: Respiração', icon: Wind, color: 'text-[#8EFF8E]' },
    { id: FunnelStep.WHATSAPP, name: 'Act 2: WhatsApp', icon: MessageSquare, color: 'text-[#00a884]' },
    { id: FunnelStep.PHONE_CALL, name: 'Act 3: Chamada', icon: Phone, color: 'text-green-500' },
    { id: FunnelStep.SECRET_LOGIN, name: 'Act 5: Login Secreto', icon: Lock, color: 'text-amber-500' },
    { id: FunnelStep.OFFER, name: 'Act 4: Oferta Final', icon: ShoppingBag, color: 'text-amber-600' },
    { id: FunnelStep.AUTODESTRUCT, name: 'Act 6: Auto-destruição', icon: Trash2, color: 'text-red-700' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-400 p-8 font-mono">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="border-b border-zinc-800 pb-8 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 text-amber-500 mb-2">
              <LayoutGrid className="w-5 h-5" />
              <span className="text-xs font-bold tracking-[0.3em] uppercase">Dev Environment</span>
            </div>
            <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">
              Mission Control <span className="text-amber-500">v2.0</span>
            </h1>
          </div>
          <button 
            onClick={onStartNormalFlow}
            className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold text-xs hover:bg-amber-500 transition-colors group"
          >
            <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
            FLUXO NORMAL (START)
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <button
                key={step.id}
                onClick={() => onSelectStep(step.id)}
                className="flex items-center gap-4 p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-amber-500/50 hover:bg-zinc-800 transition-all text-left group"
              >
                <div className={`p-3 rounded-xl bg-black border border-zinc-800 group-hover:border-amber-500/30 ${step.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm tracking-tight">{step.name}</h3>
                  <p className="text-[10px] text-zinc-600 uppercase mt-1 tracking-widest">{step.id}</p>
                </div>
              </button>
            );
          })}
        </div>

        <footer className="pt-12 border-t border-zinc-800 flex flex-col items-center gap-4 opacity-50">
          <p className="text-[10px] uppercase tracking-[0.5em]">Tiradentes Attraction Code • 2026</p>
          <div className="flex gap-8 text-[8px] tracking-[0.2em] font-bold">
            <span>BIT_OS v2.4</span>
            <span>SYSTEM_STABLE</span>
            <span>DEBUG_MODE_ACTIVE</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DevIndex;
