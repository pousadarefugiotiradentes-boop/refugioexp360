import React, { useEffect, useState, useRef } from 'react';
import { 
  Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Home, Search, 
  PlusSquare, Film, ChevronLeft, Shield, User, AlertCircle, CheckCircle2,
  Settings, Archive, Activity, Bell, Clock, BarChart3, ChevronRight, X,
  Key, Users, FileText, Megaphone, CreditCard, Star, Search as SearchIcon
} from 'lucide-react';
import { LOGO_URL, HERO_IMAGE_URL } from '../constants';

interface Act0InstagramScrollProps {
  onComplete: () => void;
}

type DeletionPhase = 'loading' | 'scrolling' | 'settings' | 'meta_accounts' | 'confirming' | 'success';

const InstagramPost: React.FC<{ index: number }> = ({ index }) => {
  const postImages = [
    HERO_IMAGE_URL,
    "https://i.postimg.cc/1XhTqCyf/joaquim-perfil-2.png",
    "https://images.unsplash.com/photo-1544124499-58912cbddaad?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522336572468-97b06e8ef143?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop"
  ];
  const image = postImages[index % postImages.length];

  return (
    <div className="bg-black w-full border-b border-zinc-900 pb-2">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-fuchsia-600 p-[1.5px]">
            <div className="w-full h-full rounded-full bg-black p-[1px]">
              <img src={LOGO_URL} className="w-full h-full rounded-full object-cover" alt="Avatar" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-white">refugiotiradentes</span>
            <span className="text-[11px] text-zinc-400">Tiradentes, Minas Gerais</span>
          </div>
        </div>
        <MoreHorizontal className="w-5 h-5 text-white" />
      </div>
      <div className="aspect-square bg-zinc-900">
        <img src={image} className="w-full h-full object-cover" alt="Post" />
      </div>
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Heart className="w-6 h-6 text-white" />
            <MessageCircle className="w-6 h-6 text-white" />
            <Send className="w-6 h-6 text-white" />
          </div>
          <Bookmark className="w-6 h-6 text-white" />
        </div>
        <div className="text-sm font-bold text-white">4.281 curtidas</div>
        <div className="text-sm text-white leading-snug">
          <span className="font-bold mr-2">refugiotiradentes</span>
          O plano de fuga que você precisava...
        </div>
      </div>
    </div>
  );
};

