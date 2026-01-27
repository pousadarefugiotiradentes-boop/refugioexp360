
import React from 'react';
import { UserProfile } from '../types';
import { HERO_IMAGE_URL, LOGO_URL } from '../constants';
import { 
  Coffee, 
  Moon, 
  ArrowRight, 
  MapPin, 
  ShieldCheck,
  Star,
  Heart,
  Navigation,
  Eye,
  Maximize2
} from 'lucide-react';

interface Act4OfferProps {
  userProfile: UserProfile;
}

const Act4Offer: React.FC<Act4OfferProps> = ({ userProfile }) => {
  const BOOKING_URL = "https://www.refugiotiradentes.com.br/";
  const VIRTUAL_TOUR_URL = "https://www.google.com/maps/embed?pb=!4v1769471411322!6m8!1m7!1sCAoSHENJQUJJaERwb19wdS1DUVpLN2pRY1g1QW81ZkE.!2m2!1d-21.10843422899292!2d-44.16852750791136!3f353.93514061676234!4f-0.5637616834684138!5f0.7820865974627469";
  
  const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=2000";

  const handleBooking = () => {
    window.location.href = BOOKING_URL;
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0a] text-white overflow-y-auto scroll-smooth font-sans selection:bg-amber-500 selection:text-black">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[750px] flex flex-col justify-end p-6 md:p-16 overflow-hidden shrink-0">
        <div 
          className="absolute inset-0 bg-cover bg-center scale-100 animate-slow-zoom transition-transform duration-[30s]"
          style={{ 
            backgroundImage: `url('${HERO_IMAGE_URL}'), url('${FALLBACK_IMAGE}')`,
            backgroundPosition: 'center 40%' 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10" />
        
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-20 pointer-events-none hidden lg:flex justify-between px-16 xl:px-32">
           <div className="w-44 h-44 bg-white rounded-full flex flex-col items-center justify-center p-5 border-[14px] border-zinc-900 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] animate-in slide-in-from-left-24 duration-1000 rotate-[-5deg]">
              <img src={LOGO_URL} alt="Selo" className="w-24 opacity-95" />
              <span className="text-[9px] font-black text-zinc-500 mt-2 uppercase tracking-widest">Est. 2004</span>
           </div>
           <div className="w-44 h-44 bg-white rounded-full flex flex-col items-center justify-center p-5 border-[14px] border-zinc-900 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] animate-in slide-in-from-right-24 duration-1000 rotate-[5deg]">
              <img src={LOGO_URL} alt="Selo" className="w-24 opacity-95" />
              <span className="text-[9px] font-black text-zinc-500 mt-2 uppercase tracking-widest">Tiradentes</span>
           </div>
        </div>
        
        <div className="relative z-30 max-w-5xl w-full mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 pb-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-amber-500 text-black text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-[0_0_30px_rgba(245,158,11,0.6)]">
                CHEGADA CONFIRMADA
              </div>
              <div className="flex -space-x-1">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 text-amber-500 fill-amber-500" />)}
              </div>
            </div>
            
            <h1 className="text-6xl md:text-[9rem] xl:text-[11rem] font-black uppercase tracking-tighter leading-[0.75] italic drop-shadow-2xl">
              O SEU <span className="text-amber-500">REFÚGIO</span><br/>
              É REAL.
            </h1>
            
            <p className="text-xl md:text-3xl text-zinc-100 max-w-3xl font-medium leading-tight drop-shadow-2xl border-l-4 border-amber-500 pl-6">
              As pedras que você vê guardam a história de Tiradentes e o silêncio que sua mente implora. <span className="italic font-black text-white">Bem-vindo ao lar.</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <button 
              onClick={handleBooking}
              className="bg-amber-600 hover:bg-amber-500 text-white px-14 py-7 rounded-2xl font-black text-lg uppercase italic tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[0_20px_60px_-15px_rgba(217,119,6,0.6)] flex items-center gap-4 group"
            >
              ATIVAR MINHA RESERVA AGORA
              <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Seção de Experiência */}
      <section className="bg-zinc-950 py-32 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10">
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Navigation className="w-5 h-5 text-amber-500" />
                <span className="text-amber-500 text-xs font-black uppercase tracking-[0.4em]">Arquitetura e Natureza</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none">
                SOLIDEZ EM CADA <span className="text-amber-500">PEDRA.</span>
              </h2>
              <p className="text-zinc-400 text-xl leading-relaxed font-light">
                O que você viu na entrada é apenas o começo. Cada detalhe da nossa estrutura foi pensado para oferecer proteção, conforto e uma conexão genuína com Minas Gerais.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { icon: Coffee, title: "Café Mineiro", desc: "Sabores de família feitos com calma." },
                { icon: Moon, title: "Isolamento", desc: "Muros que barram o ruído do mundo." },
                { icon: MapPin, title: "Local Nobre", desc: "Perto de tudo, longe do barulho." },
                { icon: ShieldCheck, title: "Paz VIP", desc: "Atendimento personalizado e discreto." }
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-4 p-8 rounded-[2rem] bg-zinc-900 border border-white/5 hover:border-amber-500/30 transition-all group">
                  <item.icon className="w-8 h-8 text-amber-500" />
                  <div>
                    <h4 className="font-black text-sm uppercase tracking-wider mb-2">{item.title}</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed uppercase tracking-tighter">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative group">
             <div className="absolute -inset-10 bg-amber-500/5 blur-[100px] rounded-full"></div>
             <img 
               src={HERO_IMAGE_URL} 
               onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
               alt="Sua Pousada" 
               className="rounded-[3rem] shadow-2xl border border-white/10 group-hover:scale-[1.03] transition-transform duration-1000" 
             />
          </div>
        </div>
      </section>

      {/* NOVO: Portal de Imersão (Tour Virtual) */}
      <section className="py-32 px-6 bg-black relative">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-4 text-amber-500 mb-2">
              <Eye className="w-6 h-6 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-[0.6em]">Acesso de Visualização Ativo</span>
            </div>
            <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter leading-tight">
              TELEPORTE-SE PARA<br/>
              O <span className="text-amber-500">REFÚGIO</span>
            </h2>
            <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto">
              Use o portal abaixo para caminhar pela nossa entrada e sentir a atmosfera antes mesmo de chegar.
            </p>
          </div>

          <div className="relative group max-w-5xl mx-auto">
            {/* Decoração Tech Frame */}
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-900/50 via-amber-500/20 to-amber-900/50 rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="relative bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
              {/* Barra de Status do Portal */}
              <div className="bg-zinc-800/80 px-8 py-3 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Portal 01: Entrada Principal</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-[9px] font-mono text-zinc-600 uppercase hidden sm:block">Lat: -21.1084 | Long: -44.1685</div>
                  <Maximize2 className="w-4 h-4 text-zinc-600" />
                </div>
              </div>

              {/* Iframe Responsivo */}
              <div className="w-full aspect-[4/3] sm:aspect-video md:min-h-[600px]">
                <iframe 
                  src={VIRTUAL_TOUR_URL} 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                ></iframe>
              </div>

              {/* Overlay Sutil de "Scan" */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]"></div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-[0.4em]">Toque ou clique nas setas para navegar</p>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-40 px-6 bg-[#050505] relative overflow-hidden border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
          <h3 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85]">
            A PORTA ESTÁ <span className="text-amber-500 underline decoration-white/10">ABERTA.</span><br/>
            VOCÊ VAI ENTRAR?
          </h3>
          <p className="text-zinc-500 text-lg md:text-2xl font-medium">
            O convite foi feito. O destino é inevitável.
          </p>
          <button 
            onClick={handleBooking}
            className="w-full max-w-lg bg-white text-black py-8 rounded-[2.5rem] font-black text-2xl uppercase tracking-widest hover:bg-amber-500 transition-all shadow-[0_40px_80px_-20px_rgba(255,255,255,0.15)] active:scale-95 group"
          >
            CONFIRMAR MINHA FUGA
          </button>
        </div>
      </section>

      <footer className="py-20 text-center flex flex-col items-center gap-6 bg-black">
         <div className="w-16 h-16 bg-white rounded-full p-2.5 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-transform hover:scale-110">
            <img src={LOGO_URL} alt="Logo" className="w-full h-full object-contain" />
         </div>
         <p className="text-[10px] text-zinc-700 uppercase tracking-[0.5em] font-bold">A PAZ É O SEU NOVO CÓDIGO</p>
         <div className="flex gap-4 opacity-20">
            <Heart className="w-4 h-4 text-red-500 animate-pulse" />
         </div>
      </footer>
    </div>
  );
};

export default Act4Offer;