const Act0InstagramScroll: React.FC<Act0InstagramScrollProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<DeletionPhase>('loading');
  const [isGlitching, setIsGlitching] = useState(false);
  const [clickEffect, setClickEffect] = useState<{ x: number, y: number } | null>(null);
  const [oscillationTarget, setOscillationTarget] = useState<'yes' | 'no'>('no');
  const scrollRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(Date.now());
  const velocityRef = useRef<number>(1);

  useEffect(() => {
    if (phase === 'loading') {
      setTimeout(() => setPhase('scrolling'), 2500);
    }
  }, [phase]);

  useEffect(() => {
    if (phase !== 'scrolling') return;

    startTimeRef.current = Date.now();
    const duration = 4000;
    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      velocityRef.current = 1 + Math.pow(progress, 4) * 400;
      
      if (scrollRef.current) scrollRef.current.scrollTop += velocityRef.current;
      if (progress > 0.9) setIsGlitching(true);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(() => setPhase('settings'), 500);
      }
    };

    const request = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(request);
  }, [phase]);

  // Automação das telas de exclusão
  useEffect(() => {
    if (phase === 'settings') {
      setTimeout(() => {
        setClickEffect({ x: 50, y: 30 }); // Simula clique no "Central de Contas"
        setTimeout(() => {
          setPhase('meta_accounts');
          setClickEffect(null);
        }, 400);
      }, 2000);
    } else if (phase === 'meta_accounts') {
      setTimeout(() => {
        setClickEffect({ x: 50, y: 92 }); // Simula clique no "Gerenciar contas" lá embaixo
        setTimeout(() => {
          setPhase('confirming');
          setClickEffect(null);
        }, 400);
      }, 2000);
    } else if (phase === 'confirming') {
      // Inicia oscilação dramática entre botões
      const oscInterval = setInterval(() => {
        setOscillationTarget(prev => prev === 'yes' ? 'no' : 'yes');
      }, 600);

      // Aumentado para 5 segundos de tensão
      setTimeout(() => {
        clearInterval(oscInterval);
        setOscillationTarget('yes'); // Seleção final
        setClickEffect({ x: 50, y: 68 }); // Posicionamento do clique no botão SIM
        setTimeout(() => {
          setPhase('success');
          setClickEffect(null);
        }, 500);
      }, 5000);
    } else if (phase === 'success') {
      setTimeout(() => {
        onComplete();
      }, 4000);
    }
  }, [phase, onComplete]);

  const DeletionClickOverlay = () => {
    if (!clickEffect) return null;
    return (
      <div 
        className="fixed z-[1000] w-12 h-12 bg-white/40 rounded-full border-2 border-white/60 animate-ping pointer-events-none"
        style={{ left: `${clickEffect.x}%`, top: `${clickEffect.y}%`, transform: 'translate(-50%, -50%)' }}
      />
    );
  };

  return (
    <div className={`fixed inset-0 bg-black z-[200] flex flex-col font-sans overflow-hidden transition-all duration-300 ${isGlitching && phase === 'scrolling' ? 'animate-vibrate' : ''}`}>
      <DeletionClickOverlay />

      {/* FASE: LOADING / SPLASH */}
      {phase === 'loading' && (
        <div className="flex-1 flex flex-col items-center justify-center space-y-8 bg-black animate-in fade-in duration-1000">
           <div className="w-24 h-24 rounded-[30%] bg-gradient-to-tr from-yellow-400 via-red-500 to-fuchsia-600 p-[3px] animate-pulse">
              <div className="w-full h-full rounded-[25%] bg-black flex items-center justify-center border border-white/10">
                 <div className="w-12 h-12 rounded-full border-[5px] border-white/80 relative">
                    <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-white/80 rounded-full"></div>
                 </div>
              </div>
           </div>
           <div className="flex flex-col items-center gap-2">
              <span className="text-white/60 text-xs font-bold tracking-[0.3em] uppercase">MONITORANDO SEU INSTAGRAM</span>
              <div className="w-32 h-[2px] bg-zinc-800 rounded-full overflow-hidden">
                 <div className="h-full bg-white/40 animate-[loading-bar_2.5s_ease-in-out_infinite]"></div>
              </div>
           </div>
           <div className="absolute bottom-12 flex flex-col items-center">
              <span className="text-zinc-600 text-[10px] uppercase tracking-widest font-black">from</span>
              <span className="text-white text-lg font-black tracking-widest flex items-center gap-1">
                 <Shield className="w-4 h-4 fill-white" /> Meta
              </span>
           </div>
        </div>
      )}

      {/* FASE: ROLAGEM ACELERADA */}
      {phase === 'scrolling' && (
        <>
          <div className="bg-black border-b border-zinc-900 p-4 flex items-center justify-between shrink-0 relative z-50">
            <span className="text-2xl font-black italic tracking-tighter text-white">Instagram</span>
            <div className="flex items-center gap-6">
              <Heart className="w-6 h-6 text-white" />
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-hidden pointer-events-none">
            <div className="flex flex-col">
              {[...Array(30)].map((_, i) => <InstagramPost key={i} index={i} />)}
            </div>
          </div>
          <div className="bg-black border-t border-zinc-900 p-4 flex justify-around items-center shrink-0">
            <Home className="w-6 h-6 text-white" />
            <SearchIcon className="w-6 h-6 text-zinc-400" />
            <PlusSquare className="w-6 h-6 text-zinc-400" />
            <Film className="w-6 h-6 text-zinc-400" />
            <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700"></div>
          </div>
        </>
      )}

      {/* FASE: CONFIGURAÇÕES E ATIVIDADE */}
      {phase === 'settings' && (
        <div className="flex-1 flex flex-col bg-black animate-in slide-in-from-right duration-500 overflow-y-auto no-scrollbar">
          <div className="sticky top-0 bg-black z-10 px-4 pt-6 pb-4 flex items-center gap-6">
            <ChevronLeft className="w-7 h-7 text-white" />
            <h1 className="text-xl font-bold text-white">Configurações e atividade</h1>
          </div>
          
          <div className="px-4 mb-6">
            <div className="bg-zinc-900 rounded-xl flex items-center px-4 py-2.5 gap-3">
              <SearchIcon className="w-5 h-5 text-zinc-500" />
              <span className="text-zinc-500 text-base">Pesquisar</span>
            </div>
          </div>

          <div className="px-4 py-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[13px] font-bold text-zinc-400 uppercase tracking-wide">Sua conta</span>
              <span className="text-blue-500 text-[13px] font-bold flex items-center gap-1">
                <Shield className="w-4 h-4 fill-blue-500" /> Meta
              </span>
            </div>
            
            <div className={`bg-zinc-900/40 rounded-2xl p-4 flex items-center justify-between group transition-colors ${clickEffect?.y === 30 ? 'bg-zinc-800' : ''}`}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center bg-zinc-900">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-bold">Central de Contas</span>
                  <span className="text-zinc-400 text-xs leading-tight pr-4">Senha, segurança, dados pessoais, preferências de anúncios</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-600" />
            </div>
            <p className="text-zinc-500 text-[11px] leading-snug px-1">
              Gerencie suas experiências conectadas e configurações de contas nas tecnologias da Meta. <span className="text-blue-500">Saiba mais</span>
            </p>
          </div>

          <div className="mt-4 border-t border-zinc-900">
            <div className="px-4 py-6">
               <span className="text-[13px] font-bold text-zinc-400 uppercase tracking-wide">Como você usa o Instagram</span>
            </div>
            <div className="space-y-1">
              {[
                { label: 'Salvos', icon: Bookmark },
                { label: 'Itens Arquivados', icon: Archive },
                { label: 'Sua atividade', icon: Activity },
                { label: 'Notificações', icon: Bell },
                { label: 'Gerenciamento de tempo', icon: Clock }
              ].map((item, idx) => (
                <div key={idx} className="px-4 py-4 flex items-center justify-between active:bg-zinc-900">
                  <div className="flex items-center gap-4">
                    <item.icon className="w-6 h-6 text-white" />
                    <span className="text-white text-base">{item.label}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-zinc-600" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FASE: CENTRAL DE CONTAS */}
      {phase === 'meta_accounts' && (
        <div className="flex-1 flex flex-col bg-[#0b141a] animate-in slide-in-from-right duration-500 overflow-y-auto no-scrollbar">
          <div className="px-4 py-6 flex items-center justify-between">
             <X className="w-7 h-7 text-white" />
             <span className="text-lg font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 fill-white" /> Meta
             </span>
             <div className="w-7"></div>
          </div>

          <div className="px-6 text-center space-y-4 mb-8">
             <h1 className="text-3xl font-black text-white tracking-tight">Central de Contas</h1>
             <p className="text-zinc-400 text-[13px] leading-relaxed">
                Gerencie suas experiências conectadas e configurações de contas nas tecnologias da Meta, como Facebook, Instagram e Meta Horizon. <span className="text-blue-400">Saiba mais</span>
             </p>
          </div>

          <div className="px-4 space-y-4">
             <div className="bg-[#1a232e] rounded-2xl p-4 flex items-center justify-between border border-white/5">
                <div className="flex items-center gap-4">
                   <div className="relative">
                      <div className="w-12 h-12 rounded-full border-2 border-[#0b141a] bg-white p-0.5 overflow-hidden">
                        <img src={LOGO_URL} className="w-full h-full object-contain" alt="Profile" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-[#0b141a] bg-[#1a232e] flex items-center justify-center">
                         <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" className="w-4 h-4" alt="FB" />
                      </div>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-white font-bold text-[15px]">Perfis e dados pessoais</span>
                      <span className="text-zinc-400 text-xs">4 perfis</span>
                   </div>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-500" />
             </div>

             <div className="bg-[#1a232e] rounded-2xl overflow-hidden border border-white/5">
                {[
                  { label: 'Senha e segurança', icon: Key },
                  { label: 'Experiências conectadas', icon: Users },
                  { label: 'Suas informações e permissões', icon: FileText },
                  { label: 'Preferências de anúncios', icon: Megaphone },
                  { label: 'Meta Pay', icon: CreditCard },
                  { label: 'Assinaturas', icon: Star }
                ].map((item, idx) => (
                  <div key={idx} className="px-4 py-4 flex items-center justify-between active:bg-zinc-800 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-4">
                      <item.icon className="w-6 h-6 text-white" />
                      <span className="text-white text-[15px]">{item.label}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-zinc-500" />
                  </div>
                ))}
             </div>

             <div className={`bg-[#1a232e] rounded-2xl p-4 flex items-center justify-between border border-white/5 mb-12 transition-colors ${clickEffect?.y === 92 ? 'bg-red-500/20 border-red-500/50' : ''}`}>
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-[#1a232e] border border-zinc-800 flex items-center justify-center">
                      <User className="w-5 h-5 text-red-500" />
                   </div>
                   <span className="text-red-500 font-bold text-[15px]">DELETAR CONTA</span>
                </div>
                <ChevronRight className="w-5 h-5 text-red-500" />
             </div>
          </div>
        </div>
      )}

      {/* FASE: MODAL DE CONFIRMAÇÃO (COM OSCILAÇÃO DRAMÁTICA) */}
      {phase === 'confirming' && (
        <div className="flex-1 flex items-center justify-center bg-black/80 p-6 animate-in zoom-in duration-300">
          <div className="bg-zinc-900 rounded-[2.5rem] w-full max-w-xs overflow-hidden border border-white/5 shadow-[0_0_100px_rgba(255,0,0,0.1)]">
            <div className="p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
                <AlertCircle className="w-10 h-10 text-red-500 animate-pulse" />
              </div>
              <h3 className="text-white font-black text-2xl uppercase tracking-tighter italic">DELETAR CONTA?</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Esta ação removerá permanentemente todos os seus dados das plataformas Meta (Instagram, Facebook e Horizon).
              </p>
            </div>
            <div className="border-t border-zinc-800 flex flex-col">
              <button className={`p-6 font-black uppercase tracking-widest text-sm border-b border-zinc-800 transition-all duration-300 ${oscillationTarget === 'yes' ? 'bg-red-600 text-white' : 'text-red-500'}`}>
                Sim, apagar agora
              </button>
              <button className={`p-6 font-black uppercase tracking-widest text-xs transition-all duration-300 ${oscillationTarget === 'no' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FASE: SUCESSO E DISCLAIMER */}
      {phase === 'success' && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-black animate-in fade-in duration-700 text-center space-y-8">
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center animate-bounce shadow-[0_0_50px_rgba(34,197,94,0.3)]">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter">
              SUA CONTA NO INSTAGRAM FOI DELETADA COM SUCESSO!
            </h2>
            <p className="text-zinc-500 text-lg md:text-xl font-medium italic animate-pulse">
              (Calma calma brincadeirinha 🤭)
            </p>
          </div>
          <div className="pt-12">
            <div className="w-12 h-12 border-2 border-zinc-800 border-t-white rounded-full animate-spin"></div>
          </div>
        </div>
      )}

      {isGlitching && phase === 'scrolling' && (
        <div className="absolute inset-0 z-[300] pointer-events-none mix-blend-overlay">
           <div className="absolute inset-0 bg-red-500/10 animate-pulse"></div>
           <div className="absolute inset-0 bg-blue-500/10 animate-[ping_0.2s_infinite]"></div>
        </div>
      )}
    </div>
  );
};

export default Act0InstagramScroll;